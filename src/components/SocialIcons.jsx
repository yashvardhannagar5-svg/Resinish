// Minimal brand glyphs, since lucide-react no longer ships brand icons.
const icons = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  YouTube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" />
    </>
  ),
  X: <path d="M5 4.5 19 19.5M19 4.5 5 19.5" />,
  Spotify: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 9.5c3-1 6.5-.7 9 .8M8 12.5c2.4-.7 5.2-.4 7.2.8M8.6 15.3c1.9-.5 3.9-.3 5.5.6" />
    </>
  ),
}

export const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'YouTube', href: 'https://youtube.com' },
  { name: 'X', href: 'https://x.com' },
  { name: 'Spotify', href: 'https://spotify.com' },
]

export function SocialIcon({ name, className = 'size-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {icons[name]}
    </svg>
  )
}
