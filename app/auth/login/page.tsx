import { LoginForm } from '@/components/login-form'
import "@/app/globals.css";

export default function Page() {
  return (
    <div className="flex w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
