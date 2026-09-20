import { financialSources, type SourceKey } from "@/lib/sources";
import { sourceShortName } from "@/lib/guides/source-labels";

export function GuideCite({ sources }: { sources: SourceKey[] }) {
  if (!sources.length) return null;
  return (
    <span className="guide-cite">
      {sources.map((key, index) => (
        <span key={key}>
          {index > 0 ? " · " : ""}
          <a href={financialSources[key].url} rel="noreferrer">
            {sourceShortName(key)}
          </a>
        </span>
      ))}
    </span>
  );
}
