import { useState, useEffect } from 'react';
import { searchUsers, type UserSearchResult } from '../../services/users';
import { useFriends } from '../../contexts/FriendsContext';
import { Input, Button } from '../ui';

interface FriendSearchProps {
	onSearchActive: (isActive: boolean) => void;
}

export default function FriendSearch({ onSearchActive }: FriendSearchProps) {
	const { sendRequest, friends, sentRequests } = useFriends();
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<UserSearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		onSearchActive(query.length > 0);

		if (query.trim() === '') {
			setResults([]);
			return;
		}

		const delayDebounceFn = setTimeout(async () => {
			setIsSearching(true);
			try {
				const users = await searchUsers(query);
				setResults(users);
			} catch (err) {
				setResults([]);
			} finally {
				setIsSearching(false);
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [query, onSearchActive]);

	const handleSendRequest = async (userId: string) => {
		try {
			await sendRequest(userId);
		} catch (error) {
			console.log("Information: Demande d'ami ignorée ou déjà existante.");
		}
	};

	return (
		<div className="flex flex-col gap-4 w-full">
			<Input
				type="text"
				placeholder="Rechercher un joueur..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="w-full !bg-white/10 !border-white/20 !text-white !rounded-xl !px-4 !py-3 focus:!outline-none focus-visible:!ring-2 focus-visible:!ring-pink-500 placeholder:!text-white/40"
			/>

			{query.length > 0 && (
				<div className="flex flex-col gap-3">
					{isSearching ? (
						<p className="text-white/60 text-sm">Recherche...</p>
					) : results.length > 0 ? (
						results.map((user) => {
							const isAlreadyFriend = friends.some((f) => f.id === user.id);
							const isRequestSent = sentRequests.some((req) => req.addresseeId === user.id);

							return (
								<div key={user.id} className="flex flex-row items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
									<div className="flex items-center gap-3">
										<img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
										<span className="text-white font-medium">{user.username}</span>
									</div>

									{isAlreadyFriend ? (
										<Button disabled size="small" className="!bg-white/5 !border-white/10 !text-white/40 !rounded-lg">
											Ami
										</Button>
									) : isRequestSent ? (
										<Button disabled size="small" className="!bg-slate-700 !text-slate-300 !rounded-lg">
											Attente
										</Button>
									) : (
										<Button
											onClick={() => handleSendRequest(user.id)}
											size="small"
											className="!bg-pink-600 hover:!bg-pink-700 !text-white !rounded-lg"
										>
											Ajouter
										</Button>
									)}
								</div>
							);
						})
					) : (
						<p className="text-white/60 text-sm">Aucun joueur trouvé.</p>
					)}
				</div>
			)}
		</div>
	);
}
