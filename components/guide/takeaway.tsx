export function GuideTakeaway({ children }: { children: string }) {
  return (
    <aside className="guide-takeaway" aria-labelledby="guide-takeaway-label">
      <p id="guide-takeaway-label" className="guide-kicker">
        Key takeaway
      </p>
      <p>{children}</p>
    </aside>
  );
}
