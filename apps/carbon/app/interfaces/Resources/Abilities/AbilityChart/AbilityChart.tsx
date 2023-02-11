import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveNatural } from "@visx/curve";
import { Drag } from "@visx/drag";
import { LinearGradient } from "@visx/gradient";
import { GridRows, GridColumns } from "@visx/grid";
import { Group } from "@visx/group";
import { PatternLines } from "@visx/pattern";
import { scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { useRef, useState } from "react";

type AbilityChartProps = {
  data: Datum[];
  parentHeight: number;
  parentWidth: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

type Datum = {
  id: number;
  week: number;
  value: number;
};

const AbilityChart = ({
  data,
  parentHeight,
  parentWidth,
  margin = { top: 20, right: 30, bottom: 50, left: 40 },
}: AbilityChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Datum[]>(data);

  if (parentWidth < 50) return null;

  const width = parentWidth - margin.left - margin.right;
  const height = parentHeight - margin.top - margin.bottom;

  const x = (d: Datum) => d.week;
  const y = (d: Datum) => d.value;

  const lastDataPoint = points[points.length - 1];
  const maxValue = 100;

  const xScale = scaleLinear<number>({
    range: [0, width],
    domain: [0, x(lastDataPoint)],
  });

  const yScale = scaleLinear<number>({
    range: [height, 0],
    domain: [0, maxValue],
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
        <text
          x={xScale(lastDataPoint.week / 2) - 14}
          y={yScale(0) + 35}
          fontSize={10}
        >
          Week
        </text>
        <AxisLeft scale={yScale} />
        <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
          Efficiency (%)
        </text>
        <LinearGradient
          id="fill"
          from="var(--chakra-colors-lime-200)"
          to="var(--chakra-colors-gray-500)"
          fromOpacity={0.2}
          toOpacity={0}
        />
        <PatternLines
          id="diagonalLines"
          height={6}
          width={6}
          stroke="var(--chakra-colors-lime-500)"
          strokeWidth={1}
          orientation={["diagonal"]}
        />
        <AreaClosed
          stroke="transparent"
          data={points}
          yScale={yScale}
          x={(d) => xScale(x(d))}
          y={(d) => yScale(y(d))}
          fill="url(#fill)"
          curve={curveNatural}
        />
        <AreaClosed
          stroke="transparent"
          data={points}
          yScale={yScale}
          x={(d) => xScale(x(d))}
          y={(d) => yScale(y(d))}
          fill="url(#diagonalLines)"
          curve={curveNatural}
        />
        <LinePath
          data={points}
          y={(d) => yScale(y(d))}
          x={(d) => xScale(x(d))}
          stroke="var(--chakra-colors-lime-700)"
          strokeOpacity="0.8"
          strokeWidth={2}
          curve={curveNatural}
        />
        {points.map((d, index) => (
          <Drag
            key={`drag-${d.id}`}
            width={width}
            height={height}
            x={xScale(x(d))}
            y={yScale(y(d))}
            snapToPointer={false}
            restrict={
              index === points.length - 1
                ? // The last point must be in the top right corner
                  {
                    xMin: xScale(lastDataPoint.week),
                    xMax: xScale(lastDataPoint.week),
                    yMin: yScale(maxValue),
                    yMax: yScale(maxValue),
                  }
                : index === 0
                ? // The first point must be at time 0, and less than the second point
                  {
                    xMin: xScale(0),
                    xMax: xScale(0),
                    yMin: yScale(points[index + 1].value),
                    yMax: yScale(0),
                  }
                : // All other points must be between the previous and next point
                  {
                    xMin: xScale(points[index - 1].week),
                    xMax: xScale(points[index + 1].week),
                    yMin: yScale(points[index + 1].value),
                    yMax: yScale(points[index - 1].value),
                  }
            }
            onDragMove={({ dx, dy }) => {
              const newPoints = [...points];
              newPoints[index] = {
                ...newPoints[index],
                week: newPoints[index].week + xScale.invert(dx),
                value: newPoints[index].value + yScale.invert(dy) - 100,
              };
              setPoints(newPoints);
            }}
          >
            {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => (
              <circle
                key={`dot-${d.id}`}
                cx={x}
                cy={y}
                r={isDragging ? 10 : 6}
                fill={"var(--chakra-colors-lime-700)"}
                transform={`translate(${dx}, ${dy})`}
                fillOpacity={0.9}
                stroke="var(--chakra-colors-lime-900)"
                strokeWidth={2}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onTouchStart={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
              />
            )}
          </Drag>
        ))}
      </Group>
    </svg>
  );
};

export default AbilityChart;
