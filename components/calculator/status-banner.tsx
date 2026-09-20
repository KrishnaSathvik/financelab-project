import { CheckCircle2, CircleAlert } from "lucide-react";

export function StatusBanner({
  title,
  children,
  tone = "positive",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "positive" | "warning";
}) {
  const positive = tone === "positive";
  return (
    <div
      className={`flex gap-3 rounded-2xl border p-4 ${
        positive ? "status-success" : "status-warning"
      }`}
    >
      {positive ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-positive" />
      ) : (
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
      )}
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 opacity-80">{children}</p>
      </div>
    </div>
  );
}
