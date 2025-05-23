'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletConnector from './connectWallet';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Pools', href: '/pools' },
  { name: 'Ekubo', href: '/ekubo' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#212322] border-b border-[#8B9E93]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white font-bold text-lg">
                Numo
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === item.href
                      ? 'text-[#4DFF6F] border-b-2 border-[#4DFF6F]'
                      : 'text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <WalletConnector />
          </div>
        </div>
      </div>
    </nav>
  );
} 