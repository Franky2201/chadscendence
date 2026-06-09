import { type ItemColor } from "../../ui/unified";
import { useAuth } from "../../../contexts/AuthContext";
import { Badge } from "../../ui/index";

export type GameHistory = {
    start: string;
    duration: number;
    players: string[];
    scores: number[];
    ratings: number[];
    rating_diffs: number[];
};

type GameHistoryCardProps = {
    game: GameHistory;
};

type MyStats = {
    myPosition: number;
    myScore: number;
    myRating: number;
    myRatingDiff: number;
};

function extractMyStats(history: GameHistory, username: string): MyStats {
    for (let i = 0; i < history.players.length; i++) {
        if (history.players[i] == username) {
            return {
                myPosition: i + 1,
                myScore: history.scores[i],
                myRating: history.ratings[i],
                myRatingDiff: history.rating_diffs[i],
            };
        }
    }
    return {
        myPosition: 0,
        myScore: 0,
        myRating: 0,
        myRatingDiff: 0,
    };
}

export function GameHistoryCard({ game }: GameHistoryCardProps) {
    const { user } = useAuth();

    if (!user) {
        return null;
    }
    const { myPosition, myScore, myRating, myRatingDiff } = extractMyStats(
        game,
        user.username,
    );

    let color: ItemColor = "grey";
    if (myRatingDiff > 0) {
        color = "green";
    } else if (myRatingDiff < 0) {
        color = "red";
    }

    const startDate = new Date(game.start);

    const commonClasses = `select-none flex text-sm sm:text-base md:text-lg 
        w-full items-center justify-center`;

    return (
        <Badge className="border-1" color={color}>
            <div
                className={`flex flex-wrap w-full justify-between items-center`}
            >
                <div className="flex flex-wrap gap-3 w-full justify-between">
                    <span className={`select-none text-xs`}>
                        {startDate.toLocaleDateString()}
                    </span>
                    <span className={`select-none text-xs`}>
                        {startDate.toLocaleTimeString()}
                    </span>
                </div>
                <hr className="w-full mb-1 text-black/20"></hr>
                <div className="grid grid-cols-4 justify-center items-center w-full place-items-center">
                    <span className={commonClasses}>#{myPosition}</span>
                    <span className={commonClasses}>{myScore}</span>
                    <span className={commonClasses}>{myRating}</span>
                    <span className={commonClasses}>
                        {myRatingDiff > 0 ? `+` : ``}
                        {myRatingDiff}
                    </span>
                </div>
            </div>
        </Badge>
    );
}
