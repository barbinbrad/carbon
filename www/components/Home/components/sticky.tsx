"use client";

import clsx from "clsx";
import { useMotionValueEvent, useScroll } from "framer-motion";
import React, { useRef, useState } from "react";

type StickyProps = {
  render: (props: { progress: number }) => React.ReactNode;
  cover?: boolean;
  height: number;
  width: number;
};

const Sticky = ({ render, cover, height, width }: StickyProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start", "end start"],
  });

  const isMobile = width < 768;

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) return;
    setProgress(latest);
  });

  return (
    <div ref={ref} data-component="sticky">
      <div
        className="relative h-screen"
        style={{ height: isMobile ? height : height * 1.5 }}
      >
        <div className="h-full">
          <div
            className={clsx(
              "flex justify-center items-center overflow-x-hidden  z-[1] min-h-[initial] w-full",
              {
                "h-screen overflow-y-hidden": cover,
                "h-[initial]": !cover,
                "sticky top-0 left-0 right-0": !isMobile,
              }
            )}
          >
            {/* @ts-ignore */}
            {render({ progress })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sticky;
