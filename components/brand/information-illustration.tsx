export type InformationTopic = 'guides' | 'how-it-works' | 'about' | 'sources' | 'privacy' | 'disclaimer';
const titles: Record<InformationTopic, string> = {
  guides: 'An open book and bookmark for learning about money',
  'how-it-works': 'A magnifying glass examining a calculation',
  about: 'A compass and a plan for finding financial clarity',
  sources: 'Reference books and a checked source document',
  privacy: 'A shield and lock protecting a document',
  disclaimer: 'A balance scale beside an information document',
};

export function InformationIllustration({ topic }: { topic: InformationTopic }) {
  const titleId = `illustration-${topic}`;
  return <svg viewBox="0 0 560 420" role="img" aria-labelledby={titleId} className="h-auto w-full">
    <title id={titleId}>{titles[topic]}</title>
    <ellipse cx="280" cy="213" rx="221" ry="172" fill="var(--surface-subtle)" />
    <ellipse cx="282" cy="374" rx="190" ry="15" fill="var(--border)" opacity="0.5" />
    {topic === 'guides' || topic === 'sources' ? <g stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round">
      <path d="M116 294H423V330H116Q99 312 116 294Z" fill="var(--surface-subtle)" />
      <path d="M130 333H438V362H130Q114 347 130 333Z" fill="var(--card)" />
      <path d="M134 344H419M134 352H419" strokeWidth="1.5" opacity="0.5" />
      <path d="M111 133Q202 111 278 160Q354 111 446 133L430 300Q353 279 278 322Q201 279 124 300Z" fill="var(--card)" />
      <path d="M278 160V322" fill="none" />
      <path d="M351 130L373 128V202L362 192L351 205Z" fill="var(--positive)" stroke="none" />
      <g stroke="var(--muted)" opacity="0.5" strokeWidth="2.5" strokeLinecap="round">
        <path d="M147 174Q197 168 249 194M147 202Q197 196 249 222M149 232Q199 226 249 252M313 221Q352 206 405 211M313 250Q352 235 401 240" fill="none" />
      </g>
      {topic === 'sources' && <g><circle cx="427" cy="132" r="39" fill="var(--card)" stroke="var(--positive)"/><path d="M409 131L422 144L447 119" fill="none" stroke="var(--positive)" strokeWidth="4" strokeLinecap="round"/></g>}
    </g> : <>
      <g transform="rotate(-7 247 221)" stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round">
        <rect x="130" y="108" width="225" height="243" rx="12" fill="var(--surface-subtle)" />
        <path d="M144 92H318L366 140V336H144Z" fill="var(--card)" />
        <path d="M318 92V140H366" fill="var(--primary-soft)" />
        <path d="M176 163H265M176 188H282M176 249H295M176 274H266" stroke="var(--muted)" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
        <path d="M176 212L184 220L200 203" stroke="var(--positive)" fill="none" strokeLinecap="round" />
      </g>
      {topic === 'how-it-works' && <g stroke="var(--primary)" strokeWidth="4" strokeLinecap="round">
        <path d="M375 278L443 347" strokeWidth="18" /><circle cx="342" cy="240" r="66" fill="var(--card)" /><circle cx="342" cy="240" r="52" fill="var(--surface-subtle)" strokeWidth="2" />
        <path d="M314 240H334M324 230V250M349 235H370M349 246H370" stroke="var(--positive)" />
      </g>}
      {topic === 'about' && <g stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round">
        <circle cx="370" cy="266" r="82" fill="var(--card)"/><circle cx="370" cy="266" r="66" fill="var(--surface-subtle)" strokeWidth="2"/>
        <path d="M370 207V218M370 314V325M311 266H322M418 266H429"/>
        <path d="M400 221L379 276L340 311L361 256Z" fill="var(--card)"/><path d="M400 221L379 276L361 256Z" fill="var(--positive)" stroke="var(--positive)"/>
      </g>}
      {topic === 'privacy' && <g stroke="var(--primary)" strokeWidth="3.5" strokeLinejoin="round">
        <path d="M369 166C396 188 420 192 448 193V263C448 305 412 339 369 360C326 339 290 305 290 263V193C318 192 342 188 369 166Z" fill="var(--card)"/>
        <rect x="339" y="246" width="60" height="53" rx="8" fill="var(--primary-soft)"/>
        <path d="M349 246V231A20 20 0 0 1 389 231V246" fill="none" stroke="var(--positive)"/>
        <circle cx="369" cy="269" r="4" fill="var(--primary)"/><path d="M369 269V281"/>
      </g>}
      {topic === 'disclaimer' && <g stroke="var(--primary)" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M373 181V343M337 347H409M296 219H450" fill="none"/>
        <circle cx="373" cy="206" r="8" fill="var(--positive)" stroke="var(--positive)"/>
        <path d="M309 221L282 278H336ZM436 221L409 278H463Z" fill="var(--card)"/>
        <path d="M282 278Q309 316 336 278M409 278Q436 316 463 278" fill="var(--primary-soft)"/>
      </g>}
    </>}
  </svg>;
}
