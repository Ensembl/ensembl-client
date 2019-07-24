import { useRef, useState, useEffect } from 'react';

type UseHoverType = [React.RefObject<HTMLElement>, boolean];

export default function useHover(): UseHoverType {
  const [isHovering, setIsHovering] = useState(false);
  let isTouched = false;

  const ref = useRef<HTMLElement>(null);

  const handleMouseEnter = () => {
    if (!isTouched) {
      setIsHovering(true);
    }
    isTouched = false;
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleTouch = () => {
    isTouched = true;
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('touchstart', handleTouch);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('touchend', handleTouch);
      };
    }
  }, [ref.current]);

  return [ref, isHovering];
}
