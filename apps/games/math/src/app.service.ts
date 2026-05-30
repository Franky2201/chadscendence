import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "Hello World!";
    }

    generateProblem(): { problem: string; answer: number } {
        const operators = ["+", "-", "*", "/"];
        const operator =
            operators[Math.floor(Math.random() * operators.length)];
        let a: number, b: number, answer: number;

        switch (operator) {
            case "+":
                a = Math.floor(Math.random() * 1000);
                b = Math.floor(Math.random() * 1000);
                answer = a + b;
                break;
            case "-":
                a = Math.floor(Math.random() * 1000);
                b = Math.floor(Math.random() * 1000);
                answer = a - b;
                break;
            case "*":
                a = Math.floor(Math.random() * 50);
                b = Math.floor(Math.random() * 50);
                answer = a * b;
                break;
            case "/":
                b = Math.floor(Math.random() * 20) + 1;
                answer = Math.floor(Math.random() * 100);
                a = b * answer;
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
