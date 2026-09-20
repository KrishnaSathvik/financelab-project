import Link from "next/link";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

export function PageBreadcrumbs({
  items,
  className,
}: {
  items: [BreadcrumbItem, BreadcrumbItem, ...BreadcrumbItem[]];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className ? `page-breadcrumb ${className}` : "page-breadcrumb"}>
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.name} aria-current={current ? "page" : undefined}>
              {item.href && !current ? <Link href={item.href}>{item.name}</Link> : item.name}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
