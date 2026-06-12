import { useState, useRef } from "react";
import {
    createSession,
    startRound,
    finishGame,
    submitRoundAnswer,
} from "../services/sessions";
import type { GameSession, SessionRoundPrompt } from "@chad/types";

export type SessionViewState = "setup" | "playing" | "inter_round" | "podium";

export function useGameSession() {
    const [session, setSession] = useState<GameSession | null>(null);
    const [prompt, setPrompt] = useState<SessionRoundPrompt | null>(null);
    const [viewState, setViewState] = useState<SessionViewState>("setup");

    const [timeLeft, setTimeLeft] = useState<number>(20);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timerRef = useRef<number | null>(null);

    const launchGame = async (selectedGames: string[], repetitions: number) => {
        setIsSubmitting(true);
        try {
            const newSession = await createSession({
                selectedGames,
                repetitions,
            });
            setSession(newSession);
            await playNextRound(newSession, 0);
        } catch (error) {
            console.error("Erreur lors de la création de la partie:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const playNextRound = async (
        currentSession: GameSession,
        roundIndex: number,
    ) => {
        setViewState("inter_round");

        try {
            const updatedSession = await startRound(
                currentSession.id,
                roundIndex,
            );
            setSession(updatedSession);

            const currentRound = updatedSession.rounds[roundIndex];
            if (currentRound && currentRound.prompt) {
                setPrompt(currentRound.prompt);
            }

            setTimeout(() => {
                setViewState("playing");
                startLocalTimer(updatedSession, roundIndex);
            }, 2000);
        } catch (error) {
            console.error("Erreur lors du lancement du round:", error);
        }
    };

    const startLocalTimer = (
        currentSession: GameSession,
        roundIndex: number,
    ) => {
        setTimeLeft(20);

        if (timerRef.current) window.clearInterval(timerRef.current);

        timerRef.current = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    window.clearInterval(timerRef.current!);
                    void handleRoundEnd(currentSession, roundIndex);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleRoundEnd = async (
        currentSession: GameSession,
        roundIndex: number,
    ) => {
        const isLastRound = roundIndex >= currentSession.rounds.length - 1;

        if (isLastRound) {
            try {
                const result = await finishGame(currentSession.id);
                setSession(result.session);
                setViewState("podium");
            } catch (error) {
                console.error("Erreur lors de la fin de partie:", error);
            }
        } else {
            await playNextRound(currentSession, roundIndex + 1);
        }
    };

    const submitAnswer = async (answer: unknown) => {
        if (!session || viewState !== "playing") return;

        try {
            await submitRoundAnswer(
                session.id,
                session.currentRoundIndex,
                answer,
            );
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
        }
    };

    return {
        session,
        prompt,
        viewState,
        timeLeft,
        isSubmitting,
        launchGame,
        submitAnswer,
    };
}
