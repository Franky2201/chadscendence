import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Window, Title } from '../components/ui';
import { useModal } from '../contexts/ModalContext';
import Leaderboard from '../components/home/Leaderboard';
import { withIntra, withGithub } from '../services/auth';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const { openModal } = useModal();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
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
      <div className="flex flex-wrap justify-center gap-3">
        {!user && (
          <Card className="flex flex-col basis-100" title="Identification">
            <Button className="w-full" onClick={() => openModal('LOGIN')}>
              Login
            </Button>
            <Button className="w-full" onClick={() => openModal('REGISTER')}>
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
            {user && <Button className="w-full">Multiplayer</Button>}
            {user && <Button className="w-full">Custom Game</Button>}
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
        <Card className="flex flex-col basis-100" title="Profile">
          <></>
        </Card>
        <Card className="flex flex-col basis-100" title="Friends">
          <></>
        </Card>
        <Card className="flex flex-col basis-100" title="Clan">
          <></>
        </Card>
        <Card className="flex flex-col basis-100" title="Achievements">
          <></>
        </Card>
        <Card className="flex flex-col basis-100" title="Settings">
          <></>
        </Card>
        <Card className="flex flex-col basis-100" title="Credits">
          <></>
        </Card>
      </div>
    </Window>
  );
}
