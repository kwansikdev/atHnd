"use client"

import Link from "next/link"
import { Package, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-40 safe-top">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:gap-3 active:opacity-70 transition-opacity">
          <div className="size-8 md:size-10 rounded-lg bg-primary flex items-center justify-center">
            <Package className="size-4 md:size-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-base md:text-lg">Bishoujo Collection</h1>
            <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">Figure Manager</p>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-10 touch-target hidden md:flex">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/admin/figures">Figures Database</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/figures/add">Add Figure to DB</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/master">Master Data Management</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
