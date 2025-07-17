import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

import React from 'react';
import { Button } from './ui/button';
import { Sparkles, ChartNoAxesColumn } from 'lucide-react';
import Link from 'next/link';

function Appbar() {
  return (
    <nav className='sticky top-0 z-50 border-b border-gray-800/30 bg-black/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/60'>
      <div className='absolute inset-0 bg-gradient-to-r from-violet-600/10 via-blue-600/15 to-cyan-500/10'></div>
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse'></div>

      <div className='relative flex items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16'>
        <div className='flex items-center space-x-3'>
          <Link href='/' className='flex items-center space-x-3 group'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg shadow-violet-500/25'>
                <ChartNoAxesColumn className='w-5 h-5 text-white drop-shadow-lg' />
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='font-bold text-2xl bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg'>
                Up3
              </span>
            </div>
          </Link>
        </div>

        <SignedIn></SignedIn>

        <div className='flex items-center space-x-4'>
          <SignedOut>
            <SignInButton>
              <Button
                variant='ghost'
                className='hidden sm:inline-flex relative group text-gray-300 hover:text-white font-medium transition-all duration-300 border border-gray-700/50 hover:border-violet-500/50 px-6 py-2.5 rounded-xl overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-violet-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                <span className='relative'>Sign In</span>
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className='relative group bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 hover:from-violet-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 border border-violet-400/30'>
                <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl'></div>
                <Sparkles className='w-4 h-4 mr-2 drop-shadow-lg' />
                <span className='relative'>Get Started</span>
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <div className='flex items-center space-x-4'>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10 shadow-xl shadow-violet-500/20',
                    userButtonPopoverCard:
                      'bg-gray-950 border-gray-700 shadow-2xl shadow-violet-500/20',
                    userButtonPopoverActionButton:
                      'text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200',
                    userButtonPopoverActionButtonText: 'text-gray-300',
                    userButtonPopoverFooter: 'bg-gray-900/50 border-gray-700',
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>

      <SignedIn></SignedIn>
    </nav>
  );
}

export default Appbar;
