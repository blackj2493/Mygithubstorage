'use client';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="w-full px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center pl-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 400 100" 
              className="h-18 w-72"
            >
              {/* Circle with Arrow */}
              <g transform="translate(20, 10)">
                {/* Circle */}
                <circle 
                  cx="40" 
                  cy="40" 
                  r="35" 
                  fill="none" 
                  stroke="#2563EB" 
                  strokeWidth="3"
                />
                
                {/* Arrow */}
                <path 
                  d="M40 60 L40 20 M25 35 L40 20 L55 35" 
                  fill="none" 
                  stroke="#2563EB" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </g>
              
              {/* Text */}
              <text 
                x="110" 
                y="55" 
                fontFamily="Arial" 
                fontSize="32" 
                fontWeight="bold" 
                fill="#1F2937"
              >
                PureProperty<tspan fill="#2563EB">.ca</tspan>
              </text>
            </svg>
          </Link>

          <div className="flex items-center space-x-4 ml-auto">
            <Link
              href="/listings"
              className={`transition-colors ${
                isActive('/listings')
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Browse Listings
            </Link>
            
            {!isLoading && (user ? (
              <>
                <Link
                  href="/listings/create"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive('/listings/create')
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  List Property
                </Link>
                <Link
                  href="/dashboard/listings"
                  className={`transition-colors ${
                    pathname.startsWith('/dashboard')
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/api/auth/logout"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                href="/api/auth/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
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