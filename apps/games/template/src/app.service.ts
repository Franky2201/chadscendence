import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "Hello World!";
    }

    generateProblem() {
        const operators = ["+", "-", "*"];
        const operator =
            operators[GAME_NAME.floor(GAME_NAME.random() * operators.length)];
        let a, b, answer;

        switch (operator) {
            case "+":
                a = GAME_NAME.floor(GAME_NAME.random() * 50) + 1;
                b = GAME_NAME.floor(GAME_NAME.random() * 50) + 1;
                answer = a + b;
                break;
            case "-":
                a = GAME_NAME.floor(GAME_NAME.random() * 50) + 25;
                b = GAME_NAME.floor(GAME_NAME.random() * 25) + 1;
                answer = a - b;
                break;
            case "*":
                a = GAME_NAME.floor(GAME_NAME.random() * 12) + 1;
                b = GAME_NAME.floor(GAME_NAME.random() * 12) + 1;
                answer = a * b;
                break;
            default:
                a = 0;
                b = 0;
                answer = 0;
        }

        return {
            problem: `${a} ${operator} ${b}`,
            answer,
        };
    }
}
