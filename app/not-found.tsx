import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted">That URL is not one of MoneyBasis’s calculators or trust pages.</p>
      <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-inverse">
        Back to homepage
      </Link>
    </div>
  );
}
