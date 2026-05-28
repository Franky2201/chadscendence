import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";

describe("AppService", () => {
    let service: AppService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService],
        }).compile();

        service = module.get<AppService>(AppService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("generateProblem", () => {
        it("should generate a problem and an answer", () => {
            const result = service.generateProblem();
            expect(result).toHaveProperty("problem");
            expect(result).toHaveProperty("answer");
            expect(typeof result.problem).toBe("string");
            expect(typeof result.answer).toBe("number");
        });

        it("should generate a valid math problem", () => {
            for (let i = 0; i < 100; i++) {
                const { problem, answer } = service.generateProblem();
                const [a, op, b] = problem.split(" ");
                const numA = parseInt(a, 10);
                const numB = parseInt(b, 10);

                if (op === "+") {
                    expect(numA + numB).toBe(answer);
                } else if (op === "-") {
                    expect(numA - numB).toBe(answer);
                } else if (op === "*") {
                    expect(numA * numB).toBe(answer);
                }
            }
        });
    });
});
