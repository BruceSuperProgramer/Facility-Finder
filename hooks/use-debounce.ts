import { useRef, useCallback } from "react";

/**
 * Debounces a function by delaying its execution until after a specified delay
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds (default: 300ms)
 * @returns A debounced version of the callback
 */
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 300
): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  callbackRef.current = callback;

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T;

  return debouncedCallback;
};
