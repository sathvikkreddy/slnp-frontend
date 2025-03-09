import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../lib/axios'
import { Button } from '@/components/ui/button'
import { GalleryVerticalEnd, Loader2 } from 'lucide-react'

const Login = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:1337'

  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const access_token = searchParams.get('access_token')
    if (access_token) {
      api
        .get(`api/auth/google/callback?access_token=${access_token}`)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem('slnp_jwt', res.data.jwt)
            window.location.reload()
          } else {
            searchParams.set('error', 'true')
            console.log('res status not 200, res: ', res)
          }
        })
        .catch((err) => {
          searchParams.set('error', 'true')
          console.log('Error while fetching jwt, err: ', err)
        })
    }
  }, [searchParams])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs flex justify-center">
            <Button variant={'outline'} onClick={() => setIsLoading(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              <a href={baseURL + '/api/connect/google'} className="pb-0.5">
                Login with Google
              </a>
              {isLoading && <Loader2 className="animate-spin" />}
            </Button>
          </div>
        </div>
        {searchParams.get('error') === 'true' && (
          <div className="text-center bg-red-200 p-4 rounded-xl border border-red-500">
            Something went wrong, try logging in again.
          </div>
        )}
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://ui.shadcn.com/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export default Login
