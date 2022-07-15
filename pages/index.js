import{ NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'


export default function Home() {
  
  return (
    <div className="bg-black h-screen overflow-hidden">
      
      <main className='flex'>
        <Sidebar/>
        <Center/>
      </main>
      
      <div>{/* Player */}</div>
    </div>
  );
}

