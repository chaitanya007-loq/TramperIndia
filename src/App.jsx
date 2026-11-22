import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Compass,
  HeartHandshake,
  MessageCircle,
  Menu,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard, Navigation, Pagination, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import { company, navItems } from './data/company'
import { destinations } from './data/destinations'
import { galleryImages } from './data/gallery'
import { packages } from './data/packages'
import { testimonials } from './data/testimonials'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const currentYear = new Date().getFullYear()

function Logo() {
  return (
    <Link className="logo" to="/" aria-label="TRAMPER India home">
      <img className="logo-image" src="/assets/tramper-logo.png" alt="TRAMPER India — Go Somewhere New" />
    </Link>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    return packages
      .filter((item) =>
        [item.name, item.destination, item.category].some((value) =>
          value.toLowerCase().includes(query.toLowerCase()),
        ),
      )
      .slice(0, 4)
  }, [query])

  function submitSearch(event) {
    event.preventDefault()
    navigate(`/packages${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ''}`)
    setMenuOpen(false)
  }

  return (
    <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
      <div className="header-inner container">
        <Logo />
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <Link className="mobile-enquire" to="/contact" onClick={() => setMenuOpen(false)}>
            Enquire now
          </Link>
        </nav>
        <div className="header-actions">
          <div className={searchOpen ? 'search-wrap is-open' : 'search-wrap'}>
            <form onSubmit={submitSearch} role="search">
              <Search size={17} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search journeys"
                aria-label="Search destinations and packages"
              />
            </form>
            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((item) => (
                  <Link key={item.id} to={`/packages/${item.slug}`} onClick={() => setSearchOpen(false)}>
                    <span>{item.name}</span>
                    <small>{item.destination}</small>
                  </Link>
                ))}
              </div>
            )}
            {query.trim() && suggestions.length === 0 && (
              <div className="search-suggestions search-empty" role="status">
                No matching journeys found
              </div>
            )}
          </div>
          <button className="icon-button mobile-search" onClick={() => setSearchOpen((value) => !value)} aria-label="Toggle search">
            <Search size={20} />
          </button>
          <a
            className="icon-button whatsapp-button"
            href="https://wa.me/"
            onClick={(event) => event.preventDefault()}
            aria-label="WhatsApp TRAMPER"
          >
            <MessageCircle size={19} />
          </a>
          <Link className="button button-small header-cta" to="/contact">Enquire now <ArrowRight size={16} /></Link>
          <button className="icon-button menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  )
}

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  )
}

function Hero() {
  const heroRef = useRef(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.hero .eyebrow', { y: 18, opacity: 0, duration: 0.55 })
      .from('.hero h1', { y: 36, opacity: 0, duration: 0.75 }, '-=0.28')
      .from('.hero-content p', { y: 20, opacity: 0, duration: 0.55 }, '-=0.38')
      .from('.hero-actions', { y: 16, opacity: 0, duration: 0.55 }, '-=0.34')
      .from('.hero-scroll', { opacity: 0, duration: 0.5 }, '-=0.15')

    gsap.to('.hero-poster, .hero-video', {
      yPercent: 8,
      scale: 1.04,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, { scope: heroRef })

  return (
    <section className="hero" ref={heroRef}>
      <img className="hero-poster" src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2200&q=85" alt="" />
      <video className="hero-video" autoPlay muted loop playsInline poster="/media/tramper-hero-poster.jpg" aria-hidden="true">
        <source src="/media/tramper-hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-content container">
        <span className="eyebrow light">TRAMPER INDIA / CURATED JOURNEYS</span>
        <h1>Go somewhere<br /><em>new.</em></h1>
        <p>Discover extraordinary destinations, unforgettable journeys and adventures worth remembering.</p>
        <div className="hero-actions">
          <Link className="button" to="/packages">Explore packages <ArrowRight size={17} /></Link>
          <Link className="text-link light-link" to="/about">About TRAMPER <ArrowRight size={17} /></Link>
        </div>
      </div>
      <div className="hero-scroll"><span>Scroll to explore</span><ChevronDown size={18} /></div>
    </section>
  )
}

function PackageCard({ item }) {
  return (
    <article className="package-card">
      <div className="card-image"><img src={item.image} alt={`${item.name} in ${item.destination}`} loading="lazy" /><span>{item.category}</span></div>
      <div className="card-body">
        <div className="card-meta"><span>{item.destination}</span><span>{item.durationDays} days / {item.durationNights} nights</span></div>
        <h3>{item.name}</h3>
        <div className="card-footer"><strong>From {item.startingPrice}</strong><Link to={`/packages/${item.slug}`} aria-label={`View ${item.name} details`}>View details <ArrowRight size={15} /></Link></div>
      </div>
    </article>
  )
}

function FeaturedPackages() {
  const featured = packages.filter((item) => item.published && item.featured)
  return <section className="section section-cream"><div className="container"><SectionHeading eyebrow="THE TRAMPER EDIT" title="Explore our featured adventures" copy="Development placeholder itineraries, ready to be replaced with approved TRAMPER journeys." /><div className="package-grid">{featured.map((item) => <PackageCard key={item.id} item={item} />)}</div><div className="section-link"><Link className="text-link" to="/packages">View all packages <ArrowRight size={17} /></Link></div></div></section>
}

const benefits = [
  [Compass, 'Handpicked destinations', 'Thoughtful routes that lead beyond the obvious.'],
  [Sparkles, 'Personalised itineraries', 'Journeys shaped around the way you want to travel.'],
  [ShieldCheck, 'Travel assistance', 'A considered helping hand, whenever you need it.'],
  [HeartHandshake, 'Memorable experiences', 'The little details that stay with you long after.'],
]

function Benefits() {
  return <section className="section benefits-section"><div className="container"><SectionHeading eyebrow="WHY TRAMPER" title="Why Travel With TRAMPER?" copy="Placeholder brand claims for client review. Every journey begins with a better way of seeing the world." /><div className="benefit-grid">{benefits.map(([Icon, title, copy]) => <article className="benefit-card" key={title}><span className="benefit-icon"><Icon size={25} strokeWidth={1.7} /></span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
}

function Destinations() {
  return <section className="section destinations-section"><div className="container"><SectionHeading eyebrow="FIND YOUR HORIZON" title="Where will you go next?" /><div className="destination-grid">{destinations.map((item) => <Link className="destination-card" to={`/packages?destination=${encodeURIComponent(item.name)}`} key={item.id}><img src={item.image} alt={item.name} loading="lazy" /><div><span>{item.region}</span><h3>{item.name}</h3><p>{item.tagline}</p></div></Link>)}</div></div></section>
}

function AboutPreview() {
  return <section className="section section-cream"><div className="container about-preview"><div className="about-image"><img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=85" alt="Travellers walking through a mountain landscape" loading="lazy" /><span className="about-image-label">Journey beyond the ordinary</span></div><div className="about-copy"><SectionHeading eyebrow="THE TRAMPER WAY" title="More Than Just Travel" copy="TRAMPER India is a placeholder for a considered travel company helping curious people find their next perspective. Official company information will be added here." /><ul className="about-highlights"><li>Thoughtfully planned journeys</li><li>Curiosity-led local experiences</li><li>Personal assistance throughout</li></ul><Link className="button button-dark" to="/about">Learn more <ArrowRight size={17} /></Link></div></div></section>
}

function Gallery() {
  return <section className="section gallery-section"><div className="container"><SectionHeading eyebrow="FIELD NOTES" title="Moments Worth Exploring" /><div className="gallery-rows"><div className="gallery-row gallery-row-one">{galleryImages.slice(0, 3).map((image) => <figure key={image.id}><img src={image.src} alt={image.alt} loading="lazy" /></figure>)}</div><div className="gallery-row gallery-row-two">{galleryImages.slice(3, 6).map((image) => <figure key={image.id}><img src={image.src} alt={image.alt} loading="lazy" /></figure>)}</div></div><div className="section-link"><Link className="text-link" to="/gallery">Visit the gallery <ArrowRight size={17} /></Link></div></div></section>
}

function Testimonials() {
  return <section className="section testimonials-section"><div className="container"><SectionHeading eyebrow="TRAVELLER STORIES" title="Stories From Our Travellers" copy="Sample placeholder reviews for development only. Approved testimonials will replace these in a later phase." /><div className="testimonial-grid">{testimonials.map((item) => <article className="testimonial" key={item.id}><div className="testimonial-rating"><div className="stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div><span>Placeholder</span></div><blockquote>“{item.quote}”</blockquote><div className="traveller"><span className="traveller-avatar" aria-hidden="true">{item.name.charAt(0)}</span><p>{item.name}<span>{item.trip}</span></p></div></article>)}</div></div></section>
}

function Enquiry() {
  return <section className="enquiry-section"><div className="enquiry-image" /><div className="container enquiry-content"><span className="eyebrow light">YOUR NEXT CHAPTER</span><h2>Your next adventure<br /><em>starts here.</em></h2><p>Tell us where you want to go. This demonstration form is not connected to an enquiry service yet.</p><div className="hero-actions"><Link className="button" to="/contact">Enquire now <ArrowRight size={17} /></Link><a className="text-link light-link" href="https://wa.me/" onClick={(event) => event.preventDefault()}>WhatsApp us <ArrowRight size={17} /></a></div></div></section>
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Logo /><p className="footer-tagline">{company.tagline}</p></div><div><h3>Explore</h3>{navItems.slice(0, 4).map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}</div><div><h3>Contact</h3><span>{company.email}</span><span>{company.phone}</span><span>{company.address}</span></div><div><h3>Stay curious</h3><p>Official social links will be added when supplied by the TRAMPER team.</p></div></div><div className="container footer-bottom"><span>© {currentYear} TRAMPER India. Placeholder content for development.</span><span><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></span></div></footer>
}

function Home() {
  return <><Header /><main><Hero /><FeaturedPackages /><Benefits /><Destinations /><AboutPreview /><Gallery /><Testimonials /><Enquiry /></main><Footer /></>
}

function StarterPage({ title, eyebrow, copy }) {
  return <><Header /><main className="starter-page container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p><Link className="button" to="/">Back home <ArrowRight size={17} /></Link></main><Footer /></>
}

function PackagesPage() { return <StarterPage eyebrow="TRAMPER COLLECTION" title="Packages" copy="Package listing and filters will be expanded in the next phase. Explore the featured journeys from the homepage for now." /> }
function PackageDetailsPage() { return <StarterPage eyebrow="YOUR NEXT JOURNEY" title="Package details" copy="This starter route is ready for dynamic package detail content." /> }

function App() {
  return <BrowserRouter><Routes><Route path="/" element={<Home />} /><Route path="/packages" element={<PackagesPage />} /><Route path="/packages/:slug" element={<PackageDetailsPage />} /><Route path="/about" element={<StarterPage eyebrow="OUR STORY" title="About TRAMPER" copy="Official company story and values will be added here." />} /><Route path="/gallery" element={<StarterPage eyebrow="FIELD NOTES" title="Gallery" copy="A full gallery experience will be added here." />} /><Route path="/contact" element={<StarterPage eyebrow="LET'S TALK" title="Contact us" copy="The enquiry form will be connected to a real service in a later phase." />} /><Route path="/privacy" element={<StarterPage eyebrow="TRAMPER INDIA" title="Privacy policy" copy="Policy content will be supplied before launch." />} /><Route path="/terms" element={<StarterPage eyebrow="TRAMPER INDIA" title="Terms and conditions" copy="Terms content will be supplied before launch." />} /><Route path="*" element={<StarterPage eyebrow="404" title="That trail ends here" copy="The page you are looking for could not be found." />} /></Routes></BrowserRouter>
}

export default App
