"use client"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TextAlignJustify } from "lucide-react";
import AuthButton from "@/components/auth-button"
import { ModeToggle } from "@/components/theme-toggle";
import * as React from "react"

export const MobileNav = () => {
  return (
    <div className="sm:hidden">
    <nav className="sticky top-0">
      <div className="w-1/2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-2"><TextAlignJustify/></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <Link href="/"><DropdownMenuItem>Home</DropdownMenuItem></Link>
              <Link href="/input"><DropdownMenuItem>Input</DropdownMenuItem></Link>
              <Link href="/papers"><DropdownMenuItem>Papers</DropdownMenuItem></Link>
              <Link href="/people"><DropdownMenuItem>People</DropdownMenuItem></Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-1/2 flex justify-end items-center px-2 gap-4"><AuthButton/><ModeToggle/></div>
    </nav>
    </div>
  )
}

export const DesktopNav = () => {
  return (
    <div className="hidden sm:block">
      <nav className="sticky top-0">
        <div className="w-1/3"></div>
        <div className="w-1/3 flex justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/input">Input</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/papers">Papers</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/people">People</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>
        <div className="w-1/3 flex justify-end items-center px-2 gap-4"><AuthButton/><ModeToggle/></div>
      </nav>
    </div>
  )
}