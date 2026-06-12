import {
    DefaultSessionGameAdapter,
    MathSessionGameAdapter,
    ReactionSessionGameAdapter,
    SessionGameAdapter,
} from "./game-contract";

export class GameAdapterRegistry {
    private readonly defaultAdapter = new DefaultSessionGameAdapter();

    private readonly adapters = new Map<string, SessionGameAdapter>([
        ["math", new MathSessionGameAdapter()],
        ["reaction-time", new ReactionSessionGameAdapter()],
    ]);

    getAdapter(gameId: string): SessionGameAdapter {
        return this.adapters.get(gameId) ?? this.defaultAdapter;
    }
}
