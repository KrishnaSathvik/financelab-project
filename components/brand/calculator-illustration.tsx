/** A conceptual companion to the homepage illustration, without sample results. */
export function CalculatorIllustration() {
  return (
    <svg viewBox="0 0 560 420" role="img" aria-labelledby="calculator-tools-title" className="h-auto w-full">
      <title id="calculator-tools-title">A calculator, planning checklist, pencil and savings coins</title>
      <ellipse cx="282" cy="214" rx="220" ry="173" fill="var(--surface-subtle)" />
      <ellipse cx="282" cy="382" rx="194" ry="14" fill="var(--border)" opacity="0.5" />

      {/* A plan behind the calculator. */}
      <g transform="rotate(10 342 210)" stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round">
        <rect x="270" y="81" width="162" height="244" rx="12" fill="var(--card)" />
        <rect x="311" y="70" width="80" height="24" rx="8" fill="var(--primary-soft)" />
        <g fill="none" strokeLinecap="round">
          <path d="M293 132L299 138L310 125M293 173L299 179L310 166M293 214L299 220L310 207" stroke="var(--positive)" />
          <path d="M325 132H404M325 173H393M325 214H404" stroke="var(--muted)" strokeWidth="2.5" opacity="0.5" />
        </g>
      </g>

      {/* A familiar tool, with operation symbols instead of invented estimates. */}
      <g transform="rotate(-8 212 239)" stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round">
        <rect x="114" y="113" width="194" height="254" rx="20" fill="var(--border)" />
        <rect x="108" y="105" width="194" height="254" rx="20" fill="var(--card)" />
        <rect x="127" y="125" width="156" height="60" rx="8" fill="var(--surface-subtle)" />
        <path d="M234 149H264M234 160H264" strokeWidth="4" strokeLinecap="round" />
        {[206, 250, 294].map(y => [129, 184, 239].map(x => <rect key={`${x}-${y}`} x={x} y={y} width="40" height="31" rx="6" fill={x === 239 ? 'var(--primary-soft)' : 'var(--card)'} strokeWidth="2" />))}
        <g strokeLinecap="round" strokeWidth="2.5">
          <path d="M251 221H267M259 213V229M251 265H267M253 304L265 316M265 304L253 316" />
        </g>
      </g>

      {/* Savings beside the tools. */}
      <g stroke="var(--positive)" strokeWidth="3" fill="var(--card)">
        <path d="M350 350V365C350 380 442 380 442 365V350" />
        <ellipse cx="396" cy="350" rx="46" ry="13" />
        <path d="M350 331V346C350 361 442 361 442 346V331" />
        <ellipse cx="396" cy="331" rx="46" ry="13" />
        <circle cx="393" cy="289" r="30" fill="var(--card)" />
        <circle cx="393" cy="289" r="21" strokeWidth="1.5" />
        <path d="M402 277C381 270 378 287 393 289C409 291 404 308 384 300M393 272V306" fill="none" strokeLinecap="round" strokeWidth="2.5" />
      </g>
      <g transform="rotate(22 464 260)" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M457 188H471V304L464 320L457 304Z" fill="var(--primary-soft)" />
        <path d="M457 204H471M457 304H471M464 211V298" fill="none" />
        <path d="M460 312L464 320L468 312" fill="var(--primary)" />
      </g>
    </svg>
  );
}
