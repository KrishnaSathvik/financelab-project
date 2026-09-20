import fixtures from '@/lib/guides/fixtures.json';

export type Exhibit = { title: string; columns: string[]; rows: (string | number)[][]; formats: string[]; note: string; kind: string; series: number[] };
export const guideExhibits: Record<string, Exhibit> = fixtures.exhibits;
const colors = ['var(--chart-primary)', 'var(--chart-growth)', 'var(--savings)'];

export function formatGuideCell(value: string | number, format: string) {
  if (typeof value === 'string') return value;
  if (format === 'money') return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value);
  if (format === 'percent') return `${new Intl.NumberFormat('en-US',{maximumFractionDigits:4}).format(value)}%`;
  return new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(value);
}

function LineChart({ exhibit: e, id }: { exhibit: Exhibit; id: string }) {
  const values = e.rows.flatMap(r => e.series.map(i => Number(r[i])));
  const lo = Math.min(0,...values), hi = Math.max(1,...values);
  const first = Number(e.rows[0][0]), last = Number(e.rows.at(-1)![0]);
  const x = (v:number) => 76 + (v-first)/(last-first || 1)*610;
  const y = (v:number) => 258-(v-lo)/(hi-lo)*224;
  return <>
    <div className="mt-5 overflow-x-auto" role="region" tabIndex={0} aria-label={`${e.title} chart`}><svg viewBox="0 0 720 306" role="img" aria-labelledby={`${id}-chart-title ${id}-chart-desc`} className="block h-auto w-full">
      <title id={`${id}-chart-title`}>{e.title}</title>
      <desc id={`${id}-chart-desc`}>{e.columns[0]} on the horizontal axis; {e.formats[e.series[0]] === 'percent' ? 'percent' : 'US dollars'} on the vertical axis. {e.series.map(i=>e.columns[i]).join(', ')}. Exact values are in the following table.</desc>
      {[0,.25,.5,.75,1].map(t=>{const v=lo+(hi-lo)*t;return <g key={t}><line x1="76" x2="686" y1={y(v)} y2={y(v)} stroke="var(--border)"/><text x="67" y={y(v)+4} textAnchor="end" fill="var(--muted)" fontSize="13">{new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(v)}</text></g>})}
      {e.rows.map(r=><text key={String(r[0])} x={x(Number(r[0]))} y="280" textAnchor="middle" fill="var(--muted)" fontSize="12">{r[0]}</text>)}
      <text x="381" y="303" textAnchor="middle" fill="var(--muted)" fontSize="13">{e.columns[0]}</text>
      <text x="76" y="17" fill="var(--muted)" fontSize="13">{e.formats[e.series[0]] === 'percent' ? 'Percent' : 'US dollars'}</text>
      {e.series.map((c,i)=><g key={c}><polyline points={e.rows.map(r=>`${x(Number(r[0]))},${y(Number(r[c]))}`).join(' ')} fill="none" stroke={colors[i%3]} strokeWidth="3" strokeDasharray={i===1?'8 4':i===2?'2 4':undefined}/>{e.rows.map(r=><circle key={String(r[0])} cx={x(Number(r[0]))} cy={y(Number(r[c]))} r="3" fill={colors[i%3]}/>)}</g>)}
    </svg></div>
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">{e.series.map((c,i)=><span key={c} className="flex items-center gap-2"><span aria-hidden="true" style={{backgroundColor:colors[i%3]}} className="h-2 w-6 rounded"/>{e.columns[c]} {i===1?'(dashed)':i===2?'(dotted)':'(solid)'}</span>)}</div>
  </>;
}

function Waterfall({ exhibit: e, id }: { exhibit: Exhibit; id: string }) {
  const segments = e.rows.map((r,i)=>{
    const amount=Number(r[1]); const total=i===0||i===e.rows.length-1;
    const from=total?0:e.rows.slice(0,i).reduce((sum,row)=>sum+Number(row[1]),0); const to=total?amount:from+amount;
    return {name:String(r[0]),amount,from,to,total};
  });
  const max=Math.max(...segments.flatMap(s=>[s.from,s.to]));
  return <div role="img" aria-label={`${e.title}. Gross wages fall as each tax is subtracted, leaving estimated net. Exact values follow.`} className="my-6 space-y-4" id={`${id}-chart`}>
    {segments.map(s=><div key={s.name}><div className="mb-1 flex flex-wrap justify-between gap-2 text-sm"><span>{s.name}</span><span className="tabular-nums">{formatGuideCell(s.amount,'money')}</span></div><div className="guide-bar-track relative h-6"><span className="absolute h-6 rounded-full" style={{left:`${Math.min(s.from,s.to)/max*100}%`,width:`${Math.abs(s.to-s.from)/max*100}%`,backgroundColor:s.total?colors[0]:colors[1]}}/></div></div>)}
  </div>;
}

function Bars({ exhibit:e }: {exhibit:Exhibit}) {
  const series=e.series[0]??1;
  const rows=e.kind==='allocation'?e.rows.slice(0,-1):e.rows;
  const max=Math.max(1,...rows.map(r=>Math.abs(Number(r[series]))));
  return <div role="img" aria-label={`${e.title}. Horizontal bars share a zero baseline. Exact values follow.`} className="my-6 space-y-4">{rows.map((r,i)=><div key={String(r[0])}><div className="mb-1 flex flex-wrap justify-between gap-2 text-sm"><span>{e.kind==='timeline'?`Year ${r[0]}`:r[0]}</span><span className="tabular-nums">{formatGuideCell(r[series],e.formats[series])}</span></div><div className="guide-bar-track"><div className="guide-bar-fill" style={{width:`${Math.abs(Number(r[series]))/max*100}%`,backgroundColor:colors[i%3]}}/></div></div>)}</div>;
}

function Stacked({ exhibit:e }: {exhibit:Exhibit}) {
  return <div className="my-6 space-y-5" role="img" aria-label="Each bar divides the same annual loan payment into principal and interest. Principal grows as interest shrinks. Exact annual dollars follow.">
        {e.rows.map(r=>{const principal=Number(r[1]),interest=Number(r[2]),share=principal/(principal+interest);return <div key={String(r[0])}><p className="mb-2 text-sm">Year {r[0]} · principal {(share*100).toFixed(1)}% / interest {((1-share)*100).toFixed(1)}%</p><div className="flex h-8 overflow-hidden rounded-full"><span style={{width:`${share*100}%`,backgroundColor:'var(--chart-primary)'}}/><span className="flex-1" style={{backgroundColor:'var(--chart-cost)'}}/></div></div>})}
    <p className="text-sm text-muted">Blue: principal · Orange: interest</p>
  </div>;
}

function HousingPaths() {
  return <div className="my-6 grid gap-4 sm:grid-cols-2" aria-label="Two housing paths with equal starting and monthly resources">
    <div className="rounded-xl border border-border bg-card p-5"><h3 className="font-semibold">BUY</h3><p className="mt-3 leading-7 text-muted">Starting cash → down payment + closing costs</p><p className="mt-3 leading-7 text-muted">Monthly resources → mortgage + ownership costs</p><p className="mt-3 leading-7 text-muted">Lower costs → owner investments</p><p className="mt-4 border-t border-border pt-4 font-medium">Ending position = home equity + owner portfolio</p></div>
    <div className="rounded-xl border border-border bg-card p-5"><h3 className="font-semibold">RENT + INVEST</h3><p className="mt-3 leading-7 text-muted">Same starting cash → renter investments</p><p className="mt-3 leading-7 text-muted">Same monthly resources → rent + renters insurance</p><p className="mt-3 leading-7 text-muted">Lower costs → renter investments</p><p className="mt-4 border-t border-border pt-4 font-medium">Ending position = renter portfolio</p></div>
  </div>;
}

function PayoffSequence({exhibit:e}:{exhibit:Exhibit}) {
  return <ol className="my-6 space-y-3" aria-label={`${e.title}: extra-payment priority`}>{e.rows.map(r=><li key={String(r[0])} className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary" aria-label="Priority">{r[1]}</span><span className="flex-1 font-medium">{r[0]}</span><span className="text-sm text-muted">Paid off: month {r[3]}</span></li>)}</ol>;
}

function RateComparison({ exhibit: e }: { exhibit: Exhibit }) {
  const groups = [
    {
      label: '12% nominal, monthly',
      caption: 'Separate illustrative example',
      items: [
        { label: 'Nominal rate', value: Number(e.rows[0][1]) },
        { label: 'Effective annual yield', value: Number(e.rows[0][3]) },
      ],
    },
    {
      label: '5% APY',
      caption: 'Separate illustrative example',
      items: [
        { label: 'Effective annual yield', value: Number(e.rows[1][3]) },
        { label: 'Equivalent nominal', value: Number(e.rows[1][1]) },
      ],
    },
    {
      label: '5% nominal, annual',
      caption: 'Separate illustrative example',
      items: [
        { label: 'Nominal rate', value: Number(e.rows[2][1]) },
        { label: 'Effective annual yield', value: Number(e.rows[2][3]) },
      ],
    },
  ];
  return (
    <div role="img" aria-label="Three separate rate examples. Each group has its own scale so a 12.68% yield is not compared as a product against a 5% APY. Exact values follow." className="my-6">
      {groups.map((group) => {
        const max = Math.max(...group.items.map((item) => item.value));
        return (
          <div key={group.label} className="guide-rate-group">
            <p className="guide-kicker">{group.caption}</p>
            <p className="mt-2 font-semibold">{group.label}</p>
            <div className="mt-4 space-y-4">
              {group.items.map((item, index) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between gap-3 text-sm">
                    <span>{item.label}</span>
                    <span className="tabular-nums">{formatGuideCell(item.value, 'percent')}</span>
                  </div>
                  <div className="guide-bar-track">
                    <div className="guide-bar-fill" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: colors[index % 3] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExhibitTable({ exhibit: e }: { exhibit: Exhibit }) {
  return (
    <>
      {e.columns.length > 2 ? <p className="mt-4 text-xs text-muted sm:hidden">Scroll the table horizontally for all columns.</p> : null}
      <div className="mt-5 overflow-x-auto rounded-xl border border-border" role="region" aria-label={`${e.title} data table`} tabIndex={0}>
        <table className="guide-table">
          <caption className="sr-only">{e.title} — independently calculated example data</caption>
          <thead>
            <tr>
              {e.columns.map((column, index) => (
                <th key={column} scope="col" className={e.formats[index] === 'text' ? undefined : 'num'}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {e.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, columnIndex) =>
                  columnIndex === 0 ? (
                    <th key={columnIndex} scope="row" className="font-medium">
                      {formatGuideCell(value, e.formats[columnIndex])}
                    </th>
                  ) : (
                    <td key={columnIndex} className={e.formats[columnIndex] === 'text' ? 'whitespace-nowrap' : 'num whitespace-nowrap'}>
                      {formatGuideCell(value, e.formats[columnIndex])}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function GuideExhibit({ id }: { id: string }) {
  const e = guideExhibits[id];
  if (!e) throw new Error(`Unknown guide exhibit ${id}`);
  return (
    <figure data-exhibit={id} className="guide-exhibit my-7 min-w-0" aria-labelledby={`${id}-title`}>
      <figcaption id={`${id}-title`} className="text-base font-semibold">{e.title}</figcaption>
      {id === 'apy' && <RateComparison exhibit={e} />}
      {e.kind === 'line' && <LineChart exhibit={e} id={id} />}
      {e.kind === 'waterfall' && <Waterfall exhibit={e} id={id} />}
      {e.kind === 'stacked' && <Stacked exhibit={e} />}
      {id !== 'apy' && ['bars', 'allocation', 'timeline'].includes(e.kind) && <Bars exhibit={e} />}
      {e.kind === 'paths' && <HousingPaths />}
      {e.kind === 'sequence' && <PayoffSequence exhibit={e} />}
      <ExhibitTable exhibit={e} />
      <p className="mt-4 text-sm leading-6 text-muted">{e.note}</p>
    </figure>
  );
}
