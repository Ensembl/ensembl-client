import { useEffect } from 'react';

export default function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: () => void
) {
  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
}
