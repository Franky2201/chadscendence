import { SessionRoundPrompt } from "@chad/types";

export interface SessionGameAdapter {
    getProblemCommand: string;
    submitAnswerCommand: string;
    normalizePrompt(problem: unknown): SessionRoundPrompt;
    buildSubmitPayload(answer: unknown, prompt: SessionRoundPrompt): unknown;
    extractScore(result: unknown): number;
}

export class DefaultSessionGameAdapter implements SessionGameAdapter {
    getProblemCommand = "get_problem";
    submitAnswerCommand = "submit_answer";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    normalizePrompt(problem: unknown): SessionRoundPrompt {
        return {
            kind: "action",
            prompt: "Play",
            actionLabel: "Submit",
            actionValue: "submit",
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buildSubmitPayload(answer: unknown, prompt: SessionRoundPrompt): unknown {
        return { answer };
    }

    extractScore(result: unknown): number {
        if (typeof result === "number" && Number.isFinite(result)) {
            return Math.max(0, Math.trunc(result));
        }

        if (result && typeof result === "object") {
            const res = result as Record<string, unknown>;
            if (res.success === true) return 1;
        }

        return 0;
    }
}

export class MathSessionGameAdapter extends DefaultSessionGameAdapter {
    override normalizePrompt(problem: unknown): SessionRoundPrompt {
        const obj = (problem ?? {}) as Record<string, unknown>;
        return {
            kind: "number",
            prompt:
                typeof obj.problem === "string"
                    ? obj.problem
                    : "Solve the math problem",
            roundToken: typeof obj.id === "string" ? obj.id : undefined,
        };
    }

    override buildSubmitPayload(answer: unknown, prompt: SessionRoundPrompt) {
        return {
            id: prompt.roundToken,
            answer: typeof answer === "number" ? Math.trunc(answer) : 0,
        };
    }
}

export class ClickerSessionGameAdapter extends DefaultSessionGameAdapter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override normalizePrompt(problem: unknown): SessionRoundPrompt {
        return {
            kind: "action",
            prompt: "Click as fast as you can!",
            actionLabel: "CLICK ME!",
            actionValue: "click",
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override buildSubmitPayload(answer: unknown, prompt: SessionRoundPrompt) {
        return answer;
    }

    override extractScore(result: unknown): number {
        if (!result || typeof result !== "object") return 0;
        const res = result as Record<string, unknown>;

        if (typeof res.totalClicks === "number") {
            return res.totalClicks;
        }
        return 0;
    }
}

export class ReactionSessionGameAdapter extends DefaultSessionGameAdapter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override normalizePrompt(problem: unknown): SessionRoundPrompt {
        return {
            kind: "action",
            prompt: "Reaction Time!",
            actionLabel: "WAIT...",
            actionValue: "reaction",
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override buildSubmitPayload(answer: unknown, prompt: SessionRoundPrompt) {
        return answer;
    }

    override extractScore(result: unknown): number {
        if (!result || typeof result !== "object") return 0;
        const res = result as Record<string, unknown>;

        if (res.tooEarly || res.earlyClick) return 0;

        const time = (res.reactionTime ?? res.reactionTimeMs) as number | undefined;
        if (typeof time === "number") {
            if (time < 200) return 2;
            if (time < 400) return 1.5;
            if (time < 600) return 1;
            return 0.5;
        }

        if (res.success === true) return 1;

        return 0;
    }
}
