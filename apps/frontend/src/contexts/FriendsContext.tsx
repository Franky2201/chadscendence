import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import {
	type Friend, type FriendRequest, type SentRequest,
	getFriends, getPendingRequests, getSentRequests,
	acceptFriendRequest, removeFriend, sendFriendRequest
} from '../services/friends';
import { useAuth } from './AuthContext';

interface FriendsContextType {
	friends: Friend[];
	requests: FriendRequest[];
	sentRequests: SentRequest[];
	isLoading: boolean;
	refreshFriends: () => Promise<void>;
	acceptRequest: (friendshipId: string) => Promise<void>;
	declineRequest: (friendshipId: string) => Promise<void>;
	removeFriend: (friendshipId: string) => Promise<void>;
	sendRequest: (userId: string) => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export function FriendsProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth();

	const [friends, setFriends] = useState<Friend[]>([]);
	const [requests, setRequests] = useState<FriendRequest[]>([]);
	const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const refreshFriends = useCallback(async () => {
		if (!user) {
			setFriends([]);
			setRequests([]);
			setSentRequests([]);
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			const [friendsData, requestsData, sentRequestsData] = await Promise.all([
				getFriends(),
				getPendingRequests(),
				getSentRequests()
			]);
			setFriends(friendsData);
			setRequests(requestsData);
			setSentRequests(sentRequestsData);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	useEffect(() => {
		refreshFriends();
	}, [refreshFriends]);

	const acceptRequest = async (friendshipId: string) => {
		await acceptFriendRequest(friendshipId);
		await refreshFriends();
	};

	const declineRequest = async (friendshipId: string) => {
		await removeFriend(friendshipId);
		await refreshFriends();
	};

	const handleRemoveFriend = async (friendshipId: string) => {
		await removeFriend(friendshipId);
		await refreshFriends();
	};

	const handleSendRequest = async (userId: string) => {
		await sendFriendRequest(userId);
		await refreshFriends();
	};

	return (
		<FriendsContext.Provider value={{
			friends,
			requests,
			sentRequests,
			isLoading,
			refreshFriends,
			acceptRequest,
			declineRequest,
			removeFriend: handleRemoveFriend,
			sendRequest: handleSendRequest
		}}>
			{children}
		</FriendsContext.Provider>
	);
}

export const useFriends = () => {
	const context = useContext(FriendsContext);
	if (context === undefined) {
		throw new Error('useFriends doit être utilisé dans un FriendsProvider');
	}
	return context;
};
