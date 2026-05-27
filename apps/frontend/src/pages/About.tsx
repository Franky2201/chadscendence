import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/ui';

export const developers = [
  {
    name: 'Guillaume De Win',
    role: 'Technical Lead',
    pic: '/admin_gde_win.png',
    link: 'https://github.com/Franky2201',
    username: 'gde-win',
  },
  {
    name: 'Julien Hanse',
    role: 'Product Owner',
    pic: '/admin_juhanse.png',
    link: 'https://github.com/juhanse',
    username: 'juhanse',
  },
  {
    name: 'Antonia De Woelmont',
    role: 'Project Manager',
    pic: '/admin_ade_woel.png',
    link: 'https://github.com/antoniadw',
    username: 'ade-woel',
  },
  {
    name: 'Matteo Micheletti',
    role: 'Developer',
    pic: '/admin_mmichele.png',
    link: 'https://github.com/TotemaM',
    username: 'mmichele',
  },
  {
    name: 'Sasha Demey',
    role: 'Developer',
    pic: '/admin_sdemey.png',
    link: 'https://github.com/sdemey00',
    username: 'sdemey',
  },
];

const stackLayers = [
  {
    label: 'Frontend',
    stack: [
      { name: 'Typescript', color: 'bg-cyan-100 text-cyan-700' },
      { name: 'React', color: 'bg-sky-100 text-sky-700' },
      { name: 'Tailwind CSS', color: 'bg-teal-100 text-teal-700' },
      { name: 'Vite', color: 'bg-purple-100 text-purple-700' },
    ],
  },
  {
    label: 'Backend',
    stack: [
      { name: 'Typescript', color: 'bg-cyan-100 text-cyan-700' },
      { name: 'NestJS', color: 'bg-red-100 text-red-700' },
      { name: 'PostgreSQL', color: 'bg-pink-100 text-pink-700' },
      { name: 'TypeORM', color: 'bg-orange-100 text-orange-700' },
    ],
  },
  {
    label: 'Tooling',
    stack: [
      { name: 'Docker', color: 'bg-blue-100 text-blue-700' },
      { name: 'Node.js', color: 'bg-green-100 text-green-700' },
      { name: 'ESLint', color: 'bg-violet-100 text-violet-700' },
    ],
  },
];

const modules = [
  { name: 'Framework on both frontend and backend', type: 'Major' },
  { name: 'ORM for the database', type: 'Minor' },
  { name: 'Remote authentication with OAuth 2.0', type: 'Minor' },
  { name: 'Custom design system (10+ components)', type: 'Minor' },
];

const badges = [
  { name: '42 Belgium', link: 'https://42belgium.be' },
  {
    name: 'ft_transcendence',
    link: 'https://cdn.intra.42.fr/pdf/pdf/203995/en.subject.pdf',
  },
  { name: 'GitHub', link: 'https://github.com/Franky2201/chadscendence' },
];

const About: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        Chargement...
      </div>
    );

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-slate-900 bg-cover bg-center text-white font-sans"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/50 to-slate-900/90" />

      <div className="relative z-10 flex flex-col h-full min-h-screen">
        <div className="flex w-full justify-between items-center p-10">
          <Link to="/">
            <img
              src="/logo.png"
              alt="WhoIsChad"
              className="w-48 object-contain drop-shadow-2xl transition-transform hover:scale-105"
            />
          </Link>
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-black tracking-wide drop-shadow-xl">
              Credits
            </h1>
            <Link to="/">
              <Button>Retour</Button>
            </Link>
          </div>
        </div>

        <Card className="relative max-w-4xl min-w-1/2 -mt-10 mx-auto">
          <div className="flex flex-row">
            {badges.map((badge) => (
              <div key={badge.name}>
                <a
                  href={badge.link}
                  className="hover:underline mr-3 inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-3 py-1 mb-3"
                >
                  {badge.name}
                </a>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h1 className="text-5xl font-black tracking-widest uppercase text-slate-800 mb-2">
              Who's the <span className="text-[#E43A70]">Chad?</span>
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              A web platform for primitive minigames built around knowledge and
              reflection. A fun way to learn things, train your brain, or
              compete with friends. Built by a team of 5 as part of the 42
              curriculum.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              The Team
            </p>
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {developers.map((dev, index) => (
                <Card
                  key={index}
                  className="flex items-center gap-4 p-4 h-15 rounded-xl bg-white/[0.04] border border-white/10 transition-all hover:bg-[#E43A70]/10 hover:border-[#E43A70]/40 hover:-translate-y-0.5"
                >
                  <img
                    src={dev.pic}
                    alt={`${dev.name} profile`}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm mb-0.5">
                      {dev.name}
                    </h2>
                    <a
                      href={dev.link}
                      className="text-[#E43A70] text-xs hover:underline block mb-1"
                    >
                      @{dev.username}
                    </a>
                    <p className="text-slate-400 text-xs uppercase tracking-widest">
                      {dev.role}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-slate-600 text-2xl font-bold mb-4">
              Technologies Used
            </h2>
            <div>
              {stackLayers.map((layer) => (
                <div key={layer.label} className="flex item-center gap-4">
                  <span className="text-slate-400 text-xs uppercase tracking-widest w-20">
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
          </div>

          <div className="m-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
              Modules
            </p>
            <div className="flex flex-col gap-2">
              {modules.map((mod) => (
                <div
                  key={mod.name}
                  className="bg-[#E43A70]/10 flex items-center justify-between rounded-xl px-4 py-1 border"
                  style={{ borderColor: 'rgba(228, 58, 112, 0.4)' }}
                >
                  <span className="text-sm text-slate-700">{mod.name}</span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                      mod.type === 'Major'
                        ? 'bg-[#fce8ef] text-[#993556] border-[#F4C0D1]'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {mod.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="relative mb-10">
          <p className="mt-5 text-center font-medium">
            Made with ❤️ at 42 Belgium
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
