import { Window, Card } from "../components/ui";
import { Profile, Password } from "../components/settings";

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
            <div
                className="grid gap-3 grid-cols-1 md:grid-cols-2 justify-self-center
				max-w-300 w-full"
            >
                <Card title="Settings" description="Back" href="/">
                    Theme Language
                </Card>
                <Profile />
                <Password />
            </div>
        </Window>
    );
}
