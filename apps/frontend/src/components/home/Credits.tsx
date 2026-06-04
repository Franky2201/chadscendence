import { Card } from "../ui";
import { developers } from "../../contexts/AboutContext";

export function Credits({ className = "" }: { className?: string }) {
    return (
        <Card
            className={className}
            title="Credits"
            href="/about"
            description="This 
					project was created collaboratively by our team of 5
                    developers."
        >
            <div className="flex flex-wrap justify-center gap-3">
                {developers.map((dev, index) => (
                    <a href={dev.link} target="_blank">
                        <div
                            key={index}
                            className="rounded-xl border border-neutral-400
                                hover:bg-neutral-500 h-16,5 w-56"
                        >
                            <div className="flex m-1">
                                <img
                                    src={dev.pic}
                                    alt={`${dev.name} profile`}
                                    className="w-14 h-14 rounded-xl"
                                />
                                <div className="ml-2">
                                    <h2 className="font-bold text-sm mb-0.5">
                                        {dev.name}
                                    </h2>
                                    <p className="text-xs mb-0.5">
                                        @{dev.username}
                                    </p>
                                    <p className="text-xs uppercase tracking-widest">
                                        {dev.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
            <div className="pt-4 flex items-center justify-center text-xs uppercase tracking-widest">
                <span>Made with ❤️ at 42 Belgium</span>
            </div>
        </Card>
    );
}
