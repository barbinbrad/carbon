import { chakra } from "@chakra-ui/react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const Svg = chakra("svg");

const BorderFollower = ({
  children,
  duration = 2000,
  radius,
  ...otherProps
}: any) => {
  const pathRef = useRef<SVGRectElement>();
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        pos="absolute"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          // @ts-ignore
          ref={pathRef}
          rx={radius}
          ry={radius}
        />
        <foreignObject x="0" y="0" width="100%" height="100%">
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "inline-block",
              transform,
              background: "#002aff",
            }}
          >
            {children}
          </motion.div>
        </foreignObject>
      </Svg>
    </>
  );
};

export default BorderFollower;
