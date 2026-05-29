import { type CSSProperties } from 'react';
import {
  type ItemColor,
  getItemColorMix,
  getItemColorVariable,
} from './unified';
import { type ThemeName, useTheme } from '../../contexts/theme-context';

type AnimatedBackground = {
  speed?: number;
  angle?: number;
  size?: number;
  color?: ItemColor;
};

const themeClasses: Record<ThemeName, string> = {
  light: 'brightness(1)',
  dark: 'brightness(0.8)',
};

export default function AnimatedBackground({
  speed = 3,
  angle = 45,
  size = 20,
  color = 'grey',
}: AnimatedBackground) {
  const { theme } = useTheme();
  const backgroundVars: CSSProperties & {
    '--ab-angle': string;
    '--ab-size': string;
    '--ab-speed': string;
    '--ab-base': string;
    '--ab-stripe': string;
  } = {
    '--ab-angle': `${angle}deg`,
    '--ab-size': `${Math.max(size, 10)}px`,
    '--ab-speed': `${Math.max(speed, 0.2)}s`,
    '--ab-base': getItemColorVariable(color),
    '--ab-stripe': getItemColorMix(color, 80),
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        ...backgroundVars,
        backgroundColor: 'var(--ab-base)',
        transition: 'background-color 450ms ease, --ab-size 450ms ease',
        filter: themeClasses[theme],
      }}
    >
      <style>
        {`
        @property --ab-angle {
          syntax: '<angle>';
          inherits: true;
          initial-value: 45deg;
        }

        @property --ab-size {
          syntax: '<length>';
          inherits: true;
          initial-value: 40px;
        }

        @keyframes ab-pan {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(calc(var(--ab-size) * -1), 0, 0);
          }
        }`}
      </style>
      <div
        className="absolute left-1/2 top-1/2 h-[300vmax] w-[300vmax] -translate-x-1/2 -translate-y-1/2"
        style={{
		  width: '600vmax',
		  height: '600vmax',
          transform: 'rotate(var(--ab-angle))',
          transition: 'transform 450ms ease',
          transformOrigin: 'center center',
          willChange: 'transform, background-color, mask-size',
        }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundColor: 'var(--ab-stripe)',
            animation: 'ab-pan var(--ab-speed) linear infinite',
            transition:
              'background-color 450ms ease, mask-size 450ms ease, -webkit-mask-size 450ms ease',
            maskImage:
              'linear-gradient(90deg, #000 0 50%, transparent 50% 100%)',
            WebkitMaskImage:
              'linear-gradient(90deg, #000 0 50%, transparent 50% 100%)',
            maskSize: 'var(--ab-size) 100%',
            WebkitMaskSize: 'var(--ab-size) 100%',
            maskRepeat: 'repeat',
            WebkitMaskRepeat: 'repeat',
          }}
        />
      </div>
    </div>
  );
}

/*
import { type CSSProperties } from 'react';
import {
  type ItemColor,
  getItemColorMix,
  getItemColorVariable,
} from './unified';
import { type ThemeName, useTheme } from '../../contexts/theme-context';

type AnimatedBackground = {
  speed?: number;
  angle?: number;
  size?: number;
  color?: ItemColor;
};

const themeClasses: Record<ThemeName, string> = {
  light: 'brightness(1)',
  dark: 'brightness(0.8)',
};

export default function AnimatedBackground({
  speed = 3,
  angle = 45,
  size = 20,
  color = 'grey',
}: AnimatedBackground) {
  const { theme } = useTheme();
  const backgroundVars: CSSProperties & {
    '--ab-angle': string;
    '--ab-size': string;
    '--ab-speed': string;
    '--ab-base': string;
    '--ab-stripe': string;
  } = {
    '--ab-angle': `${angle}deg`,
    '--ab-size': `${Math.max(size, 10)}px`,
    '--ab-speed': `${Math.max(speed, 0.2)}s`,
    '--ab-base': getItemColorVariable(color),
    '--ab-stripe': getItemColorMix(color, 80),
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        ...backgroundVars,
        backgroundColor: 'var(--ab-base)',
        transition:
          'background-color 450ms ease, --ab-size 450ms ease, --ab-stripe 450ms ease, --ab-angle 450ms ease',
        filter: themeClasses[theme],
      }}
    >
      <style>
        {`
        @property --ab-angle {
          syntax: '<angle>';
          inherits: true;
          initial-value: 45deg;
        }

        @property --ab-size {
          syntax: '<length>';
          inherits: true;
          initial-value: 40px;
        }

        @property --ab-stripe {
          syntax: '<color>';
          inherits: true;
          initial-value: #000;
        }

        @keyframes ab-pan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: calc(var(--ab-size) * -1) 0;
          }
        }`}
      </style>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: '600vmax',
          height: '500vmax',
          transform: 'translate(-50%, -50%) rotate(var(--ab-angle))',
          transition: 'transform 450ms ease',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(90deg, var(--ab-stripe) 0 50%, transparent 50% 100%)',
            backgroundSize: 'var(--ab-size) 100%',
            backgroundRepeat: 'repeat',
            backgroundPosition: '0 0',
            animation: 'ab-pan var(--ab-speed) linear infinite',
            transition: 'background-size 450ms ease',
            willChange: 'background-position',
          }}
        />
      </div>
    </div>
  );
}

*/
