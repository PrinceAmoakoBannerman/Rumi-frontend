import Hero from '../components/Hero'
import Welcome from '../components/Welcome'
import NewArrivals from '../components/NewArrivals'
import SaleClearance from '../components/SaleClearance'
import BestSellers from '../components/BestSellers'
import BrandShowcase from '../components/BrandShowcase'
import Testimonials from '../components/Testimonials'
import SkinQuiz from '../components/SkinQuiz'
import Blog from '../components/Blog'
import Newsletter from '../components/Newsletter'

export default function Home() {
  return (
    <main>
      <Hero />
      <Welcome />
      <NewArrivals />
      <SaleClearance />
      <BestSellers />
      <BrandShowcase />
      <Testimonials />
      <SkinQuiz />
      <Blog />
      <Newsletter />
    </main>
  )
}
