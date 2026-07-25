import React from 'react';

/**
 * Reusable Operational Metrics Card
 * @param {object} props
 * @param {string} props.label - Label of the metric
 * @param {string|number} props.value - Display value
 * @param {string} [props.subtext] - Secondary info text
 * @param {string} [props.variant] - Visual accent style:
 * 'primary' | 'secondary' | 'tertiary' | 'error'
 */

export function StatsCard({
  label,
  value,
  subtext,
  variant = 'primary'
}) {

  return (

    <div
      className={`hud-stat-card hud-stat-${variant}`}
    >

      <div
        className="label-caps"
        style={{
          color: 'var(--on-surface-variant)',
          marginBottom: 8
        }}
      >
        {label}
      </div>


      <div
        className="font-display"
        style={{
          fontSize: 28,
          fontWeight: 700,
          color:
            variant === 'error'
              ? 'var(--error)'
              :
            variant === 'secondary'
              ? 'var(--secondary-fixed-dim)'
              :
            variant === 'tertiary'
              ? 'var(--tertiary-fixed-dim)'
              :
              'var(--primary)'
        }}
      >
        {value}
      </div>


      {subtext && (

        <div
          style={{
            fontSize: 11,
            color: 'var(--on-surface-variant)',
            marginTop: 6
          }}
        >
          {subtext}
        </div>

      )}

    </div>

  );

}