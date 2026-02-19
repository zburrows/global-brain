'use client'

import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter()
  const pathname = usePathname()
  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    if(pathname == "/input") {
      router.push("/auth/login")
    }
  }

  return <Button onClick={logout}>Logout</Button>
}
