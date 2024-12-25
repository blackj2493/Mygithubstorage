import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/layout/Navbar';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PureProperties - Your Real Estate Marketplace',
  description: 'Find your perfect property with PureProperties. Browse houses, apartments, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-50">
              {children}
            </main>
            <footer className="bg-gray-800 text-white py-6">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">PureProperties</h3>
                    <p className="text-gray-300">
                      Your trusted partner in finding the perfect property.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="/listings" className="text-gray-300 hover:text-white">
                          Browse Listings
                        </a>
                      </li>
                      <li>
                        <a href="/listings/create" className="text-gray-300 hover:text-white">
                          List Property
                        </a>
                      </li>
                      <li>
                        <a href="/dashboard" className="text-gray-300 hover:text-white">
                          Dashboard
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact</h3>
                    <ul className="space-y-2">
                      <li className="text-gray-300">
                        <span className="block">Email:</span>
                        <a href="mailto:info@pureproperties.ca" className="hover:text-white">
                          info@pureproperties.ca
                        </a>
                      </li>
                      <li className="text-gray-300">
                        <span className="block">Phone:</span>
                        <a href="tel:+1234567890" className="hover:text-white">
                          (123) 456-7890
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                      {/* Social Media Icons */}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700 text-center">
                  <p className="text-gray-300">
                    © {new Date().getFullYear()} PureProperties. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}