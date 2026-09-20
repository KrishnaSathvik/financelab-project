import { guidePreviews } from '@/lib/guides/previews';

export function GuidePreview({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const preview = guidePreviews[slug];
  if (!preview) throw new Error(`Missing guide preview: ${slug}`);
  return <div data-guide-preview={slug} className={`min-w-0 rounded-xl border border-border bg-surface ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
    <p className="text-xs leading-5 text-muted">{preview.context}</p>
    <dl className={`mt-5 grid gap-x-5 gap-y-4 ${compact ? 'grid-cols-1' : preview.values.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
      {preview.values.map(item => <div key={item.label} className={compact ? 'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1' : 'min-w-0'}>
        <dt className="text-sm leading-5 text-muted">{item.label}</dt>
        <dd className={`font-semibold leading-tight tracking-tight ${compact ? 'text-lg' : 'mt-2 text-2xl'}`}>{item.value}</dd>
      </div>)}
    </dl>
    <p className={`mt-6 border-t border-border pt-5 font-medium ${compact ? 'text-sm leading-6' : 'text-lg leading-7'}`}>{preview.takeaway}</p>
  </div>;
}
