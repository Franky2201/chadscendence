import { Card } from "../ui";

export function Settings({ className = "" }: { className?: string }) {
    return (
        <Card className={className} title="Settings" href="/settings"></Card>
    );
}
