import { Sparkles } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { reduceEffects, setReduceEffects } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setReduceEffects(!reduceEffects)}
      aria-pressed={reduceEffects}
      aria-label={reduceEffects ? "Enable animations" : "Reduce animations"}
      className="h-9 rounded-full border border-transparent px-2 text-foreground/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-foreground hover:shadow-[0_8px_18px_rgba(2,6,23,0.35)] focus-visible:ring-white/35 motion-reduce:transform-none sm:px-2.5"
    >
      <Sparkles className="h-4 w-4 sm:mr-1.5" />
      <span className="hidden text-xs sm:inline sm:text-sm">Reduce Animations</span>
    </Button>
  );
}
