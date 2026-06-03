import { Window, Card } from "../components/ui";

export default function SettingsPage() {
    return (
        <Window className="relative min-h-screen w-full overflow-hidden bg-cover bg-center">
            <header className="justify-self-center">
                <img
                    className="select-none w-auto drop-shadow-lg max-h-30 mb-8"
                    src="/game_banner.png"
                    alt="GameLogo"
                />
            </header>
            <Card title="Settings" description="Back" href="/"></Card>
        </Window>
    );
}
