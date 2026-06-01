import { Card } from "../ui";
import { useAuth } from "../../contexts/AuthContext";

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    const { user } = useAuth();
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
            onClick={onClose}
        >
            <Card
                title="Game modes"
                className="max-w-md w-full"
                contentClassName="flex flex-wrap justify-center gap-2"
            >
                <Card title="Party" className="w-48">
                    Play with a non player projection screen
                </Card>
                <Card title="Solo" className="w-48">
                    Play all the games alone
                </Card>
                {user && (
                    <Card title="Multi" className="w-48">
                        play with friends
                    </Card>
                )}
                {user && (
                    <Card title="Custom" className="w-48">
                        Create a custom lobby to play online with your friends
                    </Card>
                )}
                {user && (
                    <Card title="Cup" className="w-48">
                        Run a competition with your friends
                    </Card>
                )}
                {user && (
                    <Card title="Online" className="w-48">
                        Play online against other players
                    </Card>
                )}
            </Card>
        </div>
    );
}
