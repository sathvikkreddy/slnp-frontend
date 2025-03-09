import { Button } from '@/components/ui/button'
import BreadcrumbContext from '@/contexts/BreadcrumbContext'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  const { setBreadcrumbItems } = useContext(BreadcrumbContext)
  useEffect(() => {
    setBreadcrumbItems([])
  }, [])
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background">
      <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
          404
        </h1>
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="mb-8 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. The page might
          have been moved, deleted, or never existed.
        </p>
        <Button>
          <Link to="/" className="gap-1 flex justify-between items-center">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
