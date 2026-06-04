import { useChat } from "../../contexts/ChatContext";
import { Card } from "../ui";

export function Friends({ className = "" }: { className?: string }) {
    const { openPanel } = useChat();

    return (
        <Card className={className} title="Friends" onClick={openPanel}>
            <></>
        </Card>
    );
}
