import { useState, useEffect } from 'react';
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    try {
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error parsing localStorage item ${key}:`, error);
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
}

export default useLocalStorage;
