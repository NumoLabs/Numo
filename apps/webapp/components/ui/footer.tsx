export function Footer() {
  return (
    <footer className="border-t border-gray-600 py-4 md:py-0" style={{ backgroundColor: '#000000' }}>
      <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row">
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm text-gray-400">© 2025 Numo. Built on Starknet with <span className="text-bitcoin-gold">₿</span></p>
        </div>
      </div>
    </footer>
  )
}
