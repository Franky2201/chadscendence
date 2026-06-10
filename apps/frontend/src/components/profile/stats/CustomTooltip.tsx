type CustomTooltipProps = {
    active?: boolean;
    label?: string | number;
    payload?: Array<{
        name?: string;
        value?: string | number;
        color?: string;
        dataKey?: string;
    }>;
};

export const CustomTooltip = ({
    active,
    payload,
    label,
}: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;

    return (
        <div
            className="rounded-xl border border-white/10 bg-black/20 
				backdrop-blur-md shadow-xl px-2 py-1 min-w-10"
        >
            <div className="select-none text-xs text-white uppercase">
                {label}
            </div>
            <div className="flex flex-col gap-2">
                {payload.map((item, i) => (
                    <div key={i} className="flex justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span
                                className="select-none h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="select-none text-sm text-white">
                                {item.name}
                            </span>
                        </div>

                        <span className="select-none text-sm font-semibold text-white">
                            {String(item.value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
