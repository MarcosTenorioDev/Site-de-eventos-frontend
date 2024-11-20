import { useState, useRef, useEffect } from "react";
import { motion, Variant, Variants } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  initialAnimation?: Variant;
  animateIn?: Variant;
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string | number[];
  };
  threshold?: number;
  triggerOnce?: boolean;
}

const defaultInitialAnimation: Variant = { opacity: 0, y: 50 };
const defaultAnimateIn: Variant = { opacity: 1, y: 0 };

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  initialAnimation = defaultInitialAnimation,
  animateIn = defaultAnimateIn,
  transition = { duration: 0.5 },
  threshold = 0.1,
  triggerOnce = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, triggerOnce]);

  const variants: Variants = {
    hidden: initialAnimation,
    visible: animateIn,
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;