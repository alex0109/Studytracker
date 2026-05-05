import { useEffect, useState } from "react";

// function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);

//   return debouncedValue;
// }

function useDebounce(fn: () => void, delay: number) {
  let timeoutID: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => fn(...args), delay);
  };
}

export default useDebounce;

// const debounce = (func, wait, immediate) => {
//   let timeout

//   return function() {
//     const context = this, args = arguments
//     const later = function() {
//       timeout = null
//       if (!immediate) func.apply(context, args)
//     }

//     const callNow = immediate && !timeout
//     clearTimeout(timeout)
//     timeout = setTimeout(later, wait)
//     if (callNow) func.apply(context, args)
//   }
// }
