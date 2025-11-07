"use client";

import { Search, Headphones, Bell, ChevronDown } from "lucide-react";
import { ThemeToggle } from "../theme/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-primary"></div>
            </div>
            <span className="text-xl font-bold text-foreground">
              Market Navigator
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Sector Overview
            </a>
            <a
              href="#"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Sector Analysis
            </a>
            <a
              href="#"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Company Deep Dive
            </a>
            <a
              href="#"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Watchlists
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Headphones/Support Icon */}
          <button className="w-10 h-10 rounded-full border border-input bg-background flex items-center justify-center hover:bg-accent transition-colors">
            <Headphones className="h-5 w-5 text-foreground" />
          </button>

          {/* Notification Icon with Badge */}
          <button className="relative w-10 h-10 rounded-full border border-input bg-background flex items-center justify-center hover:bg-accent transition-colors">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
          </button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-input bg-background hover:bg-accent transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                  JD
                </div>
                <span className="text-sm font-medium text-foreground hidden md:block">
                  John Doe
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
