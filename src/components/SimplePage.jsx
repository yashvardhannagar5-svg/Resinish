import { ArrowLeft } from 'lucide-react'
import { ButtonLink } from './Button'

/**
 * Simple editorial page: heading, intro, optional body content and one action.
 * Without body content the page is vertically centred (404, empty states).
 */
export default function SimplePage({ eyebrow, title, description, children, action }) {
  return (
    <section
      className={`shell pt-32 pb-24 md:pt-40 lg:pb-32 ${children ? '' : 'flex min-h-[80svh] flex-col justify-center'}`}
    >
      {eyebrow && <p className="eyebrow mb-6 text-muted">{eyebrow}</p>}
      <h1 className="display max-w-4xl text-[clamp(2.75rem,7vw,6rem)]">{title}</h1>
      {description && <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{description}</p>}
      {children && <div className="mt-16 max-w-3xl border-t border-line md:mt-20">{children}</div>}
      <div className="mt-12">
        <ButtonLink to={action?.to ?? '/'} variant="secondary">
          {!action && <ArrowLeft aria-hidden="true" className="size-4" />}
          {action?.label ?? 'Back to home'}
        </ButtonLink>
      </div>
    </section>
  )
}
