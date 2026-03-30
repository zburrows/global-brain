import { LoginForm } from '@/components/login-form'

export default function Page() {
  return (
    <div className="flex min-h-100vh w-full h-full items-center justify-center px-6 md:px-10">
      <div className="w-full max-w-sm">
        <LoginForm link="/input"/>
      </div>
    </div>
  )
}
