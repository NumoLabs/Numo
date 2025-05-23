'use client';

import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
  ],
  social: [
    {
      name: 'Twitter',
      href: 'https://twitter.com/numo_finance',
      icon: Twitter,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/numo-finance',
      icon: Github,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#212322] border-t border-[#8B9E93]">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <Link
                href={item.href}
                className="text-base text-gray-300 hover:text-white"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          {navigation.social.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} Numo. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 