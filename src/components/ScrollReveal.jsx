import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the target element enters the viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once revealed, no need to observe anymore
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px' // Triggers slightly before the element enters the viewport
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <div 
      ref={ref}
      className={`transform transition-all duration-700 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-[-30px] opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;