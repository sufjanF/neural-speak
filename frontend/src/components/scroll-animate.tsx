"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollAnimateProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom" | "flip";
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollAnimate({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.1,
  once = false,
}: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, once]);

  const getAnimationStyles = () => {
    const baseTransition = `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
    
    const animations = {
      "fade-up": {
        hidden: { opacity: 0, transform: "translateY(60px)" },
        visible: { opacity: 1, transform: "translateY(0)" },
      },
      "fade-down": {
        hidden: { opacity: 0, transform: "translateY(-60px)" },
        visible: { opacity: 1, transform: "translateY(0)" },
      },
      "fade-left": {
        hidden: { opacity: 0, transform: "translateX(60px)" },
        visible: { opacity: 1, transform: "translateX(0)" },
      },
      "fade-right": {
        hidden: { opacity: 0, transform: "translateX(-60px)" },
        visible: { opacity: 1, transform: "translateX(0)" },
      },
      "zoom": {
        hidden: { opacity: 0, transform: "scale(0.9)" },
        visible: { opacity: 1, transform: "scale(1)" },
      },
      "flip": {
        hidden: { opacity: 0, transform: "perspective(1000px) rotateX(20deg)" },
        visible: { opacity: 1, transform: "perspective(1000px) rotateX(0deg)" },
      },
    };

    const state = isVisible ? "visible" : "hidden";
    return {
      ...animations[animation][state],
      transition: baseTransition,
    };
  };

  return (
    <div
      ref={ref}
      className={className}
      style={getAnimationStyles()}
    >
      {children}
    </div>
  );
}

// Staggered children animation
interface ScrollStaggerProps {
  children: ReactNode[];
  className?: string;
  childClassName?: string;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom";
  staggerDelay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollStagger({
  children,
  className = "",
  childClassName = "",
  animation = "fade-up",
  staggerDelay = 100,
  duration = 600,
  threshold = 0.1,
  once = false,
}: ScrollStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, once]);

  const getChildStyle = (index: number) => {
    const baseTransition = `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${index * staggerDelay}ms`;
    
    const animations = {
      "fade-up": {
        hidden: { opacity: 0, transform: "translateY(40px)" },
        visible: { opacity: 1, transform: "translateY(0)" },
      },
      "fade-down": {
        hidden: { opacity: 0, transform: "translateY(-40px)" },
        visible: { opacity: 1, transform: "translateY(0)" },
      },
      "fade-left": {
        hidden: { opacity: 0, transform: "translateX(40px)" },
        visible: { opacity: 1, transform: "translateX(0)" },
      },
      "fade-right": {
        hidden: { opacity: 0, transform: "translateX(-40px)" },
        visible: { opacity: 1, transform: "translateX(0)" },
      },
      "zoom": {
        hidden: { opacity: 0, transform: "scale(0.85)" },
        visible: { opacity: 1, transform: "scale(1)" },
      },
    };

    const state = isVisible ? "visible" : "hidden";
    return {
      ...animations[animation][state],
      transition: baseTransition,
    };
  };

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div key={index} className={childClassName} style={getChildStyle(index)}>
          {child}
        </div>
      ))}
    </div>
  );
}

// Parallax scroll effect
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative = opposite direction
}

export function Parallax({ children, className = "", speed = 0.5 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      const parallaxOffset = scrolled * speed * 0.1;
      setOffset(parallaxOffset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
}

// Counter animation on scroll
interface CounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function ScrollCounter({
  end,
  prefix = "",
  suffix = "",
  duration = 2000,
  className = "",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
