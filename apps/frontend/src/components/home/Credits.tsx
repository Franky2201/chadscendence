import { Card, Title } from "../ui";
import { developers } from "../../contexts/AboutContext";

export function Credits({ className = "" }: { className?: string }) {
    return (
        <Card className={className}>
            <div className="flex w-full justify-between mb-2">
                <Title>Credits</Title>
                <p className="text-sm">
                    This project was created collaboratively by our team of 5
                    developers.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-1">
                {developers.map((dev, index) => (
                    <a href={dev.link} target="_blank">
                        <Card
                            key={index}
                            className="border transition-all
										hover:bg-[color:var(--color-grey)]/40
										hover:border-[color:var(--color-grey)]/60"
                        >
                            <div className="flex flex-wrap gap-2">
                                <img
                                    src={dev.pic}
                                    alt={`${dev.name} profile`}
                                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                                />
                                <div>
                                    <h2 className="font-bold text-sm mb-0.5">
                                        {dev.name}
                                    </h2>
                                    <p className="text-xs mb-1">
                                        @{dev.username}
                                    </p>
                                    <p className="text-xs uppercase tracking-widest">
                                        {dev.role}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </a>
                ))}
            </div>

            <div className="pt-4 flex items-center justify-between text-xs uppercase tracking-widest">
                <span>Made with ❤️ at 42 Belgium</span>
                <a
                    href="/about"
                    className="hover:underline normal-case tracking-normal"
                >
                    More info →
                </a>
            </div>
        </Card>
    );
}
