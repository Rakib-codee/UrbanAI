/**
 * This file provides a single import point for all chart components
 * with fallbacks in case any component can't be found
 */

import React from 'react';
import { FallbackComponent } from '../../ui/FallbackComponent';

// AreaChart
let AreaChart;
try {
  AreaChart = require('./AreaChart').AreaChart;
} catch (e) {
  console.warn('Failed to load AreaChart component, using fallback');
  AreaChart = (props: any) => (
    <FallbackComponent componentName="AreaChart" {...props}>
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Chart Unavailable
      </div>
    </FallbackComponent>
  );
}

export { AreaChart }; 