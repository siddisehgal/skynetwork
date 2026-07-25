import React from 'react';
import "./DashboardCard.css";
/**
 * Reusable HUD Operation Panel/Card
 * @param {object} props
 * @param {string} props.title - Title of the panel
 * @param {React.ReactNode} [props.icon] - Icon shown next to title
 * @param {React.ReactNode} [props.headerActions] - Action items on the far right of the header
 * @param {React.ReactNode} props.children - Panel body contents
 */
export function DashboardCard({ title, icon, headerActions, children }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          {icon && <span className="dashboard-card-icon">{icon}</span>}
          <h3>{title}</h3>
        </div>

        {headerActions && (
          <div className="dashboard-card-actions">
            {headerActions}
          </div>
        )}
      </div>

      <div className="dashboard-card-body">
        {children}
      </div>
    </div>
  );
}