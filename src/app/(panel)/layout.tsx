import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/panel/AppSidebar"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/panel/ThemeToggle"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Double check authorization, although proxy handles it primarily
  if (session.role !== "ADMIN" && session.role !== "MANAGER") {
    redirect("/");
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={session as { name: string; email: string; role: string }} />
        <main className="flex-1 overflow-auto bg-card-bg">
          <header className="flex h-14 items-center gap-4 border-b border-card-border bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">     
            <SidebarTrigger className="text-foreground-secondary hover:text-foreground" />
            <div className="flex-1">
               <h1 className="text-sm font-semibold text-foreground-secondary hidden md:block">Titan Workspace</h1>
            </div>
          </header>
          <div className="p-4 lg:p-6 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
