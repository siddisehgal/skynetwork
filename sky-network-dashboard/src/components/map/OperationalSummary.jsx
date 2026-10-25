import { formatTimestamp } from './flightTelemetry';

function uniqueCount(flights, getValue) {
  return new Set(flights.map(getValue).filter(Boolean)).size;
}

export function OperationalSummary({ flights, lastSync }) {
  const metrics = [
    { label: 'Active Aircraft', value: flights.length },
    { label: 'Airlines', value: uniqueCount(flights, (flight) => flight.airline) },
    { label: 'Countries', value: uniqueCount(flights, (flight) => flight.country || flight.originCountry) },
    { label: 'Last Updated', value: formatTimestamp(lastSync) },
  ];

  return (
    <section aria-label="Flight map operational summary" className="map-operational-summary">
      {metrics.map((metric) => (
        <div className="map-summary-metric" key={metric.label}>
          <span className="label-caps">{metric.label}</span>
          <strong className={metric.label === 'Last Updated' ? '' : 'font-mono'}>
            {metric.value}
          </strong>
        </div>
      ))}
    </section>
  );
}