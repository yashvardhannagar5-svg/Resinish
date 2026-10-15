import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { animate } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { Button } from '../components/Button'
import { categories, getCategory, queryProducts, sortOptions } from '../data/products'

const filters = [{ id: 'all', name: 'All' }, ...categories]
const SHOP_CARD_SIZES = '(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 46vw'

const chip = (active) =>
  `h-10 shrink-0 rounded-full px-4.5 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
    active ? 'bg-ink text-canvas' : 'border border-line-strong text-ink/75 hover:border-ink hover:text-ink'
  }`

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const searchInput = useRef(null)
  const grid = useRef(null)

  // The URL is the source of truth, so links like /shop?category=gaming just work.
  const category = getCategory(params.get('category')) ? params.get('category') : 'all'
  const sort = sortOptions.some((o) => o.id === params.get('sort')) ? params.get('sort') : 'featured'
  const onlyNew = params.get('filter') === 'new'
  const search = params.get('q') ?? ''

  // Typing is kept locally (URL updates lag behind fast keystrokes) and synced to ?q= shortly after.
  const [query, setQuery] = useState(search)
  const syncedQuery = useRef(search)

  const results = useMemo(
    () => queryProducts({ category, sort, onlyNew, search: query }),
    [category, sort, onlyNew, query],
  )

  const update = useCallback(
    (key, value, fallback) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (!value || value === fallback) next.delete(key)
          else next.set(key, value)
          return next
        },
        { replace: true, preventScrollReset: true },
      )
    },
    [setParams],
  )

  // External URL changes (Clear filters, back/forward) win over local text.
  useEffect(() => {
    if (search !== syncedQuery.current) {
      syncedQuery.current = search
      setQuery(search)
    }
  }, [search])

  useEffect(() => {
    if (query === syncedQuery.current) return undefined
    const t = setTimeout(() => {
      syncedQuery.current = query
      update('q', query.trim() ? query : null)
    }, 250)
    return () => clearTimeout(t)
  }, [query, update])

  // Navbar search icon lands here with focus in the field.
  useEffect(() => {
    if (location.state?.focusSearch) searchInput.current?.focus()
  }, [location.key, location.state])

  // Brief fade when the result set changes; cards stay mounted.
  const resultKey = `${category}|${sort}|${onlyNew}|${query}`
  const previousKey = useRef(resultKey)
  useEffect(() => {
    if (previousKey.current === resultKey || !grid.current) return undefined
    previousKey.current = resultKey
    const controls = animate(grid.current, { opacity: [0.35, 1] }, { duration: 0.3, ease: 'easeOut' })
    return () => controls.stop()
  }, [resultKey])

  const title = category === 'all' ? (onlyNew ? 'New Arrivals' : 'All Resin Pieces') : getCategory(category).name

  return (
    <section aria-labelledby="shop-title" className="shell pt-28 pb-24 md:pt-36 lg:pb-32">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-5 text-muted">Shop</p>
          <h1 id="shop-title" className="display text-[clamp(2.75rem,7vw,5.5rem)]">
            {title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:justify-end md:pb-2">
          <p className="text-sm text-muted" aria-live="polite">
            <span className="font-semibold text-ink tabular-nums">{results.length}</span>{' '}
            {results.length === 1 ? 'product' : 'products'}
            {query && <span className="sr-only"> matching “{query}”</span>}
          </p>
          {onlyNew && (
            <button
              type="button"
              onClick={() => update('filter', null)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-mist pr-2.5 pl-3.5 text-xs font-semibold transition-colors hover:bg-black/10"
              aria-label="Remove New arrivals filter"
            >
              New arrivals
              <X aria-hidden="true" className="size-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Toolbar */}
      <div className="mt-10 flex flex-col gap-4 border-y border-line py-4 md:mt-14 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div
          role="group"
          aria-label="Filter by category"
          className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 [contain:paint] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:[contain:none]"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={category === f.id}
              onClick={() => update('category', f.id, 'all')}
              className={chip(category === f.id)}
            >
              {f.name}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 flex-col gap-3 xs:flex-row xs:items-center">
          <div role="search" className="relative min-w-0 xs:flex-1 lg:flex-none">
            <label htmlFor="shop-search" className="sr-only">
              Search keepsakes
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
            />
            <input
              ref={searchInput}
              id="shop-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              autoComplete="off"
              className="h-10 w-full rounded-full border border-line-strong bg-transparent pr-4 pl-10 text-sm transition-colors placeholder:text-muted hover:border-ink focus:border-ink focus:outline-none lg:w-52 [&::-webkit-search-cancel-button]:hidden"
            />
          </div>

          <label className="flex items-center gap-3 text-sm">
            <span className="text-muted">Sort by</span>
            <span className="relative">
              <select
                value={sort}
                onChange={(e) => update('sort', e.target.value, 'featured')}
                className="h-10 cursor-pointer appearance-none rounded-full border border-line-strong bg-transparent pr-10 pl-4 font-medium transition-colors hover:border-ink"
              >
                {sortOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
              />
            </span>
          </label>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <ul
          ref={grid}
          aria-label={`${title}, ${results.length} products`}
          className="mt-10 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 md:mt-14 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-16 xl:grid-cols-4"
        >
          {results.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} sizes={SHOP_CARD_SIZES} className="h-full" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center py-28 text-center">
          <p className="text-2xl font-bold tracking-[-0.03em]">Nothing here yet.</p>
          <p className="mt-3 text-muted">
            {query ? `No resin pieces match “${query}”.` : 'No resin pieces match these filters.'}
          </p>
          <Button
            variant="secondary"
            className="mt-8"
            onClick={() => {
              setQuery('')
              setParams(new URLSearchParams(), { replace: true })
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </section>
  )
}
