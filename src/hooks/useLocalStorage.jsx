import { useState, useEffect } from 'react';
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error parsing localStorage item ${key}:`, error);
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
};

export default useLocalStorage;
