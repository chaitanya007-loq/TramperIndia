import { useState } from 'react'
import {
  Archive, ArrowLeft, ArrowRight, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Compass, Eye, LayoutDashboard, LockKeyhole, LogOut, Menu,
  Package, Plus, Search, Settings, Trash2, Upload, Image,
  X, GripVertical, Check, AlertCircle
} from 'lucide-react'
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import * as service from './data/adminService'
import './admin.css'

const tabs = ['Basic information', 'Itinerary', 'Images', 'Additional details', 'Preview & publish']

function DemoLogin() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (!email.trim() || !password) { setError('Enter a demo email and password.'); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      service.demoLogin(email)
      setLoading(false)
      navigate('/admin/dashboard')
    }, 500)
  }

  return (
    <main className="admin-login">
      <section className="login-card">
        <img src="/assets/tramper-logo.png" alt="TRAMPER India" />
        <div className="login-heading"><span>TRAMPER CMS</span><h1>Welcome back</h1><p>Manage journeys, destinations and media.</p></div>
        <form onSubmit={submit}>
          {error && <div className="form-error"><AlertCircle size={16} />{error}</div>}
          <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="demo@tramper.in" /></label>
          <label>Password<div className="password-field"><input type={show ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter any demo password" /><button type="button" onClick={() => setShow((value) => !value)}>{show ? 'Hide' : 'Show'}</button></div></label>
          <button className="admin-primary login-submit" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}<ArrowRight size={16} /></button>
        </form>
        <button className="demo-entry" type="button" onClick={() => { setEmail('demo@tramper.in'); setPassword('demo'); }}><LockKeyhole size={15} />Fill demo credentials</button>
        <p className="demo-disclaimer">Demo Mode only. This UI does not provide production authentication or security.</p>
      </section>
    </main>
  )
}

function RequireDemo({ children }) {
  return service.isDemoLoggedIn() ? children : <Navigate to="/admin/login" replace />
}

function AdminLayout({ children }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const nav = [
    ['dashboard', LayoutDashboard, 'Dashboard'],
    ['packages', Package, 'Packages'],
    ['destinations', Compass, 'Destinations'],
    ['media', Image, 'Media library'],
    ['settings', Settings, 'Settings'],
  ]
  function logout() { service.demoLogout(); navigate('/admin/login') }

  return (
    <div className="admin-shell">
      <aside className={open ? 'admin-sidebar is-open' : 'admin-sidebar'}>
        <div className="admin-brand"><img src="/assets/tramper-logo.png" alt="TRAMPER India" /><button type="button" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={20} /></button></div>
        <nav aria-label="Admin navigation">
          {nav.map(([slug, Icon, label]) => <NavLink key={slug} to={`/admin/${slug}`} onClick={() => setOpen(false)}><Icon size={18} /><span>{label}</span></NavLink>)}
        </nav>
        <div className="sidebar-footer"><button type="button" onClick={logout}><LogOut size={17} />Sign out</button></div>
      </aside>
      {open && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <div className="admin-main">
        <header className="admin-header"><button className="mobile-menu" type="button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="admin-search"><Search size={16} /><input placeholder="Search admin…" aria-label="Search admin" /></div><div className="admin-profile"><button type="button" aria-label="Help"><CircleHelp size={18} /></button><span className="avatar">TA</span><div><strong>Tramper Admin</strong><small>Demo account</small></div><ChevronDown size={15} /></div></header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}

function PageHeader({ title, subtitle, action }) {
  return <div className="page-header"><div><span className="page-kicker">TRAMPER CMS</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>
}

function Dashboard() {
  const packages = service.getPackages().filter((item) => !item.archived)
  const destinations = service.getDestinations()
  const stats = [
    ['Total packages', packages.length, Package, 'View packages', '/admin/packages'],
    ['Published', packages.filter((item) => item.status === 'Published').length, Eye, 'Manage', '/admin/packages'],
    ['Drafts', packages.filter((item) => item.status === 'Draft').length, Archive, 'Review drafts', '/admin/packages'],
    ['Destinations', destinations.length, Compass, 'Manage destinations', '/admin/destinations'],
    ['Featured', packages.filter((item) => item.featured).length, Image, 'View featured', '/admin/packages'],
  ]
  return (
    <><PageHeader title="Dashboard" subtitle="Overview of TRAMPER's customer-facing content." action={<Link className="admin-primary" to="/admin/packages/new"><Plus size={16} />Add package</Link>} />
      <div className="stats-grid">{stats.map(([label, value, Icon, linkText, href]) => <article className="stat-card" key={label}><div><span>{label}</span><strong>{value}</strong></div><span className="stat-icon"><Icon size={20} /></span><Link to={href}>{linkText}<ArrowRight size={14} /></Link></article>)}</div>
      <section className="admin-panel"><div className="panel-heading"><div><span>CONTENT</span><h2>Recently updated packages</h2></div><Link to="/admin/packages">View all<ArrowRight size={14} /></Link></div>
        <div className="recent-table">{packages.slice(0, 5).map((item) => <article key={item.id}><img src={item.image || item.gallery?.[0]} alt="" /><div><strong>{item.name}</strong><span>{item.destination} · {item.durationDays || '—'} days</span></div><span className={`status ${item.status?.toLowerCase()}`}>{item.status}</span><Link to={`/admin/packages/${item.id}/edit`}>Edit</Link></article>)}</div>
      </section>
    </>
  )
}

function PackagesPage() {
  const [query, setQuery] = useState('')
  const [destination, setDestination] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('name')
  const [, refresh] = useState(0)
  const destinations = service.getDestinations()
  let items = service.getPackages().filter((item) => !item.archived)
  items = items.filter((item) => [item.name, item.destination, item.category].join(' ').toLowerCase().includes(query.toLowerCase()))
  if (destination) items = items.filter((item) => item.destination === destination)
  if (status) items = items.filter((item) => item.status === status)
  if (category) items = items.filter((item) => item.category === category)
  items.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : String(b.updatedAt).localeCompare(String(a.updatedAt)))
  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))]

  function archive(item) {
    if (window.confirm(`Archive "${item.name}"? It will remain available for future restoration.`)) {
      service.archivePackage(item.id)
      refresh((value) => value + 1)
    }
  }

  return (
    <><PageHeader title="Packages" subtitle="Create, publish and organise travel packages." action={<Link className="admin-primary" to="/admin/packages/new"><Plus size={16} />Add package</Link>} />
      <section className="admin-panel">
        <div className="table-toolbar"><div className="table-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search packages…" /></div><select value={destination} onChange={(event) => setDestination(event.target.value)}><option value="">All destinations</option>{destinations.map((item) => <option key={item.id}>{item.name}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option>Published</option><option>Draft</option></select><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Sort: Name</option><option value="updated">Sort: Updated</option></select></div>
        {items.length ? <div className="package-table"><div className="package-table-head"><span>Package</span><span>Destination</span><span>Price</span><span>Duration</span><span>State</span><span>Actions</span></div>{items.map((item) => <article key={item.id}><div className="package-name"><img src={item.image || item.gallery?.[0]} alt="" /><div><strong>{item.name}</strong><small>{item.category}</small></div></div><span>{item.destination}</span><strong>{item.price || item.startingPrice || '₹—'}</strong><span>{item.durationDays || '—'} days</span><div className="package-state"><span className={`status ${item.status?.toLowerCase()}`}>{item.status}</span>{item.featured && <small>Featured</small>}</div><div className="row-actions"><Link to={`/packages/${item.slug}`} title="Preview" onClick={(event) => { event.preventDefault(); window.open(`/packages/${item.slug}`, '_blank') }}><Eye size={16} /></Link><Link to={`/admin/packages/${item.id}/edit`} title="Edit"><Settings size={16} /></Link><button type="button" onClick={() => archive(item)} title="Archive"><Archive size={16} /></button></div></article>)}</div> : <div className="empty-state"><Package size={30} /><h3>No packages found</h3><p>Try changing filters or add a new package.</p></div>}
      </section>
    </>
  )
}

function Field({ label, error, children, className = '' }) {
  return <label className={`admin-field ${className}`}><span>{label}</span>{children}{error && <small className="field-error">{error}</small>}</label>
}

function PackageForm() {
  const { id } = useParams()
  const existing = id ? service.getPackageById(id) : null
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [errors, setErrors] = useState({})
  const [dirty, setDirty] = useState(false)
  const [form, setForm] = useState(existing || {
    name: '', destination: '', category: '', shortDescription: '', detailedDescription: '',
    price: '', priceBasis: 'Per person', durationDays: '', durationNights: '',
    itinerary: [{ day: 1, title: '', description: '' }], image: '', gallery: [],
    inclusions: [''], exclusions: [''], notes: [''], pricingTerms: '',
    featured: false, status: 'Draft',
  })

  const destinations = service.getDestinations().filter((item) => item.published)
  function setValue(field, value) { setForm((current) => ({ ...current, [field]: value })); setDirty(true) }
  function setList(field, index, value) { setForm((current) => ({ ...current, [field]: current[field].map((item, itemIndex) => itemIndex === index ? value : item) })); setDirty(true) }
  function addList(field) { setForm((current) => ({ ...current, [field]: [...current[field], ''] })); setDirty(true) }
  function removeList(field, index) { setForm((current) => ({ ...current, [field]: current[field].filter((_, itemIndex) => itemIndex !== index) })); setDirty(true) }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Package name is required.'
    if (!form.destination) next.destination = 'Select a valid destination.'
    if (form.price !== '' && (!Number.isFinite(Number(form.price)) || Number(form.price) < 0)) next.price = 'Enter a non-negative price.'
    if (!Number(form.durationDays) || Number(form.durationDays) < 1) next.durationDays = 'Duration must be at least 1 day.'
    if (form.itinerary.some((day) => !day.title.trim() || !day.description.trim())) next.itinerary = 'Every itinerary day needs a title and description.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function save() {
    if (!validate()) { setActiveTab(errors.name || errors.destination || errors.price || errors.durationDays ? 0 : 1); return }
    const payload = { ...form, startingPrice: form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : '₹—', published: form.status === 'Published' }
    if (existing) service.updatePackage(existing.id, payload)
    else service.createPackage(payload)
    setDirty(false)
    navigate('/admin/packages')
  }

  function handleLeave(next) {
    if (dirty && next === '/admin/packages') {
      if (!window.confirm('Discard unsaved changes?')) return false
    }
    return true
  }

  function chooseCover(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setErrors((current) => ({ ...current, cover: 'Use JPG, PNG or WebP images.' })); return }
    if (file.size > 5 * 1024 * 1024) { setErrors((current) => ({ ...current, cover: 'Choose an image smaller than 5 MB.' })); return }
    setValue('image', URL.createObjectURL(file))
  }

  function chooseGallery(event) {
    const files = [...(event.target.files || [])].filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 5 * 1024 * 1024)
    setValue('gallery', [...(form.gallery || []), ...files.map((file) => URL.createObjectURL(file))])
  }

  return (
    <><div className="form-titlebar"><Link to="/admin/packages" onClick={(event) => { if (!handleLeave('/admin/packages')) event.preventDefault() }}><ChevronLeft size={17} />Packages</Link><div><button type="button" className="admin-secondary" onClick={() => { if (handleLeave('/admin/packages')) navigate('/admin/packages') }}>Cancel</button><button type="button" className="admin-primary" onClick={save}>Save package</button></div></div>
      <PageHeader title={existing ? 'Edit package' : 'Add package'} subtitle="Demo package editor" />
      <div className="package-form-layout"><aside className="form-tabs">{tabs.map((tab, index) => <button type="button" key={tab} className={activeTab === index ? 'active' : ''} onClick={() => setActiveTab(index)}><span>{index + 1}</span>{tab}{index < activeTab && <Check size={15} />}</button>)}</aside>
        <section className="package-form-panel">
          {activeTab === 0 && <div className="form-section"><div className="form-section-heading"><span>01</span><div><h2>Basic information</h2><p>Core details shown in package listings.</p></div></div><div className="form-grid"><Field label="Package name" error={errors.name} className="span-2"><input value={form.name} onChange={(event) => setValue('name', event.target.value)} placeholder="e.g. Kashmir, Slowly" /></Field><Field label="Destination" error={errors.destination}><select value={form.destination} onChange={(event) => setValue('destination', event.target.value)}><option value="">Select destination</option>{destinations.map((item) => <option key={item.id}>{item.name}</option>)}</select></Field><Field label="Category"><input value={form.category} onChange={(event) => setValue('category', event.target.value)} placeholder="Mountains" /></Field><Field label="Starting price" error={errors.price}><input type="number" min="0" value={form.price} onChange={(event) => setValue('price', event.target.value)} placeholder="25000" /></Field><Field label="Price basis"><select value={form.priceBasis} onChange={(event) => setValue('priceBasis', event.target.value)}><option>Per person</option><option>Per couple</option><option>Per group</option></select></Field><Field label="Duration in days" error={errors.durationDays}><input type="number" min="1" value={form.durationDays} onChange={(event) => setValue('durationDays', event.target.value)} /></Field><Field label="Duration in nights"><input type="number" min="0" value={form.durationNights} onChange={(event) => setValue('durationNights', event.target.value)} /></Field><Field label="Short description" className="span-2"><textarea rows="3" maxLength="240" value={form.shortDescription || ''} onChange={(event) => setValue('shortDescription', event.target.value)} /></Field><Field label="Detailed description" className="span-2"><textarea rows="6" value={form.detailedDescription || ''} onChange={(event) => setValue('detailedDescription', event.target.value)} /></Field></div></div>}
          {activeTab === 1 && <div className="form-section"><div className="form-section-heading"><span>02</span><div><h2>Itinerary</h2><p>Add, reorder and describe each travel day.</p></div></div>{errors.itinerary && <div className="form-error"><AlertCircle size={16} />{errors.itinerary}</div>}<div className="itinerary-list">{form.itinerary.map((day, index) => <article key={index}><div className="day-number"><GripVertical size={16} /><span>Day {index + 1}</span></div><div className="day-fields"><input value={day.title} onChange={(event) => setForm((current) => ({ ...current, itinerary: current.itinerary.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) }))} placeholder="Day title" /><textarea rows="3" value={day.description} onChange={(event) => setForm((current) => ({ ...current, itinerary: current.itinerary.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) }))} placeholder="Describe this day" /></div><div className="day-actions"><button type="button" disabled={index === 0} onClick={() => setForm((current) => { const itinerary = [...current.itinerary]; [itinerary[index - 1], itinerary[index]] = [itinerary[index], itinerary[index - 1]]; return { ...current, itinerary: itinerary.map((item, itemIndex) => ({ ...item, day: itemIndex + 1 })) } })} aria-label="Move day up"><ChevronLeft size={16} /></button><button type="button" disabled={index === form.itinerary.length - 1} onClick={() => setForm((current) => { const itinerary = [...current.itinerary]; [itinerary[index + 1], itinerary[index]] = [itinerary[index], itinerary[index + 1]]; return { ...current, itinerary: itinerary.map((item, itemIndex) => ({ ...item, day: itemIndex + 1 })) } })} aria-label="Move day down"><ChevronRight size={16} /></button><button type="button" onClick={() => setForm((current) => ({ ...current, itinerary: current.itinerary.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, day: itemIndex + 1 })) }))} aria-label="Remove day"><Trash2 size={16} /></button></div></article>)}</div><button type="button" className="admin-secondary" onClick={() => setForm((current) => ({ ...current, itinerary: [...current.itinerary, { day: current.itinerary.length + 1, title: '', description: '' }] }))}><Plus size={16} />Add day</button></div>}
          {activeTab === 2 && <div className="form-section"><div className="form-section-heading"><span>03</span><div><h2>Images</h2><p>Temporary previews are not stored as large files.</p></div></div><div className="image-editor"><Field label="Cover image"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseCover} />{errors.cover && <small className="field-error">{errors.cover}</small>}<div className="cover-preview">{form.image ? <img src={form.image} alt="Package cover preview" /> : <div><Upload size={24} /><span>Select cover image</span></div>}</div></Field><Field label="Gallery images"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={chooseGallery} /><div className="gallery-preview">{(form.gallery || []).map((source, index) => <div key={`${source}-${index}`}><img src={source} alt={`Gallery preview ${index + 1}`} /><button type="button" onClick={() => setValue('gallery', form.gallery.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={14} /></button></div>)}</div></Field></div></div>}
          {activeTab === 3 && <div className="form-section"><div className="form-section-heading"><span>04</span><div><h2>Additional details</h2><p>Clarify inclusions, exclusions and terms.</p></div></div><div className="detail-lists">{[['inclusions','Inclusions'],['exclusions','Exclusions'],['notes','Important travel notes']].map(([field, label]) => <section key={field}><h3>{label}</h3>{form[field].map((item, index) => <div className="list-editor" key={index}><input value={item} onChange={(event) => setList(field, index, event.target.value)} /><button type="button" onClick={() => removeList(field, index)}><Trash2 size={15} /></button></div>)}<button type="button" className="add-inline" onClick={() => addList(field)}><Plus size={14} />Add item</button></section>)}</div><Field label="Pricing terms" className="pricing-field"><textarea rows="5" value={form.pricingTerms || ''} onChange={(event) => setValue('pricingTerms', event.target.value)} /></Field></div>}
          {activeTab === 4 && <div className="form-section"><div className="form-section-heading"><span>05</span><div><h2>Preview & publish</h2><p>Review the package and choose its demo status.</p></div></div><div className="package-preview"><img src={form.image || form.gallery?.[0]} alt="" /><div><span>{form.destination || 'Destination'}</span><h3>{form.name || 'Untitled package'}</h3><p>{form.shortDescription || 'Add a short description.'}</p><div><strong>{form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : '₹—'}</strong><small>{form.durationDays || '—'} days / {form.durationNights || '—'} nights</small></div></div></div><div className="publish-options"><label className="check-row"><input type="checkbox" checked={!!form.featured} onChange={(event) => setValue('featured', event.target.checked)} /><span><strong>Featured package</strong><small>Show this package in featured customer sections.</small></span></label><Field label="Publication status"><select value={form.status} onChange={(event) => setValue('status', event.target.value)}><option>Draft</option><option>Published</option></select></Field></div></div>}
          <div className="form-navigation"><button type="button" className="admin-secondary" disabled={activeTab === 0} onClick={() => setActiveTab((value) => value - 1)}><ChevronLeft size={16} />Back</button>{activeTab < 4 ? <button type="button" className="admin-primary" onClick={() => setActiveTab((value) => value + 1)}>Continue<ArrowRight size={16} /></button> : <button type="button" className="admin-primary" onClick={save}><Check size={16} />Save package</button>}</div>
        </section>
      </div>
    </>
  )
}

function DestinationsPage() {
  const [, refresh] = useState(0)
  const [editing, setEditing] = useState(null)
  const blank = { name: '', description: '', tagline: '', image: '', popular: true, published: true, order: 1 }
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')

  function open(item = null) { setEditing(item); setForm(item ? { ...item } : blank); setError('') }
  function save(event) {
    event.preventDefault()
    if (!form.name.trim()) { setError('Destination name is required.'); return }
    try {
      if (editing) service.updateDestination(editing.id, form)
      else service.createDestination(form)
      setEditing(null); setForm(blank); setError(''); refresh((value) => value + 1)
    } catch (exception) { setError(exception.message) }
  }
  const destinations = service.getDestinations().sort((a, b) => a.order - b.order)
  return (
    <><PageHeader title="Destinations" subtitle="Manage destination records and display order." action={<button className="admin-primary" type="button" onClick={() => open()}><Plus size={16} />Add destination</button>} />
      {editing !== null || editing === false ? null : null}
      <section className="admin-panel"><div className="destination-grid">{destinations.map((item) => <article key={item.id} className="destination-admin-card"><div className="destination-admin-image">{item.image ? <img src={item.image} alt="" /> : <Compass size={24} />}</div><div><span>{item.region || 'Travel destination'} · #{item.order}</span><h3>{item.name}</h3><p>{item.tagline}</p><div className="destination-badges"><small className={item.published ? 'published' : ''}>{item.published ? 'Published' : 'Draft'}</small>{item.popular && <small>Popular</small>}</div></div><button type="button" onClick={() => open(item)} aria-label={`Edit ${item.name}`}><Settings size={16} /></button></article>)}</div></section>
      {editing && <div className="admin-modal-backdrop"><section className="admin-modal" role="dialog" aria-modal="true"><div className="modal-heading"><div><span>DESTINATION</span><h2>{editing.id ? 'Edit destination' : 'Add destination'}</h2></div><button type="button" onClick={() => setEditing(null)}><X size={18} /></button></div><form onSubmit={save}>{error && <div className="form-error"><AlertCircle size={16} />{error}</div>}<div className="form-grid"><Field label="Destination name" className="span-2"><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></Field><Field label="Tagline" className="span-2"><input value={form.tagline} onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))} /></Field><Field label="Description" className="span-2"><textarea rows="4" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></Field><Field label="Cover image URL" className="span-2"><input value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} /></Field><Field label="Display order"><input type="number" min="1" value={form.order} onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))} /></Field><label className="check-row"><input type="checkbox" checked={form.popular} onChange={(event) => setForm((current) => ({ ...current, popular: event.target.checked }))} /><span>Popular destination</span></label><label className="check-row"><input type="checkbox" checked={form.published} onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))} /><span>Published</span></label></div><div className="modal-actions"><button type="button" className="admin-secondary" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="admin-primary">Save destination</button></div></form></section></div>}
      {editing === false && null}
      {editing === null && null}
    </>
  )
}

function MediaPage() {
  const [, refresh] = useState(0)
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')
  const media = service.getMedia().filter((item) => !filter || item.alt?.toLowerCase().includes(filter.toLowerCase()))
  function upload(event) {
    const files = [...(event.target.files || [])]
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Only JPG, PNG and WebP files are supported.'); continue }
      if (file.size > 5 * 1024 * 1024) { setError('Each temporary preview must be smaller than 5 MB.'); continue }
      service.addTemporaryMedia({ src: URL.createObjectURL(file), alt: file.name })
    }
    refresh((value) => value + 1)
  }
  function remove(item) {
    if (window.confirm(`Remove "${item.alt || 'this image'}" from the temporary library?`)) { service.removeMedia(item.id); refresh((value) => value + 1) }
  }
  return (
    <><PageHeader title="Media library" subtitle="Temporary preview library until media storage is connected." action={<label className="admin-primary file-action"><Upload size={16} />Select images<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={upload} /></label>} />
      {error && <div className="form-error"><AlertCircle size={16} />{error}</div>}<div className="media-toolbar"><div className="table-search"><Search size={16} /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter images…" /></div><span>Uploads are temporary browser previews.</span></div>
      {media.length ? <div className="media-grid">{media.map((item) => <article key={item.id}><img src={item.src} alt={item.alt} /><div><strong>{item.alt || 'Travel image'}</strong><button type="button" onClick={() => remove(item)}><Trash2 size={15} />Remove</button></div></article>)}</div> : <div className="empty-state"><Image size={30} /><h3>No media found</h3><p>Select temporary image previews to build the library.</p></div>}
    </>
  )
}

function SettingsPage() {
  const [form, setForm] = useState(service.getSettings())
  const [saved, setSaved] = useState(false)
  function save(event) { event.preventDefault(); setSaved(true); service.updateSettings(form); setTimeout(() => setSaved(false), 1800) }
  return (
    <><PageHeader title="Settings" subtitle="Manage demonstration company details." action={saved ? <span className="saved-indicator"><Check size={15} />Saved locally</span> : null} />
      <form className="settings-layout" onSubmit={save}><section className="admin-panel"><div className="panel-heading"><div><span>BRAND</span><h2>Company profile</h2></div></div><div className="settings-logo"><img src={form.logo} alt="TRAMPER logo" /><div><strong>Official TRAMPER logo</strong><p>Logo replacement is managed with a future media connection.</p></div></div><div className="form-grid"><Field label="Company name"><input value={form.companyName} onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} /></Field><Field label="Contact email"><input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></Field><Field label="Contact phone"><input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Demo contact only" /></Field><Field label="WhatsApp number"><input value={form.whatsapp} onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value }))} placeholder="Country code and number" /></Field></div></section><section className="admin-panel"><div className="panel-heading"><div><span>SOCIAL</span><h2>Social links</h2></div></div><div className="form-grid"><Field label="Instagram"><input value={form.instagram} onChange={(event) => setForm((current) => ({ ...current, instagram: event.target.value }))} placeholder="https://" /></Field><Field label="Facebook"><input value={form.facebook} onChange={(event) => setForm((current) => ({ ...current, facebook: event.target.value }))} placeholder="https://" /></Field><Field label="YouTube" className="span-2"><input value={form.youtube} onChange={(event) => setForm((current) => ({ ...current, youtube: event.target.value }))} placeholder="https://" /></Field></div></section><div className="settings-actions"><button type="submit" className="admin-primary"><Check size={16} />Save settings</button></div></form>
    </>
  )
}

function AdminNotFound() {
  return <div className="admin-not-found"><span>404</span><h1>Admin page not found</h1><p>This dashboard route does not exist.</p><Link className="admin-primary" to="/admin/dashboard"><ArrowLeft size={16} />Back to dashboard</Link></div>
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<DemoLogin />} />
      <Route path="*" element={<RequireDemo><AdminLayout><Routes><Route path="dashboard" element={<Dashboard />} /><Route path="packages" element={<PackagesPage />} /><Route path="packages/new" element={<PackageForm />} /><Route path="packages/:id/edit" element={<PackageForm />} /><Route path="destinations" element={<DestinationsPage />} /><Route path="media" element={<MediaPage />} /><Route path="settings" element={<SettingsPage />} /><Route path="*" element={<AdminNotFound />} /></Routes></AdminLayout></RequireDemo>} />
    </Routes>
  )
}
