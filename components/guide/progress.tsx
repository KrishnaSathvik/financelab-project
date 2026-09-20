"use client";

import { useEffect, useState } from "react";

export function GuideProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".guide-article");
    if (!article) return;

    const update = () => {
      const start = article.offsetTop;
      const height = article.offsetHeight - window.innerHeight;
      const next = height <= 0 ? 100 : Math.min(100, Math.max(0, ((window.scrollY - start) / height) * 100));
      setProgress(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="guide-progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <span style={{ width: `${progress}%` }} />
    </div>
  );
}
