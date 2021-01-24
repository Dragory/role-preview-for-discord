import { useEffect, useRef } from "react";

export function useEffectIgnoreFirstCall(effect: any, deps: any[]) {
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    effect();
  }, deps);
}
