import { useState, useEffect, useCallback, type ReactNode } from "react";
import { sendGameCommand } from "../../services/games";

interface GameContainerProps<TProblem, TResult, TSubmission = unknown> {
    gameId: string;
    renderGame: (
        problem: TProblem,
        status: "playing" | "correct" | "wrong" | "expired",
        lastResult: TResult | null,
        submitAnswer: (answer: TSubmission) => Promise<void>,
    ) => ReactNode;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    onSuccess?: (result: TResult) => void;
    onError?: (error: unknown) => void;
}

export default function GameContainer<
    TProblem = unknown,
    TResult extends { success: boolean; message?: string } = {
        success: boolean;
        message?: string;
    },
    TSubmission = unknown,
>({
    gameId,
    renderGame,
    score,
    setScore,
    onSuccess,
    onError,
}: GameContainerProps<TProblem, TResult, TSubmission>) {
    const [problem, setProblem] = useState<TProblem | null>(null);
    const [status, setStatus] = useState<
        "loading" | "playing" | "correct" | "wrong" | "expired" | "error"
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
            } catch (err: unknown) {
                console.error(`Failed to fetch ${gameId} problem:`, err);
                setStatus("error");
                const message =
                    err instanceof Error ? err.message : "Failed to load game";
                setErrorMsg(message);
                if (onError) onError(err);
            }
        },
        [gameId, onError],
    );

    useEffect(() => {
        const timer = setTimeout(() => void fetchProblem(true), 0);
        return () => clearTimeout(timer);
    }, [fetchProblem]);

    const submitAnswer = async (answer: TSubmission) => {
        if (!problem || status !== "playing") return;

        try {
            const result = await sendGameCommand<TSubmission, TResult>(
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
            } else if (result.message?.includes("expired")) {
                setStatus("expired");
                setTimeout(() => void fetchProblem(true), 2000);
            } else {
                setStatus("wrong");
                setTimeout(() => void fetchProblem(true), 2000);
            }
        } catch (err: unknown) {
            console.error(`Failed to submit ${gameId} answer:`, err);
            setStatus("error");
            const message =
                err instanceof Error ? err.message : "Submission failed";
            setErrorMsg(message);
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
                status === "wrong" ||
                status === "expired") &&
                problem &&
                renderGame(problem, status, lastResult, submitAnswer)}
        </div>
    );
}
