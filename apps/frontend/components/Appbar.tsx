import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

import React from 'react';
import { Button } from './ui/button';
import { Monitor, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';

function Appbar() {
  return (
    <nav className='sticky top-0 z-50 shadow-md backdrop-blur-md supports-[backdrop-filter]:bg-white/60'>
      <div className='flex items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16'>
        <div className='flex items-center space-x-2'>
          <Link href='/'>
            <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg'>
              <Monitor className='w-5 h-5 text-white' />
            </div>
            <span className='font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Up3
            </span>
          </Link>
        </div>

        <SignedIn>
          <div className='hidden md:flex items-center space-x-8'>
            <a
              href='/dashboard'
              className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200'
            >
              <BarChart3 className='w-4 h-4' />
              <span className='font-medium'>Dashboard</span>
            </a>
            <a
              href='/monitors'
              className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200'
            >
              <Monitor className='w-4 h-4' />
              <span className='font-medium'>Monitors</span>
            </a>
            <a
              href='/status'
              className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200'
            >
              <Shield className='w-4 h-4' />
              <span className='font-medium'>Status</span>
            </a>
          </div>
        </SignedIn>

        <div className='flex items-center space-x-3'>
          <SignedOut>
            <SignInButton>
              <Button
                variant='ghost'
                className='hidden sm:inline-flex border hover:text-gray-900 hover:bg-gray-100 font-medium transition-colors duration-200 cursor-pointer'
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer'>
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <div className='flex items-center space-x-3'>
              <Button
                variant='outline'
                size='sm'
                className='hidden sm:inline-flex border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200'
              >
                Add Monitor
              </Button>
              <div className='w-8 h-8 rounded-full ring-2 ring-gray-200 ring-offset-2'>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8',
                    },
                  }}
                />
              </div>
            </div>
          </SignedIn>
        </div>
      </div>

      <SignedIn>
        <div className='md:hidden border-t border-gray-200 bg-white/90 backdrop-blur-sm'>
          <div className='flex justify-around py-2'>
            <a
              href='/dashboard'
              className='flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors duration-200'
            >
              <BarChart3 className='w-5 h-5' />
              <span className='text-xs font-medium mt-1'>Dashboard</span>
            </a>
            <a
              href='/monitors'
              className='flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors duration-200'
            >
              <Monitor className='w-5 h-5' />
              <span className='text-xs font-medium mt-1'>Monitors</span>
            </a>
            <a
              href='/status'
              className='flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors duration-200'
            >
              <Shield className='w-5 h-5' />
              <span className='text-xs font-medium mt-1'>Status</span>
            </a>
          </div>
        </div>
      </SignedIn>
    </nav>
  );
}

export default Appbar;
