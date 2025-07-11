"use client"

import Link from "next/link"
import { Shield, ShoppingCart, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/story", label: "The Story" },
    { href: "/admin-dashboard", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/home" className="mr-6 flex items-center gap-2">
          <Shield className="h-8 w-8 text-accent" />
          <span className="hidden text-xl font-bold sm:inline-block">GrinchGuard</span>
        </Link>
        
        <div className="hidden flex-1 md:flex">
          <div className="relative w-full max-w-md">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full rounded-full bg-primary-foreground/10 pl-10 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/20 focus:ring-accent"
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/60" />
          </div>
        </div>

        <nav className="hidden items-center gap-4 md:flex ml-auto">
          {navLinks.map(link => (
             <Button key={link.href} variant="ghost" asChild className="hover:bg-primary-foreground/10">
                <Link href={link.href}>{link.label}</Link>
             </Button>
          ))}
          <Button variant="ghost" size="icon" className="relative hover:bg-primary-foreground/10">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">3</span>
            <span className="sr-only">Shopping Cart</span>
          </Button>
          <Button asChild variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/login">Login</Link>
          </Button>
        </nav>
        
        <div className="ml-auto flex items-center md:hidden">
            <Button variant="ghost" size="icon" className="relative mr-2 hover:bg-primary-foreground/10">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">3</span>
                <span className="sr-only">Shopping Cart</span>
            </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-primary text-primary-foreground">
              <div className="flex flex-col gap-4 p-4">
                <Link href="/home" className="mb-4 flex items-center gap-2">
                    <Shield className="h-8 w-8 text-accent" />
                    <span className="text-xl font-bold">GrinchGuard</span>
                </Link>
                <div className="relative w-full">
                    <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full rounded-full bg-primary-foreground/10 pl-10 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/20"
                    />
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/60" />
                </div>
                <nav className="flex flex-col gap-2">
                    {navLinks.map(link => (
                        <Button key={link.href} variant="ghost" asChild className="justify-start text-lg hover:bg-primary-foreground/10">
                            <Link href={link.href}>{link.label}</Link>
                        </Button>
                    ))}
                </nav>
                <Button asChild variant="secondary" className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground text-lg">
                    <Link href="/login">Login</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
