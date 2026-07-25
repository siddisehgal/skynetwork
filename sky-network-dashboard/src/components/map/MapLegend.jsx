export function MapLegend() {
  return (
    <aside className="map-legend" aria-label="Map legend">
      <span className="label-caps">Map legend</span>
      <div><i className="map-legend-aircraft" aria-hidden="true">✈</i> Aircraft</div>
      <div><i className="map-legend-airport" aria-hidden="true">A</i> Airport</div>
    </aside>
  );
}
