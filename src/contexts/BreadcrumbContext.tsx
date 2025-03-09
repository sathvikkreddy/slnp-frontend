import React, { createContext, useState } from 'react'

const BreadcrumbContext = createContext<IBreadcrumbContext>({
  breadcrumbItems: [{ label: 'Home', url: '/' }],
  setBreadcrumbItems: () => null,
})

export const BreadcrumbContextProvider = (props: {
  children: React.ReactNode
}) => {
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([
    { label: 'Home', url: '/' },
  ])
  return (
    <BreadcrumbContext.Provider value={{ breadcrumbItems, setBreadcrumbItems }}>
      {props.children}
    </BreadcrumbContext.Provider>
  )
}

export type BreadcrumbItem = { label: string; url: string }
interface IBreadcrumbContext {
  breadcrumbItems: BreadcrumbItem[]
  setBreadcrumbItems: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>
}

export default BreadcrumbContext
