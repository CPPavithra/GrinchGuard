"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Shield,
  LayoutDashboard,
  Bot,
  Fingerprint,
  AlertTriangle,
  FileText,
  BookOpen,
  LogOut
} from "lucide-react"

const navItems = [
  { href: "/admin-dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/chaos-test", icon: Bot, label: "Chaos Test" },
  { href: "/fingerprint", icon: Fingerprint, label: "Fingerprint" },
  { href: "/alerts", icon: AlertTriangle, label: "Alerts" },
  { href: "/export", icon: FileText, label: "Export" },
  { href: "/story", icon: BookOpen, label: "Story" },
]

export function AdminSidebarContent() {
  const pathname = usePathname()

  return (
    <>
      <SidebarHeader>
        <Link href="/home" className="flex items-center gap-2">
          <Shield className="size-8 text-accent" />
          <span className="text-lg font-semibold text-sidebar-foreground">GrinchGuard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Avatar className="size-7">
                <AvatarImage src="https://github.com/santaclaus.png" alt="Santa Claus" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <span>Santa Claus</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/login">
                  <LogOut />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
