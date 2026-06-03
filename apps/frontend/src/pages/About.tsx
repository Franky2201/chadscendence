import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, Window } from "../components/ui";
import { developers } from "../contexts/AboutContext";

const stackLayers = [
    {
        label: "Frontend",
        stack: [
            { name: "Typescript", color: "bg-cyan-100 text-cyan-700" },
            { name: "React", color: "bg-sky-100 text-sky-700" },
            { name: "Tailwind CSS", color: "bg-teal-100 text-teal-700" },
            { name: "Vite", color: "bg-purple-100 text-purple-700" },
        ],
    },
    {
        label: "Backend",
        stack: [
            { name: "Typescript", color: "bg-cyan-100 text-cyan-700" },
            { name: "NestJS", color: "bg-red-100 text-red-700" },
            { name: "PostgreSQL", color: "bg-pink-100 text-pink-700" },
            { name: "TypeORM", color: "bg-orange-100 text-orange-700" },
        ],
    },
    {
        label: "Tooling",
        stack: [
            { name: "Docker", color: "bg-blue-100 text-blue-700" },
            { name: "Node.js", color: "bg-green-100 text-green-700" },
            { name: "ESLint", color: "bg-violet-100 text-violet-700" },
        ],
    },
];

const modules = [
    { name: "Framework on both frontend and backend", type: "Major" },
    { name: "ORM for the database", type: "Minor" },
    { name: "Remote authentication with OAuth 2.0", type: "Minor" },
    { name: "Custom design system (10+ components)", type: "Minor" },
];

const badges = [
    { name: "42 Belgium", link: "https://42belgium.be" },
    {
        name: "ft_transcendence",
        link: "https://cdn.intra.42.fr/pdf/pdf/203995/en.subject.pdf",
    },
    { name: "GitHub", link: "https://github.com/Franky2201/chadscendence" },
];

const About: React.FC = () => {
    const { isLoading } = useAuth();
    const navigate = useNavigate();

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
                Chargement...
            </div>
        );

    return (
        <Window className="relative min-h-screen w-full overflow-hidden bg-cover bg-center">
            <header className="justify-self-center">
                <img
                    className="select-none w-auto drop-shadow-lg max-h-30 mb-8"
                    src="/game_banner.png"
                    alt="GameLogo"
                />
            </header>

            <Card
                className="relative max-w-250 mx-auto p-6"
                title="Who's is the Chad ?"
                titleClassName="text-4xl"
                description="Back"
                size="large"
                onClick={() => navigate(-1)}
            >
                <div className="flex flex-row">
                    {badges.map((badge) => (
                        <div key={badge.name}>
                            <a
                                href={badge.link}
                                className="hover:underline mr-3 inline-flex 
									items-center gap-1.5 text-xs text-slate-500 
									bg-slate-100 border border-slate-200 
									rounded-full px-3 py-1 mb-3"
                            >
                                {badge.name}
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <p className="text-sm leading-relaxed">
                        A web platform for primitive minigames built around
                        knowledge and reflection. A fun way to learn things,
                        train your brain, or compete with friends. Built by a
                        team of 5 as part of the 42 curriculum.
                    </p>
                </div>

                <div className="mb-4">
                    <p className="text-xs font-semibold tracking-widest uppercase mb-2">
                        The Team
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {developers.map((dev, index) => (
                            <a href={dev.link} target="_blank">
                                <div
                                    key={index}
                                    className="rounded-2xl border border-neutral-400
                                		hover:bg-neutral-500 h-16,5 w-60"
                                >
                                    <div className="flex m-1">
                                        <img
                                            src={dev.pic}
                                            alt={`${dev.name} profile`}
                                            className="w-22 h-22 rounded-xl"
                                        />
                                        <div className="ml-2">
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

                <h2 className="text-2xl font-bold">Technologies Used</h2>
                <div className="p-4">
                    {stackLayers.map((layer) => (
                        <div
                            key={layer.label}
                            className="flex item-center gap-4"
                        >
                            <span className="text-xs uppercase tracking-widest w-20">
                                {layer.label}
                            </span>
                            <div className="flex flex-wrap gap-2 m-1">
                                {layer.stack.map((layer) => (
                                    <span
                                        key={layer.name}
                                        className={`${layer.color} text-xs px-3 py-1 rounded-full font-medium`}
                                    >
                                        {layer.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <p className="text-xs font-semibold tracking-widest uppercase mb-4">
                        Modules
                    </p>
                    <div className="flex flex-col gap-2 mb-6">
                        {modules.map((mod) => (
                            <div
                                key={mod.name}
                                className="bg-[#E43A70]/10 flex items-center justify-between rounded-xl px-4 py-1 border"
                                style={{
                                    borderColor: "rgba(228, 58, 112, 0.4)",
                                }}
                            >
                                <span className="text-sm">{mod.name}</span>
                                <span
                                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                                        mod.type === "Major"
                                            ? "bg-[#fce8ef] text-[#993556] border-[#F4C0D1]"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    }`}
                                >
                                    {mod.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="flex items-center justify-center text-sm uppercase tracking-widest">
                    Made with ❤️ at 42 Belgium
                </p>
            </Card>
        </Window>
    );
};

export default About;
