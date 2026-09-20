/** A conceptual illustration; calculations live in the interactive example below. */
export function HeroIllustration() {
  return (
    <figure className="w-full">
      <svg viewBox="0 0 560 440" role="img" aria-labelledby="money-plans-title" className="h-auto w-full">
        <title id="money-plans-title">A home, savings growing from coins, and an open planning notebook</title>
        <ellipse cx="283" cy="222" rx="222" ry="185" fill="var(--surface-subtle)" />
        <ellipse cx="286" cy="390" rx="209" ry="17" fill="var(--border)" opacity="0.5" />

        {/* A home: a tangible decision, not an example mortgage result. */}
        <g stroke="var(--primary)" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
          <path d="M66 206L153 133L240 206" fill="var(--card)" />
          <path d="M83 199V297H223V199L153 150Z" fill="var(--card)" />
          <path d="M184 158V131H207V177" fill="var(--primary-soft)" />
          <path d="M66 206L153 133L240 206" fill="none" />
          <rect x="139" y="236" width="30" height="61" rx="3" fill="var(--primary-soft)" />
          <rect x="101" y="207" width="23" height="25" rx="3" fill="var(--primary-soft)" />
          <rect x="183" y="207" width="23" height="25" rx="3" fill="var(--primary-soft)" />
          <path d="M112 207V232M194 207V232" strokeWidth="2" />
          <circle cx="161" cy="268" r="2" fill="var(--primary)" stroke="none" />
        </g>

        {/* Savings as something tended over time. */}
        <g stroke="var(--positive)" strokeWidth="3" strokeLinejoin="round">
          <path d="M399 252V129" fill="none" strokeLinecap="round" />
          <path d="M399 203C360 202 343 179 346 157C378 155 401 175 399 203Z" fill="var(--card)" />
          <path d="M400 167C401 130 423 113 450 117C448 148 430 168 400 167Z" fill="var(--card)" />
          <path d="M399 130C375 116 370 93 381 75C405 86 412 109 399 130Z" fill="var(--positive)" />
          <path d="M355 167L399 203M439 128L401 166" fill="none" strokeWidth="2" />
        </g>
        <g stroke="var(--primary)" strokeWidth="3" fill="var(--card)">
          <path d="M356 265V279C356 293 443 293 443 279V265" />
          <ellipse cx="399.5" cy="265" rx="43.5" ry="12" />
          <path d="M356 247V261C356 275 443 275 443 261V247" />
          <ellipse cx="399.5" cy="247" rx="43.5" ry="12" />
          <path d="M356 229V243C356 257 443 257 443 243V229" />
          <ellipse cx="399.5" cy="229" rx="43.5" ry="12" />
        </g>

        {/* An open notebook ties the decisions together through planning. */}
        <g stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round">
          <path d="M155 304L278 318L405 299L430 378L287 405L132 381Z" fill="var(--surface-subtle)" />
          <path d="M165 279C204 275 246 288 278 306C311 284 355 274 393 278L417 360C371 355 327 366 285 389C243 367 198 359 143 362Z" fill="var(--card)" />
          <path d="M278 306L285 389" fill="none" />
          <path d="M303 295L314 290L324 326L314 321L307 331Z" fill="var(--positive)" stroke="none" />
          <g fill="none" strokeLinecap="round" strokeWidth="2.5">
            <path d="M180 308L185 314L195 303M178 333L183 339L193 328" stroke="var(--positive)" />
            <path d="M204 311L251 325M202 338L254 352M333 314L375 307M320 340L383 329" stroke="var(--muted)" opacity="0.55" />
          </g>
        </g>
        <g transform="rotate(30 448 328)" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M441 287H455V356L448 371L441 356Z" fill="var(--primary-soft)" />
          <path d="M441 298H455M441 356H455M448 301V351" fill="none" />
          <path d="M445 364L448 371L451 364" fill="var(--primary)" />
        </g>
      </svg>
    </figure>
  );
}
