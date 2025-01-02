'use client';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            PureProperty.ca
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/listings"
              className={`transition-colors ${
                isActive('/listings')
                  ? 'text-blue-800 font-medium'
                  : 'text-gray-800 hover:text-blue-800'
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
                      ? 'bg-blue-800 text-white'
                      : 'bg-blue-800 text-white hover:bg-blue-600'
                  }`}
                >
                  List Property
                </Link>
                <Link
                  href="/dashboard/listings"
                  className={`transition-colors ${
                    pathname.startsWith('/dashboard')
                      ? 'text-blue-800 font-medium'
                      : 'text-gray-800 hover:text-blue-00'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/api/auth/logout"
                  className="bg-gray-200 bg-opacity-80 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
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