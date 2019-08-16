import { useEffect } from 'react';

export default function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: () => void
): void {
  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      callback();
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('click', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside);
    };
  });
}
