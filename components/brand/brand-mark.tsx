export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt=""
      width={44}
      height={44}
      className={className}
      aria-hidden="true"
      draggable={false}
    />
  );
}
