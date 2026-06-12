import {
    DefaultSessionGameAdapter,
    MathSessionGameAdapter,
    ClickerSessionGameAdapter,
    ReactionSessionGameAdapter,
    SessionGameAdapter,
} from "./game-contract";

export class GameAdapterRegistry {
    private readonly defaultAdapter = new DefaultSessionGameAdapter();

    private readonly adapters = new Map<string, SessionGameAdapter>([
        ["math", new MathSessionGameAdapter()],
        ["clicker", new ClickerSessionGameAdapter()],
        ["reaction", new ReactionSessionGameAdapter()],
    ]);

    getAdapter(gameId: string): SessionGameAdapter {
        return this.adapters.get(gameId) ?? this.defaultAdapter;
    }
}
