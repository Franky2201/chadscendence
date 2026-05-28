import { useState, useEffect, useCallback, ReactNode } from "react";
import { sendGameCommand } from "../../services/games";

interface GameContainerProps<TProblem, TResult> {
    gameId: string;
    renderGame: (
        problem: TProblem,
        status: "playing" | "correct" | "wrong",
        lastResult: TResult | null,
        submitAnswer: (answer: any) => Promise<void>,
    ) => ReactNode;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    onSuccess?: (result: TResult) => void;
    onError?: (error: any) => void;
}

export default function GameContainer<TProblem = any, TResult = any>({
    gameId,
    renderGame,
    score,
    setScore,
    onSuccess,
    onError,
}: GameContainerProps<TProblem, TResult>) {
    const [problem, setProblem] = useState<TProblem | null>(null);
    const [status, setStatus] = useState<
        "loading" | "playing" | "correct" | "wrong" | "error"
    >("loading");
    const [lastResult, setLastResult] = useState<TResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchProblem = useCallback(
        async (showLoading = true) => {
            if (showLoading) setStatus("loading");
            setErrorMsg(null);
            try {
                const data = await sendGameCommand<void, TProblem>(
                    gameId,
                    "get_problem",
                );
                if (!data) throw new Error("No data received from server");
                setProblem(data);
                setStatus("playing");
            } catch (err: any) {
                console.error(`Failed to fetch ${gameId} problem:`, err);
                setStatus("error");
                setErrorMsg(err.message || "Failed to load game");
                if (onError) onError(err);
            }
        },
        [gameId, onError],
    );

    useEffect(() => {
        const timer = setTimeout(() => void fetchProblem(true), 0);
        return () => clearTimeout(timer);
    }, [fetchProblem]);

    const submitAnswer = async (answer: any) => {
        if (!problem || status !== "playing") return;

        try {
            const result = await sendGameCommand<any, any>(
                gameId,
                "submit_answer",
                answer,
            );

            setLastResult(result);
            if (result.success) {
                setStatus("correct");
                setScore((s) => s + 1);
                if (onSuccess) onSuccess(result);
                setTimeout(() => void fetchProblem(true), 1000);
            } else {
                setStatus("wrong");
                setTimeout(() => void fetchProblem(true), 2000);
            }
        } catch (err: any) {
            console.error(`Failed to submit ${gameId} answer:`, err);
            setStatus("error");
            setErrorMsg(err.message || "Submission failed");
            if (onError) onError(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-3xl border border-white/10 backdrop-blur-sm min-h-75 relative">
            <div className="absolute top-4 right-6 text-2xl font-black text-pink-500">
                SCORE: {score}
            </div>

            {status === "loading" && (
                <div className="text-2xl font-bold animate-pulse">
                    Chargement...
                </div>
            )}

            {status === "error" && (
                <div className="text-center">
                    <div className="text-red-500 text-xl font-bold mb-4">
                        Oups ! {errorMsg}
                    </div>
                    <button
                        onClick={() => fetchProblem(true)}
                        className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-6 py-2 font-bold transition-all"
                    >
                        Réessayer
                    </button>
                </div>
            )}

            {(status === "playing" ||
                status === "correct" ||
                status === "wrong") &&
                problem &&
                renderGame(problem, status, lastResult, submitAnswer)}
        </div>
    );
}
