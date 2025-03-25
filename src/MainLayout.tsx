import { useContext } from 'react'
import AppSidebar from '@/components/sidebar/app-sidebar'
import {
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { AddInvoiceDialog } from '@/components/modals/invoice/add-invoice'
import { Moon, Sun } from 'lucide-react'
import { BreadcrumbContext, ThemeContext } from '@/contexts'

const MainLayout = (props: { children: React.ReactNode }) => {
  const { breadcrumbItems } = useContext(BreadcrumbContext)
  const { setTheme } = useContext(ThemeContext)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen">
        <header className="sticky top-0 bg-sidebar z-40 opacity-100 flex h-16 shrink-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex justify-between px-4 w-full">
            <div className="flex gap-2 justify-start items-center">
              <SidebarTrigger className="-ml-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((breadcrumbItem, index) => {
                    return (
                      <>
                        {index !== 0 && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                        <BreadcrumbItem>
                          {index !== breadcrumbItems.length - 1 ? (
                            <BreadcrumbLink asChild>
                              <Link to={breadcrumbItem.url}>
                                {breadcrumbItem.label}
                              </Link>
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>
                              {breadcrumbItem.label}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </>
                    )
                  })}
                  {/* <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> */}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex gap-2 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AddInvoiceDialog />
            </div>
          </div>
        </header>
        <main className="p-4 h-full z-30">{props.children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout
