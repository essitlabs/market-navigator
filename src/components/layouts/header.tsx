"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        
        <div className="flex items-center gap-8">
          
          <Link href="/" className="text-xl font-semibold">
            Market Navigator
          </Link>

     
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <Link href="/">Sector Overview</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about">Sector Analysis</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact">Company Deep Dive</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact">Watchlists</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

      
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

 
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Menu</Button>
            </SheetTrigger>

           
            <SheetContent
              side="right"
              className="w-64 p-6 flex flex-col justify-between"
            >
              <nav className="flex flex-col space-y-4">
                <Link href="/">Sector Overview</Link>
                <Link href="/about">Sector Analysis</Link>
                <Link href="/contact">Company Deep Dive</Link>
                <Link href="/contact">Watchlists</Link>
              </nav>

             
              <div className="mt-auto flex justify-start pt-6">
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
