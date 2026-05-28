import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "Hello World!";
    }

    generateProblem() {
        const operators = ["+", "-", "*"];
        const operator =
            operators[Math.floor(Math.random() * operators.length)];
        let a, b, answer;

        switch (operator) {
            case "+":
                a = Math.floor(Math.random() * 50) + 1;
                b = Math.floor(Math.random() * 50) + 1;
                answer = a + b;
                break;
            case "-":
                a = Math.floor(Math.random() * 50) + 25;
                b = Math.floor(Math.random() * 25) + 1;
                answer = a - b;
                break;
            case "*":
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
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
