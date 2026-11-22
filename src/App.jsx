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
import AdminApp from './admin/AdminApp'
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
  const sectionRef = useRef(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from(sectionRef.current.querySelector('.section-heading'), {
      y: 24, opacity: 0, duration: 0.7,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
    })
    gsap.from(sectionRef.current.querySelectorAll('.swiper-slide'), {
      y: 30, opacity: 0, duration: 0.65, stagger: 0.12,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 76%', once: true },
    })
  }, { scope: sectionRef, dependencies: [featured.length] })

  return (
    <section className="section section-cream featured-section" ref={sectionRef}>
      <div className="container">
        <SectionHeading eyebrow="THE TRAMPER EDIT" title="Explore our featured adventures" copy="Development placeholder itineraries, ready to be replaced with approved TRAMPER journeys." />
        {featured.length > 0 ? (
          <>
            <Swiper
              className="package-swiper"
              modules={[Navigation, Pagination, A11y, Keyboard]}
              spaceBetween={18}
              slidesPerView={1.08}
              navigation={{ nextEl: '.package-next', prevEl: '.package-prev' }}
              pagination={{ clickable: true, el: '.package-pagination' }}
              keyboard={{ enabled: true }}
              breakpoints={{ 681: { slidesPerView: 2 }, 1024: { slidesPerView: 3.25 }, 1280: { slidesPerView: 3.75 } }}
              a11y={{ enabled: true }}
            >
              {featured.map((item) => <SwiperSlide key={item.id}><PackageCard item={item} /></SwiperSlide>)}
            </Swiper>
            <div className="carousel-controls package-controls">
              <div className="package-pagination" />
              {featured.length > 1 && <div className="carousel-arrows"><button className="carousel-arrow package-prev" aria-label="Previous featured packages"><ChevronLeft size={18} /></button><button className="carousel-arrow package-next" aria-label="Next featured packages"><ChevronRight size={18} /></button></div>}
            </div>
          </>
        ) : <p className="empty-content" role="status">No featured journeys are currently published.</p>}
        <div className="section-link"><Link className="text-link" to="/packages">View all packages <ArrowRight size={17} /></Link></div>
      </div>
    </section>
  )
}

const benefits = [
  [Compass, 'Handpicked destinations', 'Thoughtful routes that lead beyond the obvious.'],
  [Sparkles, 'Personalised itineraries', 'Journeys shaped around the way you want to travel.'],
  [ShieldCheck, 'Travel assistance', 'A considered helping hand, whenever you need it.'],
  [HeartHandshake, 'Memorable experiences', 'The little details that stay with you long after.'],
]

function Benefits() {
  const sectionRef = useRef(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from(sectionRef.current.querySelector('.section-heading'), {
      y: 24, opacity: 0, duration: 0.7,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
    })
    gsap.from(sectionRef.current.querySelectorAll('.benefit-card'), {
      y: 28, opacity: 0, duration: 0.65, stagger: 0.12,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
    })
  }, { scope: sectionRef })

  return <section className="section benefits-section" ref={sectionRef}><div className="container"><SectionHeading eyebrow="WHY TRAMPER" title="Why Travel With TRAMPER?" copy="Placeholder brand claims for client review. Every journey begins with a better way of seeing the world." /><div className="benefit-grid">{benefits.map(([Icon, title, copy]) => <article className="benefit-card" key={title}><span className="benefit-icon"><Icon size={25} strokeWidth={1.7} /></span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
}

function Destinations() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 1024px)').matches
    if (reduced || mobile) return

    const build = () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.id === 'destination-pin') trigger.kill()
      })
      const track = trackRef.current
      if (!track) return
      const available = track.scrollWidth - window.innerWidth
      if (available <= 8) return
      gsap.to(track, {
        x: -available,
        ease: 'none',
        scrollTrigger: {
          id: 'destination-pin',
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth + 180}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
    }

    const frame = requestAnimationFrame(build)
    const refresh = () => requestAnimationFrame(build)
    window.addEventListener('resize', refresh)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', refresh)
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.id === 'destination-pin') trigger.kill()
      })
    }
  }, { scope: sectionRef, dependencies: [destinations.length] })

  return (
    <section className="section destinations-section" ref={sectionRef}>
      <div className="destination-heading-wrap"><div className="container"><SectionHeading eyebrow="FIND YOUR HORIZON" title="Where will you go next?" /></div></div>
      <div className="destination-mobile">
        <Swiper modules={[Navigation, Pagination, A11y, Keyboard]} slidesPerView={1.08} spaceBetween={12} navigation={{ nextEl: '.destination-next', prevEl: '.destination-prev' }} pagination={{ clickable: true, el: '.destination-pagination' }} keyboard={{ enabled: true }}>
          {destinations.map((item) => (
            <SwiperSlide key={item.id}>
              <Link className="destination-card" to={`/packages?destination=${encodeURIComponent(item.name)}`}><img src={item.image} alt={item.name} loading="lazy" /><div><span>{item.region}</span><h3>{item.name}</h3><p>{item.tagline}</p></div></Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="carousel-controls destination-controls"><div className="destination-pagination" /><div className="carousel-arrows"><button className="carousel-arrow destination-prev" aria-label="Previous destination"><ChevronLeft size={18} /></button><button className="carousel-arrow destination-next" aria-label="Next destination"><ChevronRight size={18} /></button></div></div>
      </div>
      <div className="destination-desktop"><div className="destination-track" ref={trackRef}>{destinations.map((item) => <Link className="destination-card" to={`/packages?destination=${encodeURIComponent(item.name)}`} key={item.id}><img src={item.image} alt={item.name} loading="lazy" /><div><span>{item.region}</span><h3>{item.name}</h3><p>{item.tagline}</p></div></Link>)}</div></div>
    </section>
  )
}

function AboutPreview() {
  const sectionRef = useRef(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from(sectionRef.current.querySelector('.about-image'), {
      x: -30, opacity: 0, duration: 0.8,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
    })
    gsap.from(sectionRef.current.querySelectorAll('.about-copy .section-heading, .about-highlights li, .about-copy .button'), {
      y: 22, opacity: 0, duration: 0.6, stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
    })
    if (!window.matchMedia('(max-width: 680px)').matches) {
      gsap.to(sectionRef.current.querySelector('.about-image img'), {
        yPercent: -5, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }
  }, { scope: sectionRef })

  return <section className="section section-cream" ref={sectionRef}><div className="container about-preview"><div className="about-image"><img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=85" alt="Travellers walking through a mountain landscape" loading="lazy" /><span className="about-image-label">Journey beyond the ordinary</span></div><div className="about-copy"><SectionHeading eyebrow="THE TRAMPER WAY" title="More Than Just Travel" copy="TRAMPER India is a placeholder for a considered travel company helping curious people find their next perspective. Official company information will be added here." /><ul className="about-highlights"><li>Thoughtfully planned journeys</li><li>Curiosity-led local experiences</li><li>Personal assistance throughout</li></ul><Link className="button button-dark" to="/about">Learn more <ArrowRight size={17} /></Link></div></div></section>
}

function Gallery() {
  const [paused, setPaused] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const closeButtonRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    if (lightboxIndex === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLightboxIndex(null)
      if (event.key === 'ArrowRight') setLightboxIndex((index) => (index + 1) % galleryImages.length)
      if (event.key === 'ArrowLeft') setLightboxIndex((index) => (index - 1 + galleryImages.length) % galleryImages.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxIndex])

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from(sectionRef.current.querySelector('.section-heading'), {
      y: 24, opacity: 0, duration: 0.7,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
    })
  }, { scope: sectionRef })

  const rowOne = [...galleryImages, ...galleryImages]
  const rowTwo = [...galleryImages].reverse()
  const doubledRowTwo = [...rowTwo, ...rowTwo]

  return (
    <section className="section gallery-section" ref={sectionRef}>
      <div className="container">
        <div className="gallery-heading-row"><SectionHeading eyebrow="FIELD NOTES" title="Moments Worth Exploring" /><button className="gallery-toggle" type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? <Play size={16} /> : <Pause size={16} />}{paused ? 'Play gallery' : 'Pause gallery'}</button></div>
        <div className={paused ? 'moving-gallery is-paused' : 'moving-gallery'}>
          <div className="moving-row moving-row-one">{rowOne.map((image, index) => <button type="button" key={`row-one-${image.id}-${index}`} onClick={() => setLightboxIndex(index % galleryImages.length)} aria-label={`Open ${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" /></button>)}</div>
          <div className="moving-row moving-row-two">{doubledRowTwo.map((image, index) => <button type="button" key={`row-two-${image.id}-${index}`} onClick={() => setLightboxIndex(galleryImages.findIndex((item) => item.id === image.id))} aria-label={`Open ${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" /></button>)}</div>
        </div>
        <div className="section-link"><Link className="text-link" to="/gallery">Visit the gallery <ArrowRight size={17} /></Link></div>
      </div>
      {lightboxIndex !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Travel image viewer"><button className="lightbox-backdrop" aria-label="Close image viewer" onClick={() => setLightboxIndex(null)} /><button ref={closeButtonRef} className="lightbox-close" type="button" onClick={() => setLightboxIndex(null)} aria-label="Close"><X size={22} /></button><button className="lightbox-arrow lightbox-prev" type="button" onClick={() => setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length)} aria-label="Previous image"><ChevronLeft size={24} /></button><img src={galleryImages[lightboxIndex].src} alt={galleryImages[lightboxIndex].alt} /><button className="lightbox-arrow lightbox-next" type="button" onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryImages.length)} aria-label="Next image"><ChevronRight size={24} /></button></div>}
    </section>
  )
}

function Testimonials() {
  const sectionRef = useRef(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from(sectionRef.current.querySelectorAll('.testimonial-heading, .testimonial-swiper'), {
      y: 24, opacity: 0, duration: 0.7, stagger: 0.12,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
    })
  }, { scope: sectionRef })

  if (testimonials.length === 0) return null

  return (
    <section className="section testimonials-section" ref={sectionRef}>
      <div className="container">
        <div className="testimonial-heading"><SectionHeading eyebrow="TRAVELLER STORIES" title="Stories From Our Travellers" copy="Sample placeholder reviews for development only. Approved testimonials will replace these in a later phase." /></div>
        <Swiper className="testimonial-swiper" modules={[Navigation, Pagination, A11y, Keyboard]} slidesPerView={1} spaceBetween={18} navigation={{ nextEl: '.testimonial-next', prevEl: '.testimonial-prev' }} pagination={{ clickable: true, el: '.testimonial-pagination' }} keyboard={{ enabled: true }} breakpoints={{ 681: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
          {testimonials.map((item) => <SwiperSlide key={item.id}><article className="testimonial"><div className="testimonial-rating"><div className="stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div><span>Placeholder</span></div><blockquote>“{item.quote}”</blockquote><div className="traveller"><span className="traveller-avatar" aria-hidden="true">{item.name.charAt(0)}</span><p>{item.name}<span>{item.trip}</span></p></div></article></SwiperSlide>)}
        </Swiper>
        <div className="carousel-controls testimonial-controls"><div className="testimonial-pagination" /><div className="carousel-arrows"><button className="carousel-arrow testimonial-prev" aria-label="Previous testimonial"><ChevronLeft size={18} /></button><button className="carousel-arrow testimonial-next" aria-label="Next testimonial"><ChevronRight size={18} /></button></div></div>
      </div>
    </section>
  )
}

function Enquiry() {
  const sectionRef = useRef(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from(sectionRef.current.querySelectorAll('.enquiry-content > *'), {
      y: 24, opacity: 0, duration: 0.65, stagger: 0.11,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
    })
  }, { scope: sectionRef })

  return <section className="enquiry-section" ref={sectionRef}><div className="enquiry-image" /><div className="container enquiry-content"><span className="eyebrow light">YOUR NEXT CHAPTER</span><h2>Your next adventure<br /><em>starts here.</em></h2><p>Tell us where you want to go. This demonstration form is not connected to an enquiry service yet.</p><div className="hero-actions"><Link className="button" to="/contact">Enquire now <ArrowRight size={17} /></Link><a className="text-link light-link" href="https://wa.me/" onClick={(event) => event.preventDefault()}>WhatsApp us <ArrowRight size={17} /></a></div></div></section>
}

function Footer() {
  const footerRef = useRef(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from(footerRef.current.querySelectorAll('.footer-grid > *, .footer-bottom'), {
      y: 18, opacity: 0, duration: 0.55, stagger: 0.06,
      scrollTrigger: { trigger: footerRef.current, start: 'top 88%', once: true },
    })
  }, { scope: footerRef })

  return <footer className="site-footer" ref={footerRef}><div className="container footer-grid"><div><Logo /><p className="footer-tagline">{company.tagline}</p></div><div><h3>Explore</h3>{navItems.slice(0, 4).map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}</div><div><h3>Contact</h3><span>{company.email}</span><span>{company.phone}</span><span>{company.address}</span></div><div><h3>Stay curious</h3><p>Official social links will be added when supplied by the TRAMPER team.</p></div></div><div className="container footer-bottom"><span>© {currentYear} TRAMPER India. Placeholder content for development.</span><span><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></span></div></footer>
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
  return <BrowserRouter><Routes>
    <Route path="/admin/*" element={<AdminApp />} />
    <Route path="/" element={<Home />} />
    <Route path="/packages" element={<PackagesPage />} />
    <Route path="/packages/:slug" element={<PackageDetailsPage />} />
    <Route path="/about" element={<StarterPage eyebrow="OUR STORY" title="About TRAMPER" copy="Official company story and values will be added here." />} />
    <Route path="/gallery" element={<StarterPage eyebrow="FIELD NOTES" title="Gallery" copy="A full gallery experience will be added here." />} />
    <Route path="/contact" element={<StarterPage eyebrow="LET'S TALK" title="Contact us" copy="The enquiry form will be connected to a real service in a later phase." />} />
    <Route path="/privacy" element={<StarterPage eyebrow="TRAMPER INDIA" title="Privacy policy" copy="Policy content will be supplied before launch." />} />
    <Route path="/terms" element={<StarterPage eyebrow="TRAMPER INDIA" title="Terms and conditions" copy="Terms content will be supplied before launch." />} />
    <Route path="*" element={<StarterPage eyebrow="404" title="That trail ends here" copy="The page you are looking for could not be found." />} />
  </Routes></BrowserRouter>
}

export default App
