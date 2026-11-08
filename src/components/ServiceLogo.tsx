import React from 'react';
import { Service } from '../data/services';

/** The real logo of a service, or a tile with its first letter where no logo is available. */
export const ServiceLogo: React.FC<{ service: Service; size?: number }> = ({ service, size = 56 }) => (
  <span
    aria-hidden="true"
    className="service-logo shrink-0 inline-flex items-center justify-center rounded-2xl font-bold"
    style={{ width: size, height: size, background: service.color, color: service.fg, fontSize: size * 0.45 }}
  >
    {service.logoPath ? (
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="currentColor">
        <path d={service.logoPath} />
      </svg>
    ) : (
      service.name.charAt(0)
    )}
  </span>
);
