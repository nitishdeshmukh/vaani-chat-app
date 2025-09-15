"use client";

import { motion } from "motion/react";
import React from "react";
import { cn } from "../../lib/utils";

const animationProps = {
  initial: { "--x": "100%" },
  animate: { "--x": "-100%" },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    duration: 2,
    ease: "linear",
  },
};

export const ShinyButton = React.forwardRef(
  ({ children, className, textClassName, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative cursor-pointer rounded-lg px-6 py-2 font-medium backdrop-blur-xl border transition-shadow duration-300 ease-in-out hover:shadow overflow-hidden",
          className
        )}
        style={{
          "--primary": "210 40% 20%", // Define primary color as HSL values
        }}
        {...animationProps}
        {...props}
      >
        <span className={cn("relative block size-full", textClassName)}>
          {children}
        </span>

        {/* Shine effect overlay */}
        <span
          className="absolute inset-0 z-10 block rounded-[inherit]"
          style={{
            background: `linear-gradient(-75deg,
              transparent calc(var(--x) + 20%), 
              rgba(255,255,255,0.4) calc(var(--x) + 30%), 
              transparent calc(var(--x) + 40%)
            )`,
          }}
        />
      </motion.button>
    );
  }
);

ShinyButton.displayName = "ShinyButton";
