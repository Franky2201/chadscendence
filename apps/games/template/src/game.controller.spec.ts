import { Test, TestingModule } from "@nestjs/testing";
import { GameController } from "./game.controller";
import { AppService } from "./app.service";
import { RedisService } from "./redis.service";

describe("GameController", () => {
    let controller: GameController;
    let appService: AppService;

    const mockRedis = {
        set: jest.fn().mockResolvedValue("OK"),
        get: jest.fn().mockResolvedValue("10"),
        del: jest.fn().mockResolvedValue(1),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GameController],
            providers: [
                AppService,
                {
                    provide: RedisService,
                    useValue: {
                        getClient: () => mockRedis,
                    },
                },
            ],
        }).compile();

        controller = module.get<GameController>(GameController);
        appService = module.get<AppService>(AppService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("handleGetProblem", () => {
        it("should generate a problem and store it in Redis", async () => {
            const spy = jest
                .spyOn(appService, "generateProblem")
                .mockReturnValue({
                    problem: "2 + 2",
                    answer: 4,
                });

            const result = await controller.handleGetProblem();

            expect(result).toHaveProperty("id");
            expect(result.problem).toBe("2 + 2");
            expect(mockRedis.set).toHaveBeenCalledWith(
                expect.stringContaining("game-template:answer:"),
                4,
                "EX",
                60,
            );
            spy.mockRestore();
        });
    });

    describe("handleSubmitAnswer", () => {
        it("should return success for correct answer", async () => {
            mockRedis.get.mockResolvedValue("10");

            const result = await controller.handleSubmitAnswer({
                id: "test-id",
                answer: 10,
            });

            expect(result.success).toBe(true);
            expect(mockRedis.del).toHaveBeenCalledWith("game-template:answer:test-id");
        });

        it("should return failure for incorrect answer", async () => {
            mockRedis.get.mockResolvedValue("10");

            const result = await controller.handleSubmitAnswer({
                id: "test-id",
                answer: 5,
            });

            expect(result.success).toBe(false);
            expect(result.correctAnswer).toBe(10);
        });

        it("should return failure if problem not found", async () => {
            mockRedis.get.mockResolvedValue(null);

            const result = await controller.handleSubmitAnswer({
                id: "test-id",
                answer: 10,
            });

            expect(result.success).toBe(false);
            expect(result.message).toBe("Problem expired or not found");
        });
    });
});
