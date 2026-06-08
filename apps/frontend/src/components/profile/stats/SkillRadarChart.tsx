import {
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    Tooltip,
} from "recharts";
import { useTheme } from "../../../contexts/ThemeContext";
import { getItemColorStyle, getItemMixedColorStyle } from "../../ui/unified";
import { CustomTooltip } from "./CustomTooltip";

export type SkillMetric = {
    name: string;
    value: number;
};

export interface SkillRadarChartProps {
    data: SkillMetric[];
    className?: string;
}

export function SkillRadarChart({ data, className }: SkillRadarChartProps) {
    const { theme } = useTheme();
    return (
        <div className={className}>
            <RadarChart
                data={data}
                responsive
                margin={{
                    top: 0,
                    right: 10,
                    bottom: 0,
                    left: 10,
                }}
                outerRadius="112%"
                width="100%"
                height="100%"
            >
                <PolarGrid
                    strokeWidth={1}
                    stroke="white"
                    fill="white"
                    fillOpacity={0.5}
                />
                <PolarAngleAxis
                    dataKey="name"
                    tick={{
                        fill: "white",
                        fontFamily: "Mona Sans",
                    }}
                    fillOpacity="0"
                />
                <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 0 }}
                    axisLine={false}
                    strokeWidth={1}
                />
                <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="var(--stroke-color)"
                    strokeWidth={1}
                    fill="var(--full-color)"
                    fillOpacity={0.8}
                    isAnimationActive={true}
                    animationEasing="linear"
                    animationDuration={300}
                    style={{
                        ...getItemColorStyle(theme, "--full-color"),
                        ...getItemMixedColorStyle(theme, "--stroke-color", 80),
                    }}
                />
                <Tooltip content={<CustomTooltip />} />
            </RadarChart>
        </div>
    );
}
