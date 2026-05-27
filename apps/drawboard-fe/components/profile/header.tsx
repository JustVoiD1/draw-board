import Link from 'next/link'
import { Button } from '../ui/button'
import { ArrowLeft, Pencil } from 'lucide-react'
import { ModeToggle } from '../mode-toggle'
import { Sheet, SheetHeader, SheetTitle } from '../ui/sheet'

const Header = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex w-full items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Sheet>
              <SheetHeader>
                <SheetTitle><div className="flex items-center space-x-2">
                  <Pencil className="h-6 w-6 text-slate-900 dark:text-white" />
                  <span className="text-xl font-bold text-slate-900 dark:text-white">DrawBoard</span>
                </div></SheetTitle>
              </SheetHeader>
            </Sheet>
          </Link>
        </div>
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header