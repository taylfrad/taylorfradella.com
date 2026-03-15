import { spawn } from "node:child_process";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const OUT_DIR = path.join(process.cwd(), "perf-artifacts");
const PREVIEW_URL = process.env.PREVIEW_URL || "http://127.0.0.1:4173/";
const TRACE_MS = Number(process.env.TRACE_MS || 20_000);
const DEBUG_PORT = Number(process.env.DEBUG_PORT || 9222);

const BASELINE_SCENARIOS = [
  { name: "idle", label: "20s idle on landing page" },
  { name: "scroll", label: "20s scroll through long page" },
  {
    name: "interaction",
    label: "20s hero interaction (hover + drag motions over lanyard)",
  },
];

const MAIN_SCRIPTING_EVENTS = new Set([
  "EvaluateScript",
  "FunctionCall",
  "EventDispatch",
  "V8.Execute",
  "v8.execute",
  "CompileScript",
  "RunMicrotasks",
  "FireAnimationFrame",
  "TimerFire",
]);

const MAIN_RENDER_EVENTS = new Set([
  "UpdateLayoutTree",
  "Layout",
  "RecalculateStyles",
  "PrePaint",
  "Paint",
  "CompositeLayers",
  "Commit",
]);

const MAIN_COMPOSITE_EVENTS = new Set([
  "Paint",
  "CompositeLayers",
  "RasterTask",
  "Commit",
  "ActivateLayerTree",
  "DrawFrame",
]);

function nowIso() {
  return new Date().toISOString();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toMetricMap(metrics = []) {
  const map = {};
  for (const metric of metrics) {
    map[metric.name] = metric.value;
  }
  return map;
}

function diffMetrics(before, after, keys) {
  const out = {};
  for (const key of keys) {
    const a = Number(after?.[key] ?? 0);
    const b = Number(before?.[key] ?? 0);
    out[key] = Math.max(0, a - b);
  }
  return out;
}

async function waitForHttp(url, timeoutMs = 30_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // Keep polling.
    }
    await wait(250);
  }
  throw new Error(`Timed out waiting for HTTP endpoint: ${url}`);
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch JSON (${res.status}): ${url}`);
  }
  return res.json();
}

function findChromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);

  return candidates.find((candidate) => {
    try {
      return fsSync.existsSync(candidate);
    } catch {
      return false;
    }
  });
}

function launchPreview() {
  const viteCmd = path.join(
    process.cwd(),
    "node_modules",
    ".bin",
    "vite.cmd",
  );
  return spawn(
    "cmd.exe",
    ["/c", viteCmd, "preview", "--host", "127.0.0.1", "--port", "4173"],
    {
      cwd: process.cwd(),
      stdio: "ignore",
      windowsHide: true,
    },
  );
}

function launchChrome(chromePath, port, userDataDir) {
  const args = [
    `--remote-debugging-port=${port}`,
    "--headless=new",
    "--disable-background-networking",
    "--disable-default-apps",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--mute-audio",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ];

  return spawn(chromePath, args, {
    cwd: process.cwd(),
    stdio: "ignore",
    windowsHide: true,
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.socket = null;
    this.seq = 0;
    this.pending = new Map();
    this.listeners = new Set();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      const socket = new WebSocket(this.wsUrl);
      socket.addEventListener("open", () => {
        this.socket = socket;
        resolve();
      });
      socket.addEventListener("error", (error) => {
        reject(error);
      });
      socket.addEventListener("message", (event) => {
        const payload = JSON.parse(event.data);
        if (payload.id) {
          const entry = this.pending.get(payload.id);
          if (!entry) return;
          this.pending.delete(payload.id);
          if (payload.error) {
            entry.reject(new Error(payload.error.message));
          } else {
            entry.resolve(payload.result);
          }
          return;
        }

        for (const listener of this.listeners) {
          listener(payload);
        }
      });
      socket.addEventListener("close", () => {
        for (const [, entry] of this.pending) {
          entry.reject(new Error("CDP socket closed"));
        }
        this.pending.clear();
      });
    });
  }

  onEvent(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  send(method, params = {}, sessionId) {
    const id = ++this.seq;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify(payload));
    });
  }

  async close() {
    if (!this.socket) return;
    await new Promise((resolve) => {
      this.socket.addEventListener("close", resolve, { once: true });
      this.socket.close();
    });
  }
}

function analyzeTrace(traceEvents, metricsBefore, metricsAfter) {
  const events = Array.isArray(traceEvents) ? traceEvents : [];
  const metricKeys = [
    "TaskDuration",
    "ScriptDuration",
    "LayoutDuration",
    "RecalcStyleDuration",
    "PaintDuration",
    "CompositingDuration",
  ];
  const metricDiff = diffMetrics(metricsBefore, metricsAfter, metricKeys);

  const mainThreadCandidates = new Map();
  for (const event of events) {
    if (event?.name !== "thread_name") continue;
    if (event?.args?.name !== "CrRendererMain") continue;
    const key = `${event.pid}:${event.tid}`;
    mainThreadCandidates.set(key, {
      pid: event.pid,
      tid: event.tid,
      score: 0,
    });
  }

  for (const event of events) {
    if (event?.name !== "RunTask" || event?.ph !== "X") continue;
    const key = `${event.pid}:${event.tid}`;
    const candidate = mainThreadCandidates.get(key);
    if (!candidate) continue;
    candidate.score += event.dur || 0;
  }

  const bestMainThread = [...mainThreadCandidates.values()].sort(
    (a, b) => b.score - a.score,
  )[0];

  const mainEvents = bestMainThread
    ? events.filter(
        (event) =>
          event.pid === bestMainThread.pid &&
          event.tid === bestMainThread.tid &&
          event.ph === "X" &&
          typeof event.dur === "number",
      )
    : [];

  let scriptingMs = 0;
  let renderingMs = 0;
  let compositeMs = 0;

  for (const event of mainEvents) {
    const durMs = event.dur / 1000;
    if (MAIN_SCRIPTING_EVENTS.has(event.name)) scriptingMs += durMs;
    if (MAIN_RENDER_EVENTS.has(event.name)) renderingMs += durMs;
    if (MAIN_COMPOSITE_EVENTS.has(event.name)) compositeMs += durMs;
  }

  const longTasks = mainEvents
    .filter(
      (event) =>
        (event.name === "RunTask" ||
          event.name === "ThreadControllerImpl::RunTask") &&
        event.dur > 50_000,
    )
    .map((event) => event.dur / 1000);

  const frameTimes = events
    .filter((event) => event.name === "DrawFrame" && typeof event.ts === "number")
    .map((event) => event.ts)
    .sort((a, b) => a - b);

  let avgFps = 0;
  let fpsDipCount = 0;
  if (frameTimes.length > 1) {
    const durationSec = (frameTimes[frameTimes.length - 1] - frameTimes[0]) / 1_000_000;
    if (durationSec > 0) {
      avgFps = (frameTimes.length - 1) / durationSec;
    }
    for (let i = 1; i < frameTimes.length; i += 1) {
      const frameDeltaMs = (frameTimes[i] - frameTimes[i - 1]) / 1000;
      if (frameDeltaMs > 22.22) fpsDipCount += 1;
    }
  }

  return {
    metricsDiffSeconds: metricDiff,
    traceBreakdownMs: {
      scriptingMs: Number(scriptingMs.toFixed(2)),
      renderingMs: Number(renderingMs.toFixed(2)),
      compositeMs: Number(compositeMs.toFixed(2)),
    },
    longTasks: {
      count: longTasks.length,
      maxMs: Number((Math.max(0, ...longTasks) || 0).toFixed(2)),
      totalMs: Number(
        longTasks.reduce((sum, value) => sum + value, 0).toFixed(2),
      ),
    },
    fps: {
      avg: Number(avgFps.toFixed(2)),
      dipsBelow45: fpsDipCount,
      sampledFrames: frameTimes.length,
    },
    traceEventCount: events.length,
  };
}

async function evaluateExpression(client, sessionId, expression) {
  const result = await client.send(
    "Runtime.evaluate",
    { expression, awaitPromise: true, returnByValue: true },
    sessionId,
  );
  return result.result?.value;
}

async function runScenario(client, sessionId, scenario, durationMs) {
  await client.send("Page.navigate", { url: PREVIEW_URL }, sessionId);
  await wait(2_500);
  await client.send(
    "Runtime.evaluate",
    { expression: "window.scrollTo(0, 0);" },
    sessionId,
  );
  await wait(400);

  const beforeMetrics = toMetricMap(
    (await client.send("Performance.getMetrics", {}, sessionId)).metrics,
  );

  const traceEvents = [];
  const removeListener = client.onEvent((payload) => {
    if (payload.method !== "Tracing.dataCollected") return;
    const values = payload.params?.value;
    if (Array.isArray(values)) {
      traceEvents.push(...values);
    }
  });

  await client.send(
    "Tracing.start",
    {
      categories: [
        "devtools.timeline",
        "disabled-by-default-devtools.timeline",
        "disabled-by-default-devtools.timeline.frame",
        "blink.user_timing",
        "toplevel",
        "v8",
        "cc",
        "gpu",
      ].join(","),
      transferMode: "ReportEvents",
    },
    sessionId,
  );

  if (scenario.name === "idle") {
    await wait(durationMs);
  } else if (scenario.name === "scroll") {
    await evaluateExpression(
      client,
      sessionId,
      `(() => new Promise((resolve) => {
        const duration = ${durationMs};
        const start = performance.now();
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        function step(now) {
          const t = Math.min(1, (now - start) / duration);
          const wave = 0.5 - 0.5 * Math.cos(t * Math.PI * 2);
          window.scrollTo(0, maxScroll * wave);
          if (t >= 1) {
            window.scrollTo(0, 0);
            resolve(true);
            return;
          }
          requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }))()`,
    );
  } else if (scenario.name === "interaction") {
    await evaluateExpression(
      client,
      sessionId,
      "window.scrollTo({ top: 0, behavior: 'auto' }); true;",
    );
    await wait(400);

    const viewport = await evaluateExpression(
      client,
      sessionId,
      "({ width: window.innerWidth, height: window.innerHeight })",
    );
    const width = viewport?.width || 1440;
    const height = viewport?.height || 900;
    const centerX = width * 0.34;
    const centerY = height * 0.5;
    const started = Date.now();
    let mouseDown = false;

    while (Date.now() - started < durationMs) {
      const elapsed = Date.now() - started;
      const theta = elapsed / 350;
      const x = centerX + Math.cos(theta) * 130;
      const y = centerY + Math.sin(theta * 0.8) * 95;

      await client.send(
        "Input.dispatchMouseEvent",
        { type: "mouseMoved", x, y, buttons: mouseDown ? 1 : 0 },
        sessionId,
      );

      const cycle = elapsed % 2600;
      if (!mouseDown && cycle < 100) {
        await client.send(
          "Input.dispatchMouseEvent",
          { type: "mousePressed", x, y, button: "left", buttons: 1, clickCount: 1 },
          sessionId,
        );
        mouseDown = true;
      } else if (mouseDown && cycle > 1400 && cycle < 1500) {
        await client.send(
          "Input.dispatchMouseEvent",
          { type: "mouseReleased", x, y, button: "left", buttons: 0, clickCount: 1 },
          sessionId,
        );
        mouseDown = false;
      }

      await wait(16);
    }

    if (mouseDown) {
      await client.send(
        "Input.dispatchMouseEvent",
        { type: "mouseReleased", x: centerX, y: centerY, button: "left", buttons: 0, clickCount: 1 },
        sessionId,
      );
    }
  }

  const tracingComplete = new Promise((resolve) => {
    const stopListener = client.onEvent((payload) => {
      if (payload.method === "Tracing.tracingComplete") {
        stopListener();
        resolve();
      }
    });
  });

  await client.send("Tracing.end", {}, sessionId);
  await tracingComplete;
  removeListener();

  const afterMetrics = toMetricMap(
    (await client.send("Performance.getMetrics", {}, sessionId)).metrics,
  );

  return {
    scenario: scenario.name,
    label: scenario.label,
    durationMs,
    analysis: analyzeTrace(traceEvents, beforeMetrics, afterMetrics),
    rawMetrics: {
      before: beforeMetrics,
      after: afterMetrics,
    },
    traceEvents,
  };
}

async function runPass(client, sessionId, passName, cpuThrottleRate = 1) {
  await client.send("Performance.enable", {}, sessionId);
  await client.send(
    "Emulation.setCPUThrottlingRate",
    { rate: cpuThrottleRate },
    sessionId,
  );

  const results = [];
  for (const scenario of BASELINE_SCENARIOS) {
    const result = await runScenario(client, sessionId, scenario, TRACE_MS);
    results.push(result);
  }

  return {
    passName,
    cpuThrottleRate,
    recordedAt: nowIso(),
    scenarios: results,
  };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const chromePath = findChromePath();
  if (!chromePath) {
    throw new Error(
      "Chrome/Edge executable not found. Set CHROME_PATH to a valid browser binary.",
    );
  }

  const previewProcess = launchPreview();
  let chromeProcess;
  let client;

  try {
    await waitForHttp(PREVIEW_URL, 45_000);

    const chromeDataDir = path.join(OUT_DIR, "chrome-profile");
    await fs.mkdir(chromeDataDir, { recursive: true });
    chromeProcess = launchChrome(chromePath, DEBUG_PORT, chromeDataDir);

    await waitForHttp(`http://127.0.0.1:${DEBUG_PORT}/json/version`, 20_000);
    const { webSocketDebuggerUrl } = await getJson(
      `http://127.0.0.1:${DEBUG_PORT}/json/version`,
    );

    client = new CdpClient(webSocketDebuggerUrl);
    await client.connect();

    const target = await client.send("Target.createTarget", {
      url: "about:blank",
      newWindow: false,
    });
    const attach = await client.send("Target.attachToTarget", {
      targetId: target.targetId,
      flatten: true,
    });
    const sessionId = attach.sessionId;

    await client.send("Page.enable", {}, sessionId);
    await client.send("Runtime.enable", {}, sessionId);
    await client.send("Network.enable", {}, sessionId);

    await client.send(
      "Emulation.setDeviceMetricsOverride",
      {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      },
      sessionId,
    );

    const normalPass = await runPass(client, sessionId, "normal-machine", 1);
    const throttledPass = await runPass(client, sessionId, "low-end-proxy-4x", 4);

    const bundle = {
      createdAt: nowIso(),
      previewUrl: PREVIEW_URL,
      traceDurationMs: TRACE_MS,
      passes: [normalPass, throttledPass],
    };

    const filePath = path.join(OUT_DIR, "cpu-profile.json");

    // Save raw traces per pass/scenario for deep-dive in DevTools.
    for (const pass of bundle.passes) {
      for (const scenario of pass.scenarios) {
        const tracePath = path.join(
          OUT_DIR,
          `trace-${pass.passName}-${scenario.scenario}.json`,
        );
        await fs.writeFile(
          tracePath,
          JSON.stringify({ traceEvents: scenario.traceEvents }),
          "utf8",
        );
        delete scenario.traceEvents;
      }
    }

    await fs.writeFile(filePath, JSON.stringify(bundle, null, 2), "utf8");
    process.stdout.write(`Wrote profiling bundle: ${filePath}\n`);
  } finally {
    if (client) {
      await client.close().catch(() => {});
    }
    if (chromeProcess && !chromeProcess.killed) {
      chromeProcess.kill();
    }
    if (previewProcess && !previewProcess.killed) {
      previewProcess.kill();
    }
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
