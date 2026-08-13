export function MapLegend() {
  return (
    <aside className="map-legend" aria-label="Map legend">
      <span className="label-caps">Map legend</span>

      <div>
        <i className="map-legend-aircraft" aria-hidden="true">✈</i>
        Aircraft
      </div>

      <div>
        <i className="map-legend-airport" aria-hidden="true">A</i>
        Airport
      </div>

      <div>
        <i
          aria-hidden="true"
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#ffb300',
border: '2px solid #ffb300',
            display: 'inline-block'
          }}
        />
        MRO Facility
      </div>

      <div>
        <i
          aria-hidden="true"
          style={{
            width: 20,
            borderTop: '2px dashed var(--surface-tint)'
          }}
        />
        Route
      </div>
    </aside>
  );
}