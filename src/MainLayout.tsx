import { useContext } from 'react'
import AppSidebar from './components/sidebar/app-sidebar'
import {
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from './components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import BreadcrumbContext from './contexts/BreadcrumbContext'
import { Link } from 'react-router-dom'

const MainLayout = (props: { children: React.ReactNode }) => {
  const { breadcrumbItems } = useContext(BreadcrumbContext)
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
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
        </header>
        <main className="px-4 h-full">{props.children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout
