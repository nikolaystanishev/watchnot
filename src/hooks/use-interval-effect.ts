import { useEffect, useRef } from "react";


export function useIntervalEffect(callback: Function, delay?: number | null) {
  const savedCallback = useRef<Function>();
  const shouldFetchFirst = useRef<number>(0);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);


  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current();
    }

    if (shouldFetchFirst.current <= 1) {
      tick();
      return () => {
        shouldFetchFirst.current++;
      };
    }

    if (delay != null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [callback, delay]);
}
