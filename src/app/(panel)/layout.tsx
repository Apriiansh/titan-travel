import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/panel/AppSidebar"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NotificationToast } from "@/components/NotificationToast"
import { PanelHeader } from "@/components/panel/PanelHeader"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "ADMIN" && session.role !== "MANAGER") {
    redirect("/");
  }

  return (
    <TooltipProvider>
      <NotificationToast userId={session.id as string} role={session.role as string} />
      <SidebarProvider>
        <AppSidebar user={session as { name: string; email: string; role: string }} />
        <main className="flex-1 overflow-auto bg-card-bg">
          <PanelHeader user={session as { name: string; email: string; role: string }} />
          <div className="p-4 lg:p-6 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
