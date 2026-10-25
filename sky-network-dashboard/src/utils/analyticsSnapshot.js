export const sortCategories = (categories) => [...categories].sort((a, b) =>
  b.count - a.count || a.label.localeCompare(b.label));

export function topCategories(categories, limit = 10) {
  const sorted = sortCategories(categories);
  const top = sorted.slice(0, limit);
  const remaining = sorted.slice(limit);
  if (remaining.length) top.push({ key: 'other-categories', label: 'Other', count: remaining.reduce((sum, item) => sum + item.count, 0) });
  return top;
}

export function analyticsSnapshot(flights) {
  const operators = new Map();
  const countries = new Map();
  const statuses = new Map();
  const statusLabels = { 'IN-FLIGHT': 'In flight', 'ON-GROUND': 'On ground', UNKNOWN: 'Unknown status' };
  for (const flight of flights) {
    const known = flight.airlineCode && flight.airlineCode !== '---' && !flight.operatorUnknown;
    const code = known ? flight.airlineCode : 'UNKNOWN_OPERATOR';
    const operator = operators.get(code) || {
      key: code,
      label: known ? (flight.airline || code) : 'Unknown operator',
      code: known ? code : null,
      count: 0,
    };
    operator.count++;
    operators.set(code, operator);
    const country = flight.originCountry || flight.country;
    const countryLabel = country && country !== '---' ? country : 'Unknown registration country';
    countries.set(countryLabel, (countries.get(countryLabel) || 0) + 1);
    const status = flight.status || 'UNKNOWN';
    const label = statusLabels[status] || status.toLowerCase().replace(/[-_]/g, ' ');
    const entry = statuses.get(status) || { key: status, label: label[0].toUpperCase() + label.slice(1), count: 0 };
    entry.count++;
    statuses.set(status, entry);
  }
  const average = (key) => {
    const values = flights.map((flight) => flight[key]).filter(Number.isFinite);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  };
  return {
    operators: sortCategories([...operators.values()]),
    countries: sortCategories([...countries].map(([label, count]) => ({ key: label, label, count }))),
    statuses: sortCategories([...statuses.values()]),
    total: flights.length,
    airborne: statuses.get('IN-FLIGHT')?.count || 0,
    onGround: statuses.get('ON-GROUND')?.count || 0,
    averageAltitude: average('altitudeFt'),
    averageSpeed: average('speedKnots'),
  };
}

export const countLabel = (count, unit = 'flight') => `${count.toLocaleString()} ${unit}${unit === 'aircraft' || count === 1 ? '' : 's'}`;
