import { useState } from 'react';
import { register } from '../../services/auth';
import { getMe } from '../../services/users';
import { useAuth } from '../../contexts/AuthContext';
import { extractErrorMessage } from '../../services/error';
import { Button, Input, Card } from '../ui/index';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledEmail?: string;
}

export default function RegisterModal({
  isOpen,
  onClose,
  prefilledEmail = '',
}: RegisterModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState(prefilledEmail);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register({ email, username, password });

      const userResponse = await getMe();
      login(userResponse);
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <Card
        className="max-w-md w-full"
        onMouseDown={(e) => e.stopPropagation()}
        title="Register"
      >
        {error && (
          <p className="text-[color:var(--color-red)] text-center mb-4 font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            size="large"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
          <Input
            size="large"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
            required
          />
          <Input
            size="large"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            required
          />
          <Button type="submit" className="w-full" size="large">
            Créer un compte
          </Button>
        </form>
      </Card>
    </div>
  );
}
