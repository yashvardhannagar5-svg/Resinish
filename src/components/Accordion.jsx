import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1]

function AccordionItem({ title, open, onToggle, children }) {
  const id = useId()
  const buttonId = `${id}-button`
  const panelId = `${id}-panel`

  return (
    <div className="border-b border-line">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="eyebrow text-[0.8125rem]">{title}</span>
          <Plus
            aria-hidden="true"
            className={`size-4.5 shrink-0 transition-transform duration-500 ease-premium ${open ? 'rotate-45' : ''}`}
            strokeWidth={1.6}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Multi-open accordion. `items`: [{ id, title, content }] */
export default function Accordion({ items, defaultOpen = [] }) {
  const [open, setOpen] = useState(() => new Set(defaultOpen))

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <AccordionItem key={item.id} title={item.title} open={open.has(item.id)} onToggle={() => toggle(item.id)}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}
