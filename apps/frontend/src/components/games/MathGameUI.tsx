import { useState, useEffect, useCallback } from "react";
import { sendGameCommand } from "../../services/games";
import type {
    MathProblem,
    MathAnswerSubmission,
    MathValidationResult,
} from "@chad/types";

export default function MathGameUI() {
    const [problem, setProblem] = useState<MathProblem | null>(null);
    const [answer, setAnswer] = useState("");
    const [status, setStatus] = useState<
        "loading" | "playing" | "correct" | "wrong" | "error"
    >("loading");
    const [lastResult, setLastResult] = useState<MathValidationResult | null>(
        null,
    );
    const [score, setScore] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchProblem = useCallback(async (showLoading = true) => {
        if (showLoading) setStatus("loading");
        setErrorMsg(null);
        try {
            const data = await sendGameCommand<void, MathProblem>(
                "math",
                "get_problem",
            );
            if (!data) {
                throw new Error("No data received from server");
            }
            setProblem(data);
            setStatus("playing");
            setAnswer("");
        } catch (err: unknown) {
            console.error("Failed to fetch problem:", err);
            setStatus("error");
            setErrorMsg(
                err instanceof Error ? err.message : "Failed to load game",
            );
        }
    }, []);

    useEffect(() => {
        // Using setTimeout(..., 0) defers the call to the next tick,
        // avoiding the "setState in effect" warning and cascading renders.
        const timer = setTimeout(() => {
            void fetchProblem(true); // Changed to true to ensure we see the loading state if it takes time
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchProblem]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!problem || !answer) return;

        try {
            const result = await sendGameCommand<
                MathAnswerSubmission,
                MathValidationResult
            >("math", "submit_answer", {
                id: problem.id,
                answer: parseInt(answer, 10),
            });

            setLastResult(result);
            if (result.success) {
                setStatus("correct");
                setScore((s) => s + 1);
                setTimeout(() => {
                    void fetchProblem(true);
                }, 1000);
            } else {
                setStatus("wrong");
                setTimeout(() => {
                    void fetchProblem(true);
                }, 2000);
            }
        } catch (err: unknown) {
            console.error("Failed to submit answer:", err);
            setStatus("error");
            setErrorMsg(
                err instanceof Error ? err.message : "Failed to submit answer",
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-3xl border border-white/10 backdrop-blur-sm min-h-75">
            <div className="absolute top-4 right-6 text-2xl font-black text-pink-500">
                SCORE: {score}
            </div>

            {status === "loading" && (
                <div className="text-2xl font-bold animate-pulse">
                    Génération du calcul...
                </div>
            )}

            {status === "error" && (
                <div className="text-center">
                    <div className="text-red-500 text-xl font-bold mb-4">
                        Oups ! {errorMsg}
                    </div>
                    <button
                        onClick={() => fetchProblem(true)}
                        className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-6 py-2 font-bold"
                    >
                        Réessayer
                    </button>
                </div>
            )}

            {(status === "playing" ||
                status === "correct" ||
                status === "wrong") &&
                problem && (
                    <div className="w-full max-w-xs text-center">
                        <div className="text-6xl font-black mb-8 tracking-tighter">
                            {problem.problem}
                        </div>

                        <form
                            onSubmit={handleSubmit}
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
                                        : status === "wrong"
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
                                RÉPONDRE
                            </button>
                        </form>

                        {status === "wrong" && lastResult && (
                            <div className="mt-4 text-red-400 font-bold text-lg animate-bounce">
                                Dommage ! C'était {lastResult.correctAnswer}
                            </div>
                        )}
                        {status === "correct" && (
                            <div className="mt-4 text-green-400 font-bold text-lg animate-bounce">
                                BIEN JOUÉ !
                            </div>
                        )}
                    </div>
                )}
        </div>
    );
}
