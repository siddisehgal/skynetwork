import { useId, useState } from 'react';
import { countLabel, topCategories } from '../../utils/analyticsSnapshot';

export function CategoryBreakdown({ categories, label, unit = 'flight' }) {
  const [query, setQuery] = useState('');
  const searchId = useId();
  const chart = topCategories(categories);
  const max = Math.max(1, ...chart.map((item) => item.count));
  const filtered = categories.filter((item) => `${item.label} ${item.code || ''}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="category-breakdown">
      <p className="analytics-caption">Top 10 by count; remaining categories grouped as Other.</p>
      <ol className="horizontal-bars" aria-label={`${label} chart`}>
        {chart.map((item) => (
          <li key={item.key} title={`${item.label}: ${countLabel(item.count, unit)}`}>
            <div className="horizontal-bar-label">
              <span>{item.label}{item.code && <small> ({item.code})</small>}</span>
              <strong className="font-mono">{item.count.toLocaleString()}</strong>
            </div>
            <div className="horizontal-bar-track" aria-hidden="true">
              <div className="horizontal-bar-fill" style={{ width: `${item.count / max * 100}%` }} />
            </div>
          </li>
        ))}
      </ol>
      <label className="analytics-search-label" htmlFor={searchId}>Search {label.toLowerCase()}</label>
      <input id={searchId} className="hud-input analytics-search" type="search" value={query}
        onChange={(event) => setQuery(event.target.value)} placeholder="Name or code" />
      <p className="analytics-caption" role="status">{filtered.length} of {categories.length} categories</p>
      <div className="analytics-table-scroll" role="region" aria-label={`${label} table`} tabIndex={0}>
        <table className="analytics-table">
          <caption className="analytics-caption">All {label.toLowerCase()}, sorted by count</caption>
          <thead><tr><th scope="col">Category</th><th scope="col">Count</th></tr></thead>
          <tbody>
            {filtered.map((item) => <tr key={item.key}>
              <th scope="row">{item.label}{item.code && <small> ({item.code})</small>}</th>
              <td title={countLabel(item.count, unit)}>{countLabel(item.count, unit)}</td>
            </tr>)}
            {!filtered.length && <tr><td colSpan={2}>No matching categories.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
