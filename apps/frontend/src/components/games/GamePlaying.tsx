import { useState } from "react";
import { Card, Button, Input } from "../ui";
import { Header } from "../Header";
import { useTheme } from "../../contexts/ThemeContext";
import type { SessionRoundPrompt } from "@chad/types";

interface GamePlayingProps {
    prompt: SessionRoundPrompt;
    timeLeft: number;
    onSubmit: (answer: unknown) => Promise<void>;
    lastResult?: any;
}

export function GamePlaying({
    prompt,
    timeLeft,
    onSubmit,
    lastResult,
}: GamePlayingProps) {
    const { theme } = useTheme();
    const [answer, setAnswer] = useState<string>("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (isSubmitted) return;

        const finalAnswer =
            prompt.kind === "number"
                ? Number(answer)
                : prompt.kind === "action"
                  ? prompt.actionValue
                  : answer;

        setIsSubmitted(true);
        await onSubmit(finalAnswer);
    };

    const isCorrect = lastResult?.success === true;
    const isWrong = lastResult?.success === false;

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] w-full px-4">
                <Card className="max-w-2xl w-full flex flex-col items-center p-10 text-center shadow-2xl">
                    {!isSubmitted && (
                        <div className="text-4xl font-bold mb-4 bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center border-4 border-slate-300">
                            {timeLeft}
                        </div>
                    )}

                    {isSubmitted && (
                        <div
                            className={`text-6xl mb-4 animate-bounce ${isCorrect ? "text-green-500" : "text-red-500"}`}
                        >
                            {isCorrect ? "✅" : "❌"}
                        </div>
                    )}

                    <h2 className="text-4xl font-black mb-8">
                        {prompt.prompt}
                    </h2>

                    <form
                        onSubmit={(e) => void handleSubmit(e)}
                        className="w-full max-w-md flex flex-col gap-4"
                    >
                        {(prompt.kind === "number" ||
                            prompt.kind === "text") && (
                            <div className="relative w-full">
                                <Input
                                    type={
                                        prompt.kind === "number"
                                            ? "number"
                                            : "text"
                                    }
                                    autoFocus
                                    required
                                    disabled={isSubmitted}
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder={isSubmitted ? "" : "?"}
                                    className={`w-full text-4xl py-6 font-bold text-center transition-all ${
                                        isCorrect
                                            ? "border-green-500 bg-green-500/10"
                                            : isWrong
                                              ? "border-red-500 bg-red-500/10"
                                              : ""
                                    }`}
                                />
                                {isWrong && lastResult.correctAnswer && (
                                    <div className="absolute -bottom-10 left-0 right-0 text-red-500 font-bold text-xl">
                                        Answer: {lastResult.correctAnswer}
                                    </div>
                                )}
                            </div>
                        )}

                        {!isSubmitted && (
                            <Button
                                type="submit"
                                color={theme}
                                size="large"
                                className="w-full mt-4 text-xl py-4"
                            >
                                {prompt.actionLabel || "⮕"}
                            </Button>
                        )}

                        {isSubmitted && (
                            <div className="mt-8 text-2xl font-bold text-slate-400 animate-pulse">
                                Next round starting soon...
                            </div>
                        )}
                    </form>
                </Card>
            </div>
        </>
    );
}
