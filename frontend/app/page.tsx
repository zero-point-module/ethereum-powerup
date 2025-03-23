"use client";

import { Providers } from "./providers";
import { EOAUpgrade } from "@/components/EOAUpgrade";

export default function Home() {
  return (
    <Providers>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <EOAUpgrade />
      </main>
    </Providers>
  );
}
