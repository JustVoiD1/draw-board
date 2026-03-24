import Link from 'next/link'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { ModeToggle } from '../mode-toggle'

const Header = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
          <ModeToggle />
        </div>
      </header>
  )
}

export default Header