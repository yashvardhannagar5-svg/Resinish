import { ChevronDown } from 'lucide-react'

const control =
  'block h-13 w-full scroll-mt-32 rounded-md border bg-surface px-4 text-base transition-colors duration-200 placeholder:text-muted/60 focus:border-ink focus:outline-none focus-visible:outline-none'

function Field({ id, label, optional, error, hint, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-accent">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

const describedBy = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined)

/** Labelled text input with inline error. */
export function TextField({ id, label, optional, error, hint, className, ...input }) {
  return (
    <Field id={id} label={label} optional={optional} error={error} hint={hint} className={className}>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={optional ? undefined : true}
        className={`${control} ${error ? 'border-accent' : 'border-line-strong'}`}
        {...input}
      />
    </Field>
  )
}

/** Labelled native select with inline error. */
export function SelectField({ id, label, error, options, className, placeholder, ...select }) {
  return (
    <Field id={id} label={label} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          name={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error)}
          aria-required
          className={`${control} cursor-pointer appearance-none pr-11 ${error ? 'border-accent' : 'border-line-strong'}`}
          {...select}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
        />
      </div>
    </Field>
  )
}
