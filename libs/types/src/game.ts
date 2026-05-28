export interface Game {
    id: string;
    name: string;
    description: string;
    port: number;
}

export interface GameCommand<T = unknown> {
    cmd: string;
    payload?: T;
}

export interface MathProblem {
    id: string;
    problem: string;
}

export interface MathAnswerSubmission {
    id: string;
    answer: number;
}

export interface MathValidationResult {
    success: boolean;
    correctAnswer?: number;
    message?: string;
}
