const initialDevelopers = [
    {
        name: "Antonia De Woelmont",
        role: "Project Manager",
        pic: "/admin_ade_woel.png",
        link: "https://github.com/antoniadw",
        username: "ade-woel",
    },
    {
        name: "Guillaume De Win",
        role: "Technical Lead",
        pic: "/admin_gde_win.png",
        link: "https://github.com/Franky2201",
        username: "gde-win",
    },
    {
        name: "Julien Hanse",
        role: "Product Owner",
        pic: "/admin_juhanse.png",
        link: "https://github.com/juhanse",
        username: "juhanse",
    },
    {
        name: "Matteo Micheletti",
        role: "Developer",
        pic: "/admin_mmichele.png",
        link: "https://github.com/TotemaM",
        username: "mmichele",
    },
    {
        name: "Sasha Demey",
        role: "Developer",
        pic: "/admin_sdemey.png",
        link: "https://github.com/sdemey00",
        username: "sdemey",
    },
];

function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a;
}

export const developers = shuffle(initialDevelopers);
