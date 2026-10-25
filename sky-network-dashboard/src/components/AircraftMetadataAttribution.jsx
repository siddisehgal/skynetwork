export function AircraftMetadataAttribution() {
  return (
    <small style={{ display: 'block', marginTop: 12, color: 'var(--on-surface-variant)', fontSize: 10 }}>
      Aircraft metadata contains information from the{' '}
      <a href="https://github.com/Mictronics/aircraft-database">Mictronics Aircraft Database</a>,
      available under the <a href="https://opendatacommons.org/licenses/by/1-0/">ODC Attribution License</a>.
    </small>
  );
}
