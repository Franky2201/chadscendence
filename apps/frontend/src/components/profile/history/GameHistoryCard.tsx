import { type ItemColor } from "../../ui/unified";
import { useAuth } from "../../../contexts/AuthContext";
import { Badge } from "../../ui/index";
import { useTheme } from "../../../contexts/ThemeContext";

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
    isOpen: boolean;
    onToggle: () => void;
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

export function GameHistoryCard({
    game,
    isOpen,
    onToggle,
}: GameHistoryCardProps) {
    const { theme } = useTheme();
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
        <Badge
            className={`flex flex-col w-full  hover:ring-2 hover:cursor-pointer 
                transition-all duration-200 ease-in-out`}
            color={isOpen ? theme : color}
            onClick={onToggle}
        >
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
                <hr className="w-full text-black/20"></hr>
                <div
                    className={`grid grid-cols-4 justify-center transition-all ease-in-out
                        items-center w-full place-items-center duration-200 ${
                            isOpen ? "opacity-0 h-0" : "opacity-100"
                        }`}
                >
                    <span className={commonClasses}>#{myPosition}</span>
                    <span className={commonClasses}>{myScore}</span>
                    <span className={commonClasses}>{myRating}</span>
                    <span className={commonClasses}>
                        {myRatingDiff > 0 ? `+` : ``}
                        {myRatingDiff}
                    </span>
                </div>
            </div>

            {/* Expandable section */}
            <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                    isOpen ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="text-sm rounded">
                    {game.players.map((player, index) => (
                        <div
                            key={player}
                            className={`grid grid-cols-4 justify-center 
                                items-center w-full place-items-center 
                                ${player == user.username ? "text-white" : ""}`}
                        >
                            <div className="grid grid-cols-2 w-full items-center text-xs sm:text-base md:text-lg">
                                <span className="text-end mr-2">
                                    #{index + 1}
                                </span>
                                <span className="truncate text-start">
                                    {player}
                                </span>
                            </div>
                            <span className={commonClasses}>
                                {game.scores[index]}
                            </span>
                            <span className={commonClasses}>
                                {game.ratings[index]}
                            </span>
                            <span className={commonClasses}>
                                {game.rating_diffs[index] > 0 ? `+` : ``}
                                {game.rating_diffs[index]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Badge>
    );
}
