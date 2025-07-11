"use client"

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AdminSidebarContent } from "@/components/admin-sidebar-content"
import { Shield } from "lucide-react"
import Link from "next/link"

export function AdminLayout({ children, pageTitle }: { children: React.ReactNode, pageTitle: string }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <AdminSidebarContent />
        </Sidebar>
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-4">
                    <div className="md:hidden">
                        <Link href="/home" className="flex items-center gap-2">
                          <Shield className="h-7 w-7 text-primary" />
                        </Link>
                    </div>
                    <h1 className="text-xl font-semibold">{pageTitle}</h1>
                </div>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
