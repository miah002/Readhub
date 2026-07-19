import { LoginView } from '@/components/login-view'
import { signIn } from '@/lib/supabase/actions'

export default function LoginPage() {
  return <LoginView onSubmit={signIn} />
}
