import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">© 2025 Numo. Built on Starknet.</p>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Documentation
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            GitHub
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Twitter
          </Link>
        </div>
      </div>
    </footer>
  )
}
