import type { TooltipContentProps } from "recharts/types/component/Tooltip";

type ValueType = string | number;
type NameType = string;

export const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipContentProps<ValueType, NameType>) => {
    if (!active || !payload?.length) return null;

    return (
        <div
            className="rounded-xl border border-white/10 bg-black/20 
				backdrop-blur-md shadow-xl px-2 py-1 min-w-10"
        >
            <div className="text-xs text-white uppercase">{label}</div>

            <div className="flex flex-col gap-2">
                {payload.map((item, i) => (
                    <div key={i} className="flex justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-white">
                                {item.name}
                            </span>
                        </div>

                        <span className="text-sm font-semibold text-white">
                            {String(item.value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/*
import type { TooltipContentProps } from "recharts";

type ValueType = number | string;
type NameType = string;

function CustomTooltip(props: TooltipContentProps<ValueType, NameType>) {
    const { active, payload, label } = props;

    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div>
            <div>{label}</div>
            {payload.map((item, index) => (
                <div key={index}>
                    {item.name}: {item.value}
                </div>
            ))}
        </div>
    );
}

export default CustomTooltip;
*/
