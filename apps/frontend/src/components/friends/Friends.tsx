import { useState } from 'react';
import FriendSearch from './FriendSearch';
import FriendList from './FriendList';
import { Card } from '../ui';

export default function Friends() {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <Card className="flex flex-col items-start gap-6 w-full max-w-[450px] overflow-hidden !p-8 !rounded-[32px] !bg-white/5 !backdrop-blur-[40px] !border-white/20">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-[#F8F3F5] text-2xl font-semibold m-0 p-0 leading-none">
          Social
        </h2>
      </div>

      <FriendSearch onSearchActive={setIsSearching} />

      {!isSearching && <div className="w-full h-px bg-white/10 my-2"></div>}

      {!isSearching && <FriendList />}
    </Card>
  );
}
