import { useState } from "react";
import { Button, Input } from "../ui";
import { Header } from "../Header";
import { useTheme } from "../../contexts/ThemeContext";
import type { SessionRoundPrompt } from "@chad/types";

interface GamePlayingProps {
    prompt: SessionRoundPrompt;
    timeLeft: number;
    onSubmit: (
        answer: unknown,
    ) => Promise<{ success: boolean; isCompleted: boolean }>;
}

export function GamePlaying({ prompt, timeLeft, onSubmit }: GamePlayingProps) {
    const { theme } = useTheme();
    const [answer, setAnswer] = useState<string>("");
    const [status, setStatus] = useState<"playing" | "correct" | "wrong">(
        "playing",
    );

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (status !== "playing") return;

        const finalAnswer =
            prompt.kind === "number"
                ? Number(answer)
                : prompt.kind === "action"
                  ? prompt.actionValue
                  : answer;

        try {
            const result = await onSubmit(finalAnswer);
            if (result.success) {
                setStatus("correct");
                setTimeout(() => setAnswer(""), 1000);
            } else {
                setStatus("wrong");
                setTimeout(() => setAnswer(""), 2000);
            }
        } catch (err) {
            console.error("Error submitting answer:", err);
            setStatus("wrong");
            setTimeout(() => setAnswer(""), 2000);
        }
    };

    return (
        <>
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="flex flex-col items-center gap-6 p-10 text-center rounded-3xl bg-white/5 backdrop-blur-[8px] border border-white/20 shadow-2xl w-full max-w-2xl">
                    <div className="text-4xl font-bold bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center border-4 border-slate-300 text-slate-900">
                        {timeLeft}
                    </div>

                    <h2 className="text-4xl font-black">{prompt.prompt}</h2>

                    <form
                        onSubmit={(e) => void handleSubmit(e)}
                        className="w-full max-w-md flex flex-col gap-4"
                    >
                        {prompt.kind === "number" && (
                            <Input
                                type="number"
                                autoFocus
                                required
                                disabled={status !== "playing"}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="?"
                                className="w-full text-4xl py-6 font-bold text-center disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        )}
                        {prompt.kind === "text" && (
                            <Input
                                type="text"
                                autoFocus
                                required
                                disabled={status !== "playing"}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="..."
                                className="w-full text-2xl py-4 text-center disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        )}

                        <Button
                            type="submit"
                            disabled={status !== "playing"}
                            color={theme}
                            size="large"
                            className="w-full mt-4 text-xl"
                        >
                            {prompt.actionLabel || "⮕"}
                        </Button>
                    </form>

                    {status === "correct" && (
                        <div className="mt-4 text-green-400 font-bold text-2xl animate-bounce">
                            ✅
                        </div>
                    )}
                    {status === "wrong" && (
                        <div className="mt-4 text-red-400 font-bold text-2xl animate-bounce">
                            ❌
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
