import { useState } from "react";
import GameContainer from "./GameContainer";

export default function TemplateUI() {
    const [score, setScore] = useState(0);

    return (
        <GameContainer
            gameId="template-id"
            score={score}
            setScore={setScore}
            renderGame={(
                problem: Record<string, unknown> & { question?: string },
                status: "playing" | "correct" | "wrong" | "expired",
                lastResult: any,
                submitAnswer: (
                    answer: Record<string, unknown>,
                ) => Promise<void>,
            ) => (
                <div className="w-full max-w-xs text-center">
                    <div className="text-6xl font-black mb-8 tracking-tighter">
                        {problem.question || "READY?"}
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => {
                                void submitAnswer({ action: "click" });
                            }}
                            disabled={status !== "playing"}
                            className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-2xl py-4 text-xl font-black transition-all shadow-lg shadow-pink-600/20"
                        >
                            {status === "playing" ? "CLICK ME" : "WAITING..."}
                        </button>
                    </div>

                    {lastResult?.message && (
                        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-pink-300 font-mono text-sm animate-in fade-in slide-in-from-top-2">
                            {lastResult.message}
                        </div>
                    )}
                </div>
            )}
        />
    );
}
