import { Link } from 'react-router-dom'
import Logo from './Logo'
import { footerNav } from './navigation'
import { SocialIcon, socialLinks } from './SocialIcons'

export default function Footer(props) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-canvas" {...props}>
      <div className="shell pt-20 pb-10 md:pt-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              Handcrafted resin keepsakes with real flowers, made with care in India.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="eyebrow text-[0.6875rem] text-muted">{group.title}</h2>
                <ul className="mt-5 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="inline-block py-1.5 text-sm text-ink/80 transition-colors duration-300 hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col-reverse gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">© {year} Resin & Reverie. All rights reserved.</p>
          <ul className="-ml-3 flex items-center gap-1 sm:ml-0" aria-label="Social media">
            {socialLinks.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Resin & Reverie on ${s.name}`}
                  className="grid size-11 place-items-center rounded-full text-muted transition-colors duration-300 hover:text-ink"
                >
                  <SocialIcon name={s.name} className="size-[1.125rem]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
