import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, Window, Badge } from "../components/ui";
import { developers } from "../contexts/AboutContext";
import { type ItemColor } from "../components/ui/unified";
import { useTheme } from "../contexts/ThemeContext";

const stackLayers = [
    {
        label: "Frontend",
        stack: [
            { name: "TypeScript", color: "blue" },
            { name: "React", color: "blue" },
            { name: "Tailwind CSS", color: "blue" },
            { name: "Vite", color: "purple" },
        ],
    },
    {
        label: "Backend",
        stack: [
            { name: "TypeScript", color: "blue" },
            { name: "NestJS", color: "red" },
            { name: "PostgreSQL", color: "pink" },
            { name: "TypeORM", color: "orange" },
        ],
    },
    {
        label: "Others",
        stack: [
            { name: "Docker", color: "blue" },
            { name: "Node.js", color: "green" },
            { name: "ESLint", color: "violet" },
        ],
    },
];

const modules = [
    { name: "Framework on both frontend and backend", type: "Major" },
    { name: "ORM for the database", type: "Minor" },
    { name: "Remote authentication with OAuth 2.0", type: "Minor" },
    { name: "Custom design system (10+ components)", type: "Minor" },
];

const badges: { name: string; link: string; requires42?: boolean }[] = [
    { name: "42 Belgium", link: "https://42belgium.be" },
    {
        name: "ft_transcendence",
        link: "https://cdn.intra.42.fr/pdf/pdf/203995/en.subject.pdf",
        requires42: true,
    },
    { name: "GitHub", link: "https://github.com/Franky2201/chadscendence" },
];

const About: React.FC = () => {
    const { theme } = useTheme();
    const { isLoading, user } = useAuth();
    const navigate = useNavigate();

    const adminOr42 = Boolean(user?.intraId || user?.role?.name === "Admin");

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                Loading ...
            </div>
        );

    return (
        <Window
            color={theme}
            className="relative min-h-screen w-full overflow-hidden bg-cover bg-center"
        >
            <Card
                className="relative max-w-250 mx-auto p-6"
                title="Who's is the Chad ?"
                description="Back"
                size="large"
                onClick={() => navigate(-1)}
            >
                <div className="flex flex-wrap gap-1 mb-3">
                    {badges.map((badge) => {
                        if (badge.requires42 && !adminOr42) return null;
                        return (
                            <a
                                href={badge.link}
                                className="flex"
                                key={badge.name}
                                target="_blank"
                            >
                                <Badge className="text-xs">{badge.name}</Badge>
                            </a>
                        );
                    })}
                </div>

                <div className="mb-4">
                    <p className="text-sm leading-relaxed">
                        A web platform for primitive minigames built around
                        knowledge and reflection. A fun way to learn things,
                        train your brain, or compete with friends. Built by a
                        team of 5 as part of the 42 curriculum.
                    </p>
                </div>
                <p className="text-md font-semibold tracking-widest justify-self-center uppercase">
                    The Team
                </p>
                <div className="p-3 mb-3">
                    <div className="flex flex-wrap justify-center gap-3">
                        {developers.map((dev, index) => (
                            <a key={index} href={dev.link} target="_blank">
                                <div
                                    className="rounded-2xl border border-neutral-400
                                		hover:bg-neutral-500 h-16,5 w-60"
                                >
                                    <div className="flex m-1">
                                        <img
                                            src={dev.pic}
                                            alt={`${dev.name} profile`}
                                            className="w-22 h-22 rounded-xl"
                                        />
                                        <div className="ml-2 self-center">
                                            <h2 className="font-bold text-sm mb-0.5">
                                                {dev.name}
                                            </h2>
                                            <p className="text-xs mb-0.5">
                                                @{dev.username}
                                            </p>
                                            <p className="text-xs uppercase tracking-widest">
                                                {dev.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                <p className="text-md font-semibold tracking-widest uppercase">
                    Technologies Used
                </p>
                <div className="p-3 pt-2">
                    {stackLayers.map((layer) => (
                        <div key={layer.label} className="mb-1">
                            <span className="text-xs uppercase self-center">
                                {layer.label}
                            </span>
                            <div className="flex flex-wrap gap-1 p-1">
                                {layer.stack.map((layer) => (
                                    <Badge
                                        key={layer.name}
                                        color={layer.color as ItemColor}
                                        className={`text-xs font-medium`}
                                    >
                                        {layer.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {adminOr42 && (
                    <>
                        <p className="text-md font-semibold tracking-widest uppercase">
                            Project Modules
                        </p>
                        <div className="p-3">
                            <div className="flex flex-col gap-1">
                                {modules.map((mod) => (
                                    <div
                                        key={mod.name}
                                        className="border flex items-center justify-between rounded-xl px-1.5 py-1"
                                    >
                                        <span className="text-sm ml-1.5">
                                            {mod.name}
                                        </span>
                                        <Badge
                                            className="text-xs font-medium rounded-full"
                                            color={`${mod.type === "Major" ? "red" : "green"}`}
                                        >
                                            {mod.type}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                <p className="flex items-center justify-center text-sm uppercase tracking-widest mt-3">
                    Made with ❤️ at 42 Belgium
                </p>
            </Card>
        </Window>
    );
};

export default About;
