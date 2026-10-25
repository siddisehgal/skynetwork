import { CircleMarker, Popup } from 'react-leaflet';

function formatList(value) {
  const items = Array.isArray(value)
    ? value
    : String(value || '').split(';');

  return items
    .map((item) => String(item).trim())
    .filter(Boolean)
    .join(', ') || 'Not available';
}

export function MROLayer({ facilities = [] }) {
  return (
    <>
      {facilities.map((facility) => (
        <CircleMarker
          key={facility.id}
          center={[
            Number(facility.latitude),
            Number(facility.longitude),
          ]}
          radius={7}
          pathOptions={{
            color: '#ffb300',
            fillColor: '#ffb300',
            fillOpacity: 0.9,
            weight: 2,
          }}
          pane="markerPane"
        >
          <Popup>
            <div style={{ minWidth: 220 }}>
              <strong>{facility.name}</strong>

              <div>
                {facility.city}, {facility.country}
              </div>

              <hr />

              <div>
                <strong>Operator:</strong> {facility.operator}
              </div>

              <div>
                <strong>Hangars:</strong> {facility.hangars}
              </div>

              <div>
                <strong>Annual Capacity:</strong>{' '}
                {facility.annual_capacity}
              </div>

              <div>
                <strong>Capabilities:</strong>
                <br />
                {formatList(facility.capabilities)}
              </div>

              <div>
                <strong>Aircraft:</strong>
                <br />
                {formatList(facility.aircraft_supported)}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}