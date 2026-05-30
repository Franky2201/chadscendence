import { useAuth } from "../contexts/AuthContext";
import { Button, Card, Window, Title } from "../components/ui";
import { useModal } from "../contexts/ModalContext";
import Leaderboard from "../components/home/Leaderboard";
import { withIntra, withGithub } from "../services/auth";
import { developers } from "../contexts/AboutContext";

export default function HomePage() {
    const { user, isLoading } = useAuth();
    const { openModal } = useModal();

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading ...
            </div>
        );

    return (
        <Window>
            <header className="justify-self-center">
                <img
                    className="select-none w-auto drop-shadow-lg max-h-30 mb-8"
                    src="/game_banner.png"
                    alt="GameLogo"
                />
            </header>
            <div className="flex flex-wrap max-w-400 justify-self-center justify-center gap-3">
                {!user && (
                    <Card
                        className="flex flex-col basis-100"
                        title="Identification"
                    >
                        <Button
                            className="w-full"
                            onClick={() => openModal("LOGIN")}
                        >
                            Login
                        </Button>
                        <Button
                            className="w-full"
                            onClick={() => openModal("REGISTER")}
                        >
                            Register
                        </Button>
                        <div className="flex flex-row gap-2 w-full">
                            <Button className="w-full" onClick={withIntra}>
                                42
                            </Button>
                            <Button className="w-full" onClick={withGithub}>
                                GitHub
                            </Button>
                        </div>
                    </Card>
                )}
                <Card className="flex basis-100">
                    <div className="flex w-full justify-between">
                        <Title>Play</Title>
                        <Button
                            className="w-9 h-8"
                            size="large"
                            borderRadius="rounded-full"
                        >
                            ?
                        </Button>
                    </div>
                    <div className="flex flex-col gap-3 w-full h-full justify-center">
                        <Button className="w-full">Party</Button>
                        <Button className="w-full">Solo</Button>
                        {user && (
                            <Button className="w-full">Multiplayer</Button>
                        )}
                        {user && (
                            <Button className="w-full">Custom Game</Button>
                        )}
                    </div>
                </Card>
                <Card
                    className="basis-100"
                    contentClassName="justify-start"
                    title="Leaderboard"
                >
                    <div className="w-full">
                        <Leaderboard count={5} />
                    </div>
                </Card>
                {user && (
                    <Card className="flex flex-col basis-100" title="Profile">
                        <></>
                    </Card>
                )}
                {user && (
                    <Card className="flex flex-col basis-100" title="Friends">
                        <></>
                    </Card>
                )}
                {user && (
                    <Card className="flex flex-col basis-100" title="Clan">
                        <></>
                    </Card>
                )}
                {user && (
                    <Card
                        className="flex flex-col basis-100"
                        title="Achievements"
                    >
                        <></>
                    </Card>
                )}
                <Card className="flex flex-col basis-100" title="Settings">
                    <></>
                </Card>
                <Card className="flex flex-col basis-203" title="Credits">
                    <Card className="border-none relative">
                        <p className="text-center text-sm">
                            This project was created collaboratively by our team
                            of 5 developers.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                            {developers.map((dev, index) => (
                                <a href={dev.link} target="_blank">
                                    <Card
                                        key={index}
                                        className="border transition-all
										hover:bg-[color:var(--color-grey)]/40
										hover:border-[color:var(--color-grey)]/60"
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            <img
                                                src={dev.pic}
                                                alt={`${dev.name} profile`}
                                                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                                            />
                                            <div>
                                                <h2 className="font-bold text-sm mb-0.5">
                                                    {dev.name}
                                                </h2>
                                                <p className="text-xs mb-1">
                                                    @{dev.username}
                                                </p>
                                                <p className="text-xs uppercase tracking-widest">
                                                    {dev.role}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </a>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs uppercase tracking-widest">
                            <span>Made with ❤️ at 42 Belgium</span>
                            <a
                                href="/about"
                                className="hover:underline normal-case tracking-normal"
                            >
                                More info →
                            </a>
                        </div>
                    </Card>
                </Card>
            </div>
        </Window>
    );
}
