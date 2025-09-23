import React, { FC } from "react";
import { VictoryPie } from "victory";

interface PieChartProps {
  chartData: { x: string; y: number }[];
}

const PieChart: FC<PieChartProps> = ({ chartData }) => {
  return (
    <VictoryPie
      width={900}
      data={chartData}
      colorScale={[
        "#7a2bab",
        "#9c2bab",
        "#ad2b86",
        "#ab2b60",
        "#2b51ab",
        "#422bab",
      ]}
      animate={{ duration: 1000 }}
      style={{
        parent: {
          backgroundColor: "transparent",
        },
        data: {
          strokeWidth: 0,
        },
        labels: {
          fontSize: 16,
          fill: "#ababab",
        },
      }}
      events={[
        {
          target: "data",
          eventHandlers: {
            onMouseOver: () => {
              return [
                {
                  target: "data",
                  mutation: (props) => ({
                    style: {
                      ...props.style,
                      opacity: 0.7,
                    },
                  }),
                },
              ];
            },
            onMouseOut: () => {
              return [
                {
                  target: "data",
                  mutation: () => null,
                },
              ];
            },
          },
        },
      ]}
    />
  );
};

export default PieChart;
