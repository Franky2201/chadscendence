import { useState, useEffect, useRef } from "react";
import GameContainer from "./GameContainer";
import type {
    ReactionTimeProblem,
    ReactionTimeResult,
    ReactionTimeSubmission,
} from "@chad/types";

type Phase = "waiting" | "ready" | "clicked";

export default function ReactionTimeUI() {
    const [score, setScore] = useState(0);
    const [started, setStarted] = useState(false);

    if (!started) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-3xl border border-white/10 backdrop-blur-sm min-h-75 relative">
                <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">
                    <div className="flex flex-col gap-2">
                        <div className="text-2xl font-black text-white">
                            Reaction Time
                        </div>
                        <div className="text-white/40 text-sm font-mono">
                            Clique dès que le cercle devient vert.
                            <br />
                        </div>
                    </div>

                    <button
                        onClick={() => setStarted(true)}
                        className="w-48 h-48 rounded-full bg-slate-600 border-4 border-slate-500 text-white font-black text-xl transition-all hover:scale-105 hover:bg-slate-500 shadow-2xl select-none"
                    >
                        Je suis prêt !
                    </button>

                    <p className="text-white/20 text-xs font-mono">
                        Clique pour démarrer
                    </p>
                </div>
            </div>
        );
    }

    return (
        <GameContainer<
            ReactionTimeProblem,
            ReactionTimeResult,
            ReactionTimeSubmission
        >
            gameId="reaction-time"
            score={score}
            setScore={setScore}
            renderGame={(problem, status, lastResult, submitAnswer) => (
                <ReactionTimeGame
                    problem={problem}
                    status={status}
                    lastResult={lastResult}
                    submitAnswer={submitAnswer}
                />
            )}
        />
    );
}

function ReactionTimeGame({
    problem,
    status,
    lastResult,
    submitAnswer,
}: {
    problem: ReactionTimeProblem;
    status: "playing" | "correct" | "wrong" | "expired";
    lastResult: ReactionTimeResult | null;
    submitAnswer: (answer: ReactionTimeSubmission) => Promise<void>;
}) {
    const [phase, setPhase] = useState<Phase>("waiting");
    const signalTimeRef = useRef<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (status !== "playing") return;

        setPhase("waiting");
        signalTimeRef.current = null;

        timerRef.current = setTimeout(() => {
            signalTimeRef.current = Date.now();
            setPhase("ready");
        }, problem.delay);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [problem.id, problem.delay, status]);

    const handleClick = () => {
        if (status !== "playing") return;

        if (phase === "waiting") {
            if (timerRef.current) clearTimeout(timerRef.current);
            setPhase("clicked");
            void submitAnswer({
                id: problem.id,
                reactionTime: 0,
                tooEarly: true,
            });
            return;
        }

        if (phase === "ready" && signalTimeRef.current !== null) {
            const reactionTime = Date.now() - signalTimeRef.current;
            setPhase("clicked");
            void submitAnswer({
                id: problem.id,
                reactionTime,
                tooEarly: false,
            });
        }
    };

    const isWaiting = phase === "waiting" && status === "playing";
    const isReady = phase === "ready" && status === "playing";

    return (
        <div className="w-full max-w-sm text-center flex flex-col items-center gap-8">
            <div className="text-sm font-mono text-white/40 uppercase tracking-widest">
                {isWaiting && "Prépare-toi..."}
                {isReady && "MAINTENANT !"}
                {phase === "clicked" && "Résultat"}
                {status === "correct" &&
                    phase !== "waiting" &&
                    phase !== "ready" &&
                    ""}
            </div>

            <button
                onClick={handleClick}
                disabled={status !== "playing"}
                className={[
                    "w-48 h-48 rounded-full text-white font-black text-2xl transition-all duration-150 shadow-2xl select-none",
                    isWaiting
                        ? "bg-slate-600 border-4 border-slate-500 scale-95"
                        : isReady
                          ? "bg-green-500 border-4 border-green-400 scale-105 shadow-green-500/50 animate-pulse cursor-pointer"
                          : "bg-slate-700 border-4 border-slate-600 opacity-60 cursor-default",
                ].join(" ")}
            >
                {isWaiting && "..."}
                {isReady && "CLIQUE !"}
                {phase === "clicked" &&
                    (lastResult?.reactionTime
                        ? `${lastResult.reactionTime}ms`
                        : "⚡")}
            </button>

            {lastResult && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 w-full animate-in fade-in slide-in-from-top-2">
                    <div
                        className={[
                            "text-xl font-black mb-1",
                            lastResult.success
                                ? "text-green-400"
                                : "text-red-400",
                        ].join(" ")}
                    >
                        {lastResult.rating ??
                            (lastResult.success ? "Bien joué !" : "Oups ...")}
                    </div>
                    <div className="text-white/60 font-mono text-sm">
                        {lastResult.message}
                    </div>
                </div>
            )}

            {isWaiting && (
                <p className="text-white/30 text-xs font-mono">
                    Attends que le cercle devienne vert...
                </p>
            )}
        </div>
    );
}
