import React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const Loader = ({
  isLoading = true,
  className,
  containerClassName,
  logoClassName,
}) => {
  const logoVariants = {
    initial: {
      scale: 1,
      boxShadow: "0 0 0 rgba(99, 102, 241, 0)",
    },
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 rgba(99, 102, 241, 0)",
        "0 0 20px rgba(99, 102, 241, 0.3)",
        "0 0 0 rgba(99, 102, 241, 0)",
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Container animation for fade in/out
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (!isLoading) return null;

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div
        className={cn(
          "flex flex-col items-center",
          // Breakpoint range spacing
          "max-sm:space-y-3", // Mobile: < 640px
          "sm:max-md:space-y-4", // Small tablets: 640px - 768px
          "md:max-lg:space-y-5", // Medium tablets: 768px - 1024px
          "lg:max-xl:space-y-6", // Large screens: 1024px - 1280px
          "xl:space-y-7", // Extra large: ≥ 1280px
          containerClassName
        )}
      >
        {/* Logo Spinner with Ping Circles */}
        <div className="relative flex items-center justify-center">
          {/* Ping Circle 1 - Larger - Using breakpoint ranges */}
          <div
            className={cn(
              "absolute rounded-full border-neutral-900 animate-ping",
              // Mobile: < 640px
              "max-sm:w-18 max-sm:h-18 max-sm:border",
              // Small tablets: 640px - 768px
              "sm:max-md:w-22 sm:max-md:h-22 sm:max-md:border",
              // Medium tablets: 768px - 1024px
              "md:max-lg:w-28 md:max-lg:h-28 md:max-lg:border-2",
              // Large screens: 1024px - 1280px
              "lg:max-xl:w-32 lg:max-xl:h-32 lg:max-xl:border-2",
              // Extra large: ≥ 1280px
              "xl:w-36 xl:h-36 xl:border-2"
            )}
          ></div>

          {/* Ping Circle 2 - Smaller - Using breakpoint ranges */}
          <div
            className={cn(
              "absolute rounded-full border-neutral-900 animate-ping",
              // Mobile: < 640px
              "max-sm:w-14 max-sm:h-14 max-sm:border",
              // Small tablets: 640px - 768px
              "sm:max-md:w-18 sm:max-md:h-18 sm:max-md:border",
              // Medium tablets: 768px - 1024px
              "md:max-lg:w-24 md:max-lg:h-24 md:max-lg:border-2",
              // Large screens: 1024px - 1280px
              "lg:max-xl:w-28 lg:max-xl:h-28 lg:max-xl:border-2",
              // Extra large: ≥ 1280px
              "xl:w-32 xl:h-32 xl:border-2"
            )}
          ></div>

          {/* Logo Spinner - Using breakpoint ranges */}
          <motion.div
            className={cn(
              "relative flex items-center justify-center rounded-full text-white font-normal z-10",
              // Mobile: < 640px
              "max-sm:w-20 max-sm:h-20 max-sm:text-sm",
              // Small tablets: 640px - 768px
              "sm:max-md:w-24 sm:max-md:h-24 sm:max-md:text-base",
              // Medium tablets: 768px - 1024px
              "md:max-lg:w-32 md:max-lg:h-32 md:max-lg:text-xl",
              // Large screens: 1024px - 1280px
              "lg:max-xl:w-36 lg:max-xl:h-36 lg:max-xl:text-2xl",
              // Extra large: ≥ 1280px
              "xl:w-40 xl:h-40 xl:text-3xl",
              logoClassName
            )}
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            }}
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            Vaani
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Loader;
