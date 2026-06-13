import { useState, useRef } from "react";
import {
    createSession,
    startRound,
    finishGame,
    submitRoundAnswer,
    closeRound,
} from "../services/sessions";
import type { GameSession, SessionRoundPrompt } from "@chad/types";
import { useAuth } from "../contexts/AuthContext";

export type SessionViewState =
    | "setup"
    | "preparing"
    | "playing"
    | "inter_round"
    | "loading_next"
    | "podium";

export function useGameSession() {
    const { refreshUser } = useAuth();
    const [session, setSession] = useState<GameSession | null>(null);
    const [prompt, setPrompt] = useState<SessionRoundPrompt | null>(null);
    const [viewState, setViewState] = useState<SessionViewState>("setup");
    const [activeRoundIndex, setActiveRoundIndex] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timerRef = useRef<number | null>(null);

    const launchGame = async (
        selectedGames: string[],
        sequenceLength: number,
    ) => {
        setIsSubmitting(true);
        try {
            const newSession = await createSession({
                selectedGames,
                repetitions: sequenceLength,
            });
            setSession(newSession);

            setViewState("preparing");
            setTimeout(() => void playNextRound(newSession, 0), 2000);
        } catch (error) {
            console.error("Erreur de lancement:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const playNextRound = async (
        currentSession: GameSession,
        roundIndex: number,
    ) => {
        setViewState("loading_next");
        try {
            const { session: updatedSession, duration } = await startRound(
                currentSession.id,
                roundIndex,
            );

            setSession(updatedSession);
            setPrompt(updatedSession.rounds[roundIndex]?.prompt || null);
            setActiveRoundIndex(roundIndex);
            setViewState("playing");
            startLocalTimer(updatedSession, roundIndex, duration);
        } catch (error) {
            console.error("Erreur lancement round:", error);
        }
    };

    const startLocalTimer = (
        currentSession: GameSession,
        roundIndex: number,
        duration: number,
    ) => {
        setTimeLeft(duration);
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
        if (timerRef.current) window.clearInterval(timerRef.current);

        try {
            const updatedSession = await closeRound(
                currentSession.id,
                roundIndex,
            );

            const isLastRound = roundIndex >= updatedSession.rounds.length - 1;

            if (isLastRound) {
                const finalSession = await finishGame(updatedSession.id);
                setSession(finalSession);
                await refreshUser();
                setTimeout(() => {
                    setViewState("podium");
                }, 1500);
            } else {
                setSession(updatedSession);
                setTimeout(() => {
                    setViewState("inter_round");
                    setTimeout(() => {
                        void playNextRound(updatedSession, roundIndex + 1);
                    }, 1500);
                }, 2500);
            }
        } catch (error) {
            console.error("Erreur fin de round:", error);
        }
    };

    const submitAnswer = async (
        answer: unknown,
    ): Promise<{ success: boolean; isCompleted: boolean }> => {
        if (!session || viewState !== "playing")
            return { success: false, isCompleted: false };
        try {
            const res = await submitRoundAnswer(
                session.id,
                activeRoundIndex,
                answer,
            );

            if (res.isCompleted) {
                await handleRoundEnd(session, activeRoundIndex);
            }

            return {
                success: res.addedScore > 0,
                isCompleted: res.isCompleted,
            };
        } catch (error) {
            console.error("Erreur réponse:", error);
            return { success: false, isCompleted: false };
        }
    };

    return {
        session,
        prompt,
        viewState,
        timeLeft,
        isSubmitting,
        activeRoundIndex,
        launchGame,
        submitAnswer,
    };
}
