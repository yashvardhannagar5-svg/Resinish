import ScrollReveal from '../components/ScrollReveal'

const steps = [
  ['01', 'Choose your bloom', 'Pick a flower style or tell us which colours and petals you have in mind.'],
  ['02', 'Made by hand', 'Each piece is arranged, cast and polished in small batches. Natural flowers make every design slightly different.'],
  ['03', 'A keepsake to keep', 'Your finished piece is packed gift-ready with simple care notes to help it stay beautiful.'],
]

export default function ProductStory() {
  return (
    <section aria-labelledby="story-title" className="on-dark relative overflow-hidden bg-graphite text-canvas">
      <div className="shell section-y">
        <ScrollReveal>
          <p data-reveal className="eyebrow text-white/60">Made with meaning</p>
          <h2 data-reveal id="story-title" className="display mt-6 max-w-3xl text-[clamp(3rem,8vw,7rem)]">A flower, kept close.</h2>
          <p data-reveal className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">Real petals, thoughtful details and clear resin come together in keepsakes made for gifting, remembering and everyday joy.</p>
        </ScrollReveal>
        <ScrollReveal as="ol" className="mt-16 grid gap-10 border-t border-white/15 pt-8 md:grid-cols-3 md:gap-8 lg:mt-24">
          {steps.map(([number, title, text]) => <li key={number} data-reveal>
            <p className="eyebrow text-white/50">{number}</p>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">{text}</p>
          </li>)}
        </ScrollReveal>
      </div>
    </section>
  )
}
