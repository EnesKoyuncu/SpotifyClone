import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession,signOut } from 'next-auth/react';
import { useState } from 'react';
import React from 'react';
import {shuffle} from "lodash";
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import {playlistIdState, playlistState} from "../atoms/playlistAtom";
import useSpotify from '../hooks/useSpotify';
import Songs from "../components/Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];
function Center() {

  const { data : session} = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(()=>{
    if(spotifyApi.getAccessToken()){
      spotifyApi.getPlaylist(playlistId).then((data) => {
      setPlaylist(data.body);
    }).catch((err) => console.log("Something went wrong!",));

    }
    
  }, [spotifyApi, playlistId]);

  console.log("there is >>>>>>>> ", playlist);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div onClick={signOut} className="flex item-center bg-black space-x-3  opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white">

            <img  className="rounded-full h-10 w-10"  src= {session?.user.image} alt=''></img>
            <h2>{session?.user.name} </h2>
            <ChevronDownIcon className='h-5 w-5' />

        </div>
      </header>

        <section className={`flex items-end space-x-7 bg-gradient-to-b
          to-black ${color} h-80 text-white p-8`}>
            <img className='h-44 w-44 shadow-2xl' src={playlist?.images?.[0]?.url} alt=""></img>
            <div>
              <p>PLAYLIST</p>
              <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
            </div>
        </section>
        <div>
          <Songs />
        </div>

    </div>
      
  );
}

export default Center
