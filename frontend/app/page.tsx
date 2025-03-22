"use client"

import VintageTV from "@/components/vintage-tv"
import { Web3Provider } from "@/contexts/Web3Context"
export default function Home() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(20,50,20,0.1)_0%,rgba(0,0,0,0.95)_100%)]"></div>

    <Web3Provider>
      <VintageTV />
    </Web3Provider>
    </div>
  )
}

