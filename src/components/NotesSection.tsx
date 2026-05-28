import { notesSections } from '../data/ui'

export function NotesSection() {
  return <section className="notes">{(notesSections as { title: string; items: string[] }[]).map((section) => <article key={section.title} className="panel"><h3>{section.title}</h3><ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</section>
}
