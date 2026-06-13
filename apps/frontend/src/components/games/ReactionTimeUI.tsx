import { useState, useEffect, useRef } from "react";
import { Header } from "../Header";
import type { SessionRoundPrompt } from "@chad/types";

type Phase = "waiting" | "ready" | "clicked" | "failed";

interface ReactionTimeUIProps {
    prompt: SessionRoundPrompt;
    onSubmit: (
        answer: unknown,
    ) => Promise<{ success: boolean; isCompleted: boolean }>;
}

export default function ReactionTimeUI({
    prompt,
    onSubmit,
}: ReactionTimeUIProps) {
    const [phase, setPhase] = useState<Phase>("waiting");
    const [reactionTime, setReactionTime] = useState<number | null>(null);

    const signalTimeRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const randomDelay = Math.floor(Math.random() * 3000) + 2000;

        timerRef.current = window.setTimeout(() => {
            signalTimeRef.current = Date.now();
            setPhase("ready");
        }, randomDelay);

        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, []);

    const handleClick = async () => {
        if (phase === "waiting") {
            if (timerRef.current) window.clearTimeout(timerRef.current);
            setPhase("failed");
            await onSubmit({ earlyClick: true });
            return;
        }

        if (phase === "ready" && signalTimeRef.current !== null) {
            const timeTaken = Date.now() - signalTimeRef.current;
            setPhase("clicked");
            setReactionTime(timeTaken);
            await onSubmit({ reactionTimeMs: timeTaken });
        }
    };

    const isWaiting = phase === "waiting";
    const isReady = phase === "ready";

    return (
        <>
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="flex flex-col items-center gap-6 p-10 text-center rounded-3xl bg-white/5 backdrop-blur-[8px] border border-white/20 shadow-2xl w-full max-w-md">
                    <h2 className="text-4xl font-black">
                        {prompt.prompt || "Reaction Time"}
                    </h2>

                    <div className="text-sm font-mono text-gray-500 uppercase tracking-widest h-4 mb-6">
                        {isWaiting && "Get Ready ..."}
                        {isReady && "NOW !"}
                        {phase === "clicked" && "Results"}
                        {phase === "failed" && "Oups !"}
                    </div>

                    <button
                        onClick={() => void handleClick()}
                        disabled={phase === "clicked" || phase === "failed"}
                        className={[
                            "w-64 h-64 rounded-full text-white font-black text-3xl transition-all duration-150 shadow-2xl select-none flex items-center justify-center",
                            isWaiting
                                ? "bg-slate-600 border-4 border-slate-500 scale-95 cursor-pointer"
                                : isReady
                                  ? "bg-green-500 border-4 border-green-400 scale-105 shadow-green-500/50 animate-pulse cursor-pointer"
                                  : phase === "failed"
                                    ? "bg-red-500 border-4 border-red-400 scale-95 opacity-80"
                                    : "bg-blue-500 border-4 border-blue-400 opacity-90 cursor-default",
                        ].join(" ")}
                    >
                        {isWaiting && "..."}
                        {isReady && "Click !"}
                        {phase === "failed" && "❌"}
                        {phase === "clicked" && `${reactionTime}ms`}
                    </button>

                    <div className="h-8 flex items-center justify-center">
                        {isWaiting && (
                            <p className="text-gray-400 text-sm font-mono"></p>
                        )}
                        {phase === "failed" && (
                            <p className="text-red-500 text-lg font-bold animate-in fade-in slide-in-from-top-2"></p>
                        )}
                        {phase === "clicked" && (
                            <p className="text-green-500 text-lg font-bold animate-in fade-in slide-in-from-top-2">
                                Success !
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
