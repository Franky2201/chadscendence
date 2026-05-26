import { useState } from 'react';
import FriendSearch from './FriendSearch';
import FriendList from './FriendList';

export default function Friends() {
	const [isSearching, setIsSearching] = useState(false);

	return (
		<div
			className="flex flex-col items-start p-6 gap-6 w-full max-w-[450px] overflow-hidden rounded-[32px]"
			style={{
				background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
				backdropFilter: 'blur(40px)',
				WebkitBackdropFilter: 'blur(40px)',
				border: '1px solid rgba(255, 255, 255, 0.2)',
				boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
				fontFamily: "'Lexend', sans-serif",
			}}
		>
			<div className="flex justify-between items-center w-full">
				<h2 className="text-[#F8F3F5] text-2xl font-semibold m-0 p-0 leading-none">
					Social
				</h2>
			</div>

			<FriendSearch onSearchActive={setIsSearching} />

			{!isSearching && (
				<div className="w-full h-px bg-white/10 my-2"></div>
			)}

			{!isSearching && <FriendList />}
		</div>
	);
}
