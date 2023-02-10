import { useColor } from "@carbon/react";
import { Box } from "@chakra-ui/react";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { PatternLines } from "@visx/pattern";
import { GridRows, GridColumns } from "@visx/grid";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { useRef } from "react";

export default function AbilitiesRoute() {
  return (
    <Box w="full" h="50vh" bg={useColor("white")}>
      <ParentSize>
        {({ height, width }) => (
          <AbilityChart
            parentHeight={height}
            parentWidth={width}
            data={[
              { week: 0, value: 10 },
              { week: 1, value: 50 },
              { week: 4, value: 80 },
              { week: 8, value: 100 },
            ]}
          />
        )}
      </ParentSize>
    </Box>
  );
}

type AbilityChartProps = {
  data: Datum[];
  parentHeight: number;
  parentWidth: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

type Datum = {
  week: number;
  value: number;
};

function AbilityChart({
  data,
  parentHeight,
  parentWidth,
  margin = { top: 40, right: 30, bottom: 50, left: 40 },
}: AbilityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  if (parentWidth < 50) return null;

  const width = parentWidth - margin.left - margin.right;
  const height = parentHeight - margin.top - margin.bottom;

  const x = (d: Datum) => d.week;
  const y = (d: Datum) => d.value;

  const lastDataPoint = data[data.length - 1];

  const minValue = 0;
  const maxValue = 100;

  const xScale = scaleLinear<number>({
    range: [0, width],
    domain: [0, x(lastDataPoint)],
  });

  const yScale = scaleLinear<number>({
    range: [height, 0],
    domain: [minValue, maxValue],
  });

  return (
    <svg ref={svgRef} width={parentWidth} height={parentHeight}>
      <Group top={margin.top} left={margin.left}>
        <GridRows
          scale={yScale}
          width={width}
          height={height}
          stroke="#e0e0e0"
        />
        <GridColumns
          scale={xScale}
          width={width}
          height={height}
          stroke="#e0e0e0"
        />
        <AxisBottom
          top={height}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
        />
        <AxisLeft scale={yScale} />
        <LinearGradient
          id="fill"
          from="var(--chakra-colors-green-200)"
          to="var(--chakra-colors-gray-500)"
          fromOpacity={0.2}
          toOpacity={0}
        />
        <PatternLines
          id="diagonalLines"
          height={6}
          width={6}
          stroke="var(--chakra-colors-green-500)"
          strokeWidth={1}
          orientation={["diagonal"]}
        />
        <AreaClosed
          stroke="transparent"
          data={data}
          yScale={yScale}
          x={(d) => xScale(x(d))}
          y={(d) => yScale(y(d))}
          fill="url(#fill)"
          curve={curveMonotoneX}
        />
        <AreaClosed
          stroke="transparent"
          data={data}
          yScale={yScale}
          x={(d) => xScale(x(d))}
          y={(d) => yScale(y(d))}
          fill="url(#diagonalLines)"
          curve={curveMonotoneX}
        />
        <LinePath
          data={data}
          y={(d) => yScale(y(d))}
          x={(d) => xScale(x(d))}
          stroke="var(--chakra-colors-green-700)"
          strokeOpacity="0.8"
          strokeWidth={2}
          curve={curveMonotoneX}
        />
      </Group>
    </svg>
  );
}
