import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { GalleryVerticalEnd, Home, ScrollText } from 'lucide-react'
import NavMain from './nav-main'
import NavUser from './nav-user'

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pages = [
    {
      title: 'Home',
      url: '/',
      icon: Home,
      isActive: false,
    },
    {
      title: 'Invoices',
      url: '/invoices',
      icon: ScrollText,
      isActive: false,
    },
  ]
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Acme inc.
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={pages} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
