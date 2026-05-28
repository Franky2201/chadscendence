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
                status: "playing" | "correct" | "wrong",
                _lastResult: unknown,
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
                                void submitAnswer({ answer: true });
                            }}
                            disabled={status !== "playing"}
                            className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-2xl py-4 text-xl font-black transition-all shadow-lg shadow-pink-600/20"
                        >
                            TEST ACTION
                        </button>
                    </div>

                    {status === "correct" && (
                        <div className="mt-4 text-green-400 font-bold text-lg animate-bounce">
                            AWESOME!
                        </div>
                    )}
                </div>
            )}
        />
    );
}
