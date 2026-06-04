import { Card } from "../ui";

export function Friends({ className = "" }: { className?: string }) {
    return (
        <Card className={className} title="Friends" href="/friends">
            <></>
        </Card>
    );
}
