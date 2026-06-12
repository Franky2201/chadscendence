import { Test, TestingModule } from "@nestjs/testing";
import { GameController } from "../src/game.controller";
import { AppService } from "../src/app.service";
import { RedisService } from "../src/redis.service";

describe("GameController", () => {
    let controller: GameController;

    const mockRedis = {
        set: jest.fn().mockResolvedValue("OK"),
        get: jest.fn().mockResolvedValue(null),
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
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("ping", () => {
        it("should return a ping message", () => {
            const data = { test: "data" };
            const result = controller.handlePing(data);
            expect(result.message).toBe(
                "Hello from Reaction Time Game (Redis)",
            );
            expect(result.received).toBe(data);
            expect(result).toHaveProperty("timestamp");
        });
    });
});
