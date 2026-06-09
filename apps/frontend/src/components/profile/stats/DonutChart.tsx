import { PieChart, Pie, Tooltip } from "recharts";
import { CustomTooltip } from "./CustomTooltip";

export type DonutChartData = {
    name: string;
    value: number;
    fill: string;
};

export interface DonutChartProps {
    data: DonutChartData[];
    className?: string;
    thickness?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
    data,
    className = "",
}) => {
    return (
        <PieChart
            style={{
                width: "100%",
                aspectRatio: 1,
            }}
            className={className}
        >
            <Pie
                data={data}
                nameKey="name"
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius="100%"
                innerRadius="75%"
                cornerRadius="2%"
                paddingAngle={5}
                isAnimationActive={true}
                animationDuration={300}
                animationBegin={0}
                animationEasing="linear"
                stroke="none"
            />
            <Tooltip content={<CustomTooltip />} />
        </PieChart>
    );
};
