import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  LayoutTemplate,
  MonitorPlay,
  Download,
  BookOpen,
  LogOut,
  LogIn,
  Image as ImageIcon,
  Calendar,
} from 'lucide-react'
import useEditorStore from '@/stores/use-editor-store'
import { ExportDialog } from './ExportDialog'
import { useAuth } from '@/hooks/use-auth'
import { Chatbot } from './Chatbot'

export default function Layout() {
  const location = useLocation()
  const { simulateExport } = useEditorStore()
  const { user, signOut } = useAuth()

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background font-sans">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border">
            <span className="font-serif font-bold text-lg text-sidebar-primary tracking-widest uppercase truncate px-2">
              Moda Atual
            </span>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                  <Link to="/">
                    <MonitorPlay className="w-4 h-4" />
                    <span>Estúdio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/templates'}>
                  <Link to="/templates">
                    <LayoutTemplate className="w-4 h-4" />
                    <span>Biblioteca de Templates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/studio'}>
                  <Link to="/studio">
                    <BookOpen className="w-4 h-4" />
                    <span>Editoria (Studio)</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/media'}>
                  <Link to="/media">
                    <ImageIcon className="w-4 h-4" />
                    <span>Biblioteca de Mídia</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/events'}>
                  <Link to="/events">
                    <Calendar className="w-4 h-4" />
                    <span>Eventos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <div className="p-4 border-t border-sidebar-border">
            {user ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" /> Sair
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground"
                asChild
              >
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" /> Entrar
                </Link>
              </Button>
            )}
          </div>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b bg-background flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-[1px] bg-border hidden sm:block" />
              <h1 className="font-serif font-medium text-lg hidden sm:block">ModaAtual Studio</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={simulateExport}
                className="bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold shadow-subtle transition-transform hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Post
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden relative">
            <Outlet />
          </div>
        </main>
      </div>
      <ExportDialog />
      <Chatbot />
    </SidebarProvider>
  )
}
