"use client";

import { FC, useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export const CountUp: FC<CountUpProps> = ({
  value,
  decimals = 0,
  suffix = "",
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView || reduceMotion) return;

    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: setDisplay,
    });

    return () => controls.stop();
  }, [isInView, value, reduceMotion]);

  // Without motion the number simply appears once it is seen
  const shown = reduceMotion && isInView ? value : display;

  return (
    <span ref={ref} className={className}>
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
};
