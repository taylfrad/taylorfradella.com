import { useTheme } from "@/components/theme-provider";

export default function useReducedMotion() {
  const { shouldReduceEffects } = useTheme();
  return shouldReduceEffects;
}
