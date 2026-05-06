import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

// Remider

// Optimizing API Calls: Consider a scenario where a user is typing in a search bar.
// Without debounce, an API call would be triggered with every keystroke,
// potentially overwhelming the server with unnecessary requests.
// With debounce, we can delay the API call until the user pauses typing,
// reducing the number of requests and optimizing server load.

// Improving Performance: In components like autocomplete suggestions or real-time filtering,
// frequent updates in response to every keystroke can lead to performance issues,
// causing laggy UI updates and decreased responsiveness.
// Debouncing ensures that updates are only triggered after a short period of inactivity,
// resulting in smoother performance and a more seamless user experience.

// Enhancing User Experience: Instant feedback to user input isn’t always ideal.
// For tasks like searching, typing, or filtering,
// waiting until the user has finished inputting before triggering actions provides a more predictable and pleasant user experience.
// Debounce prevents rapid, jarring changes and ensures a more controlled interaction flow.

// Mitigating Race Conditions: Without debounce, rapid firing of events can lead to race conditions,
// where multiple asynchronous tasks compete to execute, potentially causing unpredictable behavior.
// Debounce mitigates this risk by ensuring that only the last event within a specified time frame triggers the action,
// avoiding race conditions and maintaining application stability.
