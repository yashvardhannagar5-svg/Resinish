const workImages = Array.from({ length: 21 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return { src: `/work/work-${number}.jpg`, alt: `Handmade resin work from our studio, piece ${index + 1}` }
})

function WorkStrip({ duplicate = false }) {
  return (
    <div className="flex shrink-0 gap-4 pr-4" aria-hidden={duplicate || undefined}>
      {workImages.map((image) => (
        <figure key={image.src} className="w-56 shrink-0 sm:w-64 lg:w-72">
          <div className="aspect-[4/5] overflow-hidden rounded-md bg-mist">
            <img
              src={image.src}
              alt={duplicate ? '' : image.alt}
              loading="eager"
              decoding="async"
              draggable="false"
              className="size-full select-none object-cover"
            />
          </div>
        </figure>
      ))}
    </div>
  )
}

export default function OurWork() {
  return (
    <section aria-labelledby="our-work-title" className="section-y overflow-hidden border-y border-line bg-[#f1e9e4]">
      <div className="shell mb-10 sm:mb-14">
        <p className="eyebrow text-muted">From our hands to yours</p>
        <h2 id="our-work-title" className="display mt-4 max-w-3xl text-[clamp(2.75rem,6vw,5rem)]">A little look at our work.</h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">Every keepsake is poured, finished and personalised by hand. Here are a few pieces from our studio.</p>
      </div>
      <div className="work-marquee" role="region" aria-label="Automatically moving gallery of our resin work">
        <div className="work-marquee__track">
          <WorkStrip />
          <WorkStrip duplicate />
        </div>
      </div>
    </section>
  )
}
