import Link from 'next/link';
import { Camera, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white transition-transform group-hover:scale-105">
            <Camera className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">
            CivLens
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-black"
          >
            Report Issue
          </Link>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
