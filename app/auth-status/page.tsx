import { AuthStatusChecker } from "@/components/auth-status-checker"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AuthStatusPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container flex items-center justify-center py-10">
        <AuthStatusChecker />
      </div>
      <Footer />
    </main>
  )
}
