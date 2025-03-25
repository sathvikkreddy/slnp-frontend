import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const NavMain = ({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}) => {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Link to={item.url}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <div>
                  {item.icon && <item.icon />}
                  {item.title}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain
