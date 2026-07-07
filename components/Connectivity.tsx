import { connectivityCategories } from '@/lib/content';

export default function Connectivity() {
  return (
    <section id="location" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display text-3xl text-navy">Connectivity</h2>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {connectivityCategories.map((category) => (
          <div key={category.title}>
            <h3 className="font-medium text-navy">{category.title}</h3>
            <ul className="mt-2 space-y-1 text-navy/80">
              {category.items.map((item) => (
                <li key={item.label}>
                  {item.label}
                  {item.distance ? ` — ${item.distance}` : ''}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
