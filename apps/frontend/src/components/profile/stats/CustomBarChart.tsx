import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { CustomTooltip } from "./CustomTooltip";
import { useTheme } from "../../../contexts/ThemeContext";
import { getItemColorStyle } from "../../ui/unified";

export interface CustomBarChartProps {
    values: number[];
    startDate: Date;
    className?: string;
}

const formatAxisMetric = (value: number) => {
    if (value === 0) return "0";
    if (Math.abs(value) >= 1.0e6)
        return (value / 1.0e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (Math.abs(value) >= 1.0e3)
        return (value / 1.0e3).toFixed(1).replace(/\.0$/, "") + "k";
    return value.toString();
};

function buildChartData(values: number[], startDate: Date) {
    return values.map((value, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);
        return {
            date,
            label: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            value,
        };
    });
}

export function CustomBarChart({
    values,
    startDate,
    className = "",
}: CustomBarChartProps) {
    const { theme } = useTheme();
    const data = buildChartData(values, startDate);
    return (
        <div className={`relative w-full ${className}`}>
            <ResponsiveContainer width="100%" height={140}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 0, left: -30, bottom: -5 }}
                >
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="4 4"
                        stroke="rgba(255,255,255,0.15)"
                    />
                    <XAxis
                        dataKey="label"
                        stroke="rgba(255,255,255,0.5)"
                        fontSize={11}
                        fontFamily="Mona Sans"
                        tickLine={false}
                        axisLine={false}
                        dy={2}
                        style={{ userSelect: "none" }}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        fontSize={11}
                        fontFamily="Mona Sans"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatAxisMetric}
                        tick={{ textAnchor: "end" }}
                        dx={0}
                        style={{ userSelect: "none" }}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(255,255,255,0.02)" }}
                    />
                    <Bar
                        dataKey="value"
                        radius={[5, 5, 0, 0]}
                        maxBarSize={40}
                        animationDuration={1000}
                        style={{ ...getItemColorStyle(theme) }}
                        fill="var(--ui-color)"
                    />
                    <RechartsDevtools />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
