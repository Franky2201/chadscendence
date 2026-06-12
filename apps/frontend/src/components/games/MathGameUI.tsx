import { useState } from "react";
import GameContainer from "./GameContainer";
import type { MathProblem, MathValidationResult } from "@chad/types";

export default function MathGameUI() {
    const [score, setScore] = useState(0);
    const [answer, setAnswer] = useState("");

    return (
        <GameContainer
            gameId="math"
            score={score}
            setScore={setScore}
            renderGame={(
                problem: MathProblem,
                status,
                lastResult: MathValidationResult | null,
                submitAnswer,
            ) => (
                <div className="w-full max-w-xs text-center">
                    <div className="text-6xl font-black mb-8 tracking-tighter">
                        {problem.problem}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            void submitAnswer({
                                id: problem.id,
                                answer: parseInt(answer, 10),
                            });
                            setAnswer("");
                        }}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="number"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            autoFocus
                            className={`w-full bg-white/10 border-2 rounded-2xl px-6 py-4 text-3xl font-bold text-center transition-all outline-none ${
                                status === "correct"
                                    ? "border-green-500 bg-green-500/20"
                                    : status === "wrong" || status === "expired"
                                      ? "border-red-500 bg-red-500/20"
                                      : "border-white/20 focus:border-pink-500"
                            }`}
                            placeholder="?"
                        />
                        <button
                            type="submit"
                            disabled={status !== "playing"}
                            className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-2xl py-4 text-xl font-black transition-all shadow-lg shadow-pink-600/20"
                        >
                            ⮕
                        </button>
                    </form>

                    {status === "wrong" && lastResult && (
                        <div className="mt-4 text-red-400 font-bold text-lg animate-bounce">
                            ​❌​ {lastResult.correctAnswer}
                        </div>
                    )}
                    {status === "expired" && (
                        <div className="mt-4 text-orange-400 font-bold text-lg animate-bounce">
                            ​❌​
                        </div>
                    )}
                    {status === "correct" && (
                        <div className="mt-4 text-green-400 font-bold text-lg animate-bounce">
                            ✅
                        </div>
                    )}
                </div>
            )}
        />
    );
}
