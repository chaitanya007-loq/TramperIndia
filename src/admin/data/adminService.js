import { packages as seedPackages } from '../../data/packages'
import { destinations as seedDestinations } from '../../data/destinations'
import { galleryImages as seedMedia } from '../../data/gallery'
import { company as seedCompany } from '../../data/company'

const STORAGE = {
  packages: 'tramper-admin-packages',
  destinations: 'tramper-admin-destinations',
  media: 'tramper-admin-media',
  settings: 'tramper-admin-settings',
  session: 'tramper-admin-demo-session',
}

const clone = (value) => JSON.parse(JSON.stringify(value))

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : clone(fallback)
  } catch {
    return clone(fallback)
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  return clone(value)
}

const normalizedPackages = seedPackages.map((item) => ({
  ...item,
  status: item.published ? 'Published' : 'Draft',
  archived: false,
  price: item.startingPrice === '₹—' ? '' : item.startingPrice,
  priceBasis: 'Per person',
  detailedDescription: item.shortDescription,
  itinerary: [{ day: 1, title: 'Arrival and orientation', description: 'Add the first day itinerary details.' }],
  gallery: [item.image],
  inclusions: ['Accommodation', 'Local assistance'],
  exclusions: ['Personal expenses'],
  notes: ['Development placeholder details.'],
  pricingTerms: 'Final terms to be confirmed.',
  updatedAt: '2026-11-22',
}))

export function getPackages() { return read(STORAGE.packages, normalizedPackages) }
export function getPackageById(id) { return getPackages().find((item) => item.id === id || item.slug === id) || null }
export function createPackage(input) {
  const items = getPackages()
  const id = `pkg-${Date.now()}`
  const item = { ...input, id, slug: input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), archived: false, updatedAt: new Date().toISOString().slice(0, 10) }
  write(STORAGE.packages, [...items, item])
  return item
}
export function updatePackage(id, input) {
  const items = getPackages()
  const updated = items.map((item) => item.id === id ? { ...item, ...input, updatedAt: new Date().toISOString().slice(0, 10) } : item)
  write(STORAGE.packages, updated)
  return updated.find((item) => item.id === id)
}
export function archivePackage(id) {
  const items = getPackages()
  const updated = items.map((item) => item.id === id ? { ...item, archived: true, updatedAt: new Date().toISOString().slice(0, 10) } : item)
  write(STORAGE.packages, updated)
  return updated.find((item) => item.id === id)
}

const normalizedDestinations = seedDestinations.map((item, index) => ({
  ...item,
  description: item.tagline,
  popular: true,
  published: true,
  order: index + 1,
}))
export function getDestinations() { return read(STORAGE.destinations, normalizedDestinations) }
export function createDestination(input) {
  const items = getDestinations()
  if (items.some((item) => item.name.toLowerCase() === input.name.toLowerCase())) throw new Error('A destination with this name already exists.')
  const item = { ...input, id: `dest-${Date.now()}`, order: Number(input.order) || items.length + 1 }
  write(STORAGE.destinations, [...items, item])
  return item
}
export function updateDestination(id, input) {
  const items = getDestinations()
  if (items.some((item) => item.id !== id && item.name.toLowerCase() === input.name.toLowerCase())) throw new Error('A destination with this name already exists.')
  const updated = items.map((item) => item.id === id ? { ...item, ...input, order: Number(input.order) || item.order } : item)
  write(STORAGE.destinations, updated)
  return updated.find((item) => item.id === id)
}

export function getMedia() { return read(STORAGE.media, seedMedia) }
export function addTemporaryMedia(item) {
  const items = getMedia()
  const record = { ...item, id: `media-${Date.now()}`, temporary: true }
  write(STORAGE.media, [record, ...items])
  return record
}
export function removeMedia(id) { write(STORAGE.media, getMedia().filter((item) => item.id !== id)); return true }

export function getSettings() {
  return read(STORAGE.settings, {
    companyName: seedCompany.name,
    logo: '/assets/tramper-logo.png',
    phone: '',
    email: 'hello@example.com',
    whatsapp: '',
    instagram: '',
    facebook: '',
    youtube: '',
  })
}
export function updateSettings(input) { return write(STORAGE.settings, input) }

export function demoLogin(email) {
  sessionStorage.setItem(STORAGE.session, JSON.stringify({ email: email || 'demo@tramper.in', demo: true }))
  return true
}
export function isDemoLoggedIn() { return !!sessionStorage.getItem(STORAGE.session) }
export function demoLogout() { sessionStorage.removeItem(STORAGE.session) }
