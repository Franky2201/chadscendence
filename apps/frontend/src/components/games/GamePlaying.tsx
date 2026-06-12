import { useState } from "react";
import { Card, Button, Input } from "../ui";
import { Header } from "../Header";
import { useTheme } from "../../contexts/ThemeContext";
import type { SessionRoundPrompt } from "@chad/types";

interface GamePlayingProps {
    prompt: SessionRoundPrompt;
    timeLeft: number;
    onSubmit: (answer: unknown) => Promise<void>;
}

export function GamePlaying({ prompt, timeLeft, onSubmit }: GamePlayingProps) {
    const { theme } = useTheme();
    const [answer, setAnswer] = useState<string>("");

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        const finalAnswer =
            prompt.kind === "number"
                ? Number(answer)
                : prompt.kind === "action"
                  ? prompt.actionValue
                  : answer;

        await onSubmit(finalAnswer);
        setAnswer("");
    };

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] w-full px-4">
                <Card className="max-w-2xl w-full flex flex-col items-center p-10 text-center shadow-2xl">
                    <div className="text-4xl font-bold mb-4 bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center border-4 border-slate-300">
                        {timeLeft}
                    </div>

                    <h2 className="text-4xl font-black mb-8">
                        {prompt.prompt}
                    </h2>

                    <form
                        onSubmit={(e) => void handleSubmit(e)}
                        className="w-full max-w-md flex flex-col gap-4"
                    >
                        {prompt.kind === "number" && (
                            <Input
                                type="number"
                                autoFocus
                                required
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="?"
                                className="w-full text-4xl py-6 font-bold text-center"
                            />
                        )}
                        {prompt.kind === "text" && (
                            <Input
                                type="text"
                                autoFocus
                                required
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="..."
                                className="w-full text-2xl py-4 text-center"
                            />
                        )}

                        <Button
                            type="submit"
                            color={theme}
                            size="large"
                            className="w-full mt-4 text-xl py-4"
                        >
                            {prompt.actionLabel || "RÉPONDRE"}
                        </Button>
                    </form>
                </Card>
            </div>
        </>
    );
}
