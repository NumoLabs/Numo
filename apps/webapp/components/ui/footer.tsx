import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-600 py-6 md:py-0" style={{ backgroundColor: '#000000' }}>
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-400">© 2025 Numo. Built on Starknet with <span className="text-bitcoin-gold">₿</span></p>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
            Documentation
          </Link>
          <Link href="https://github.com/NumoLabs" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
            GitHub
          </Link>
          <Link href="https://x.com/NumoLabs" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
            X
          </Link>
        </div>
      </div>
    </footer>
  )
}
