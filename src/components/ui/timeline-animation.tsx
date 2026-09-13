"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { ElementType, ReactNode, RefObject, createElement } from "react";

interface TimelineContentProps {
  children: ReactNode;
  as?: ElementType;
  animationNum: number;
  timelineRef: RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
  [key: string]: unknown;
}

const defaultVariants: Variants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
  hidden: { y: 20, opacity: 0 },
};

export function TimelineContent({
  children,
  as = "div",
  animationNum,
  timelineRef,
  customVariants,
  className,
  ...props
}: TimelineContentProps) {
  const isInView = useInView(timelineRef, { once: true, amount: 0.3 });
  const MotionComponent = motion.create(as as ElementType);

  return createElement(
    MotionComponent,
    {
      initial: "hidden",
      animate: isInView ? "visible" : "hidden",
      custom: animationNum,
      variants: customVariants ?? defaultVariants,
      className,
      ...props,
    },
    children
  );
}
