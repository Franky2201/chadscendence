import { Card } from '../ui';
import { Link } from 'react-router-dom';
import { developers } from '../../contexts/AboutContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl relative z-10 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-center text-slate-800 text-5xl font-black tracking-widest uppercase mb-1">
          About <span className="text-[#E43A70]">Us</span>
        </h1>
        <p className="text-center text-slate-500 text-sm m-3 tracking-wide">
          This project was created collaboratively by our team of 5 developers.
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

        <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest">
          <span>Made with ❤️ at 42 Belgium</span>
          <Link
            onClick={onClose}
            to="/about"
            className="text-[#E43A70] hover:underline normal-case tracking-normal"
          >
            More info →
          </Link>
        </div>
      </div>
    </div>
  );
}
