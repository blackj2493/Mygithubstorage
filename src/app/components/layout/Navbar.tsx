'use client';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-full mx-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo - Reduced by 15% */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="relative w-14 h-14">
                <svg 
                  viewBox="0 0 100 100" 
                  className="w-full h-full text-blue-600"
                >
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3"
                  />
                  <path 
                    d="M50 70 L50 30 M35 45 L50 30 L65 45" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-4xl font-bold text-gray-900">
                Pure<span className="text-blue-600">Property</span>
                <span className="text-gray-600">.ca</span>
              </span>
            </div>
          </Link>

          {/* Navigation Items - kept on the right */}
          <div className="flex items-center space-x-8 pr-4">
            <Link
              href="/listings"
              className={`text-xl font-semibold transition-colors ${
                isActive('/listings')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Browse Listings
            </Link>
            
            {!isLoading && (user ? (
              <>
                <Link
                  href="/listings/create"
                  className={`px-8 py-3.5 rounded-xl text-xl font-semibold transition-all transform hover:scale-105 ${
                    isActive('/listings/create')
                      ? 'bg-blue-700 text-white shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  List Property
                </Link>
                <Link
                  href="/dashboard/listings"
                  className={`text-xl font-semibold transition-colors ${
                    pathname.startsWith('/dashboard')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/api/auth/logout"
                  className="text-xl font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                href="/api/auth/login"
                className="px-8 py-3.5 rounded-xl text-xl font-semibold transition-all transform hover:scale-105 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}