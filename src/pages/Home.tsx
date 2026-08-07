import Hero from '../components/Hero'
import FeaturedCollections from '../components/FeaturedCollections'
import BestSellers from '../components/BestSellers'
import Ingredients from '../components/Ingredients'
import Testimonials from '../components/Testimonials'
import SkinQuiz from '../components/SkinQuiz'
import Blog from '../components/Blog'
import Newsletter from '../components/Newsletter'

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <Ingredients />
      <Testimonials />
      <SkinQuiz />
      <Blog />
      <Newsletter />
    </main>
  )
}
