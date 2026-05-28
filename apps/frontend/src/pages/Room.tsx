import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Input} from '../components/ui';
import type { ItemColor } from '../components/ui/unified';
import { useAuth } from '../contexts/AuthContext';
import { removeFriend } from '../services/friends';


const GAMES = [
  { id: '0', name: 'Game', type:'memory' },
  { id: '1', name: 'Game', type:'reflex' },
  { id: '2', name: 'Game', type:'puzzle'},
  { id: '3', name: 'Game', type:'culture' },
  { id: '4', name: 'Game', type:'reflex' },
  { id: '5', name: 'Game', type:'puzzle' },
  { id: '6', name: 'Game', type:'memory' },
  { id: '7', name: 'Game', type:'puzzle' },
  { id: '8', name: 'Game', type:'memory' },
  { id: '9', name: 'Game', type:'puzzle' },
  { id: '10', name: 'Game', type:'culture' },
  { id: '11', name: 'Game', type:'reflex' },
  { id: '12', name: 'Game', type:'culture' },
  { id: '13', name: 'Game', type:'puzzle' },
  { id: '14', name: 'Game', type:'reflex' },
];

interface Player {
  name: string;
  host: boolean;
  status: 'online' | 'pending'
}

// const typeStyles: Record<string, string> = {
//   memory: 'border-red-400 text-red-400 hover:border-red-700 hover:bg-red-50',
//   reflex: 'border-blue-400 text-blue-400 hover:border-blue-700 hover:bg-blue-50',
//   puzzle: 'border-orange-400 text-orange-400 hover:border-orange-700 hover:bg-orange-50',
//   culture: 'border-green-400 text-green-400 hover:border-green-700 hover:bg-green-50',
//   default: 'border-red-400 text-red-400 hover:border-red-700 hover:bg-red-50',
// }

const testStyles: Record<string, string> = {
  memory: 'red',
  reflex: 'blue',
  puzzle: 'orange',
  culture: 'green',
  default: 'grey',
}


const maxRounds = 10;
const maxPlayers = 10;

function generateLobbyCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
 
export default function LobbyCreator() {
  const [lobbyCode] = useState(generateLobbyCode);
  const [selected, setSelected] = useState<string[]>([]);
  const [players, setPlayer] = useState<Player[]>([
    { name: 'You', host:true, status:'online'}
  ]);
  const { user, isLoading } = useAuth();
  const [ inviteInput, setInviteInput ] = useState('');

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        Chargement...
      </div>
    );
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
        <h1 className="text-3xl font-bold">Accès refusé</h1>
        <p>Veuillez vous connecter pour lancer une partie.</p>
        <Link to="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }
  
  const toggleGame = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id))
        return (prev.filter(a => a !== id));
      if (prev.length >= maxRounds)
        return prev;
      return [...prev, id];
    });
  };
 
  const inviteFriend = () => {
    const name = inviteInput.trim();
    if (!name) return;
    if (players.length >= maxPlayers) return;
    setPlayer((prev) => [...prev, { name:name, host:false, status:'pending'}]);
    setInviteInput('')
  };
  
  const removeFriend = (i: number) => {
    if (i == 0) return;
    setPlayer((prev) => prev.filter((_,a) => a !== i))
  }
  
  const launch = () => {
    // TODO
    console.log('Launching game');
  };
 
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-slate-900 bg-cover bg-center text-white font-sans"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/50 to-slate-900/90" />
        <div className="relative z-10 flex flex-col">
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
                Lobby
              </h1>
              <Link to="/">
                <Button>Retour</Button>
              </Link>
            </div>
          </div>
        </div>

        <Card className="mb-20 relative max-w-4xl min-w-1/2 -mt-10 mx-auto">
    
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create your game</h1>
            <span className="text-sm text-gray-400">
              Code :{' '}
              <code className="bg-gray-100 text-gray-700 rounded-lg px-2 py-1 font-mono tracking-wider">
                {lobbyCode}
              </code>
            </span>
          </div>
  
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Minigames{' '}
            <span className="normal-case font-normal text-gray-400">
              {selected.length} / {maxRounds}
            </span>
          </p>
          <Card className="grid grid-cols-5 gap-2 mb-4">
            {GAMES.map((g) => {
              // const isSelected = selected.includes(g.id);
              // const gameStyle = typeStyles[g.type] || typeStyles.default
              const test = testStyles[g.type] || testStyles.default
              return (
                <Button
                  key={g.id}
                  color={`${test as ItemColor}`}
                  onClick={() => toggleGame(g.id)}
                  size="small"
                  className="flex flex-col"
                  // className={`flex flex-col items-center gap-2 rounded-full border
                  //   ${isSelected ? `${gameStyle}` 
                  //   : `${gameStyle}` }`} 
                >
                  {g.name}
                <p className="text-xs m-1">
                  {g.type[0].toUpperCase() + g.type.substring(1).toLowerCase()}
                </p>
                </Button>
              );
            })}
          </Card>

          {selected.length > 0 &&
          <div className="my-5">
            <p className="text-xs font-semibold text-gray-400 uppercase">
              Selected games
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.map((id, i) => {
                const g = GAMES.find((a) => a.id === id)!;
                return (
                  <button
                    key={id}
                    onClick={() => toggleGame(id)}
                    className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-3 py-1 text-sm text-pink-500 hover:bg-pink-100 transition" 
                  >
                    {i+1}{'. '}{g.name}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end">
              <Button 
                  // className="mt-5 bg-pink-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-pink-700 transition whitespace-nowrap"
                  size="small"
                  color="red"
                  onClick={() => setSelected([])}
              >
                Clear games
              </Button>
            </div>
          </div>}

  
          <hr className="border-gray-100 my-6" />
  
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Invite friends
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Username…"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && inviteFriend()}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Button
                onClick={inviteFriend}
                color="violet"
                // className="bg-pink-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-pink-700 transition whitespace-nowrap"
              >
                + Inviter
              </Button>
              <Button
                onClick={() => {
                  void navigator.clipboard?.writeText('invitation link');
                }}
                color="grey"
                // className="bg-gray-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-pink-700 transition whitespace-nowrap"
              >
                Share link
              </Button>
            </div>
          </div>

          { players.length > 0 &&
          <div className="my-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Players{' '}
            </p>
            <span className="normal-case font-normal text-gray-400">
              {players.length} / {maxPlayers}
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {players.map((player, i) => (
                <button 
                  key={i}
                  onClick={ () => removeFriend(i) }
                  className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-3 py-1 text-sm text-pink-500 hover:bg-pink-100 transition">
                  <span>
                    {player.name}
                  </span>
                  {player.host && (
                  <span className="text-xs">
                    Host
                    </span>
                  )}
                  <div className={`w-2 h-2 rounded-full ${player.status == 'online' ? 'bg-green-500' : 'bg-orange-500' }`}></div>
                </button>
              ))}
            </div>
            { players.length > 1 &&
            <div className="mt-5 flex justify-end">
              <Button 
                  // className="mt-5 bg-pink-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-pink-700 transition whitespace-nowrap"
                  size="small"
                  color="red"
                  onClick={() => setPlayer([{ name: 'You', host:true, status:'online'}])}
              >
                Clear players
              </Button>
            </div>}
          </div>}

          <div className="flex items-center justify-end">
            <Button
              onClick={launch}
              color="red"
              disabled={selected.length === 0}
              buttonClassName="text-black disable:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursos-not-allowed flex items-center gap-2"
            >
              Start Game 
            </Button>
          </div>
        </Card>
      </div>
  );
}
 
