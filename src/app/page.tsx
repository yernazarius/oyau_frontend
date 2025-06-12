import Header from "@/components/Header/Header"
import HeroBlock from "@/components/HomePage/HeroBlock"
import WhyOYAU from "@/components/HomePage/WhyOYAU"
import Footer from "@/components/Footer/Footer"
import { WorkspaceProvider } from '@/contexts/WorkspaceContext'

export default function Home() {
  return (
    <div>
      <Header />
      <HeroBlock />
      <WhyOYAU />
      <Footer />
    </div>
  )
}
