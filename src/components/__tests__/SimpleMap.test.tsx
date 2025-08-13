/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SimpleMap from '../SimpleMap';

// Mock Leaflet
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    setView: jest.fn(),
    remove: jest.fn(),
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  marker: jest.fn(() => ({
    bindPopup: jest.fn(),
  })),
  layerGroup: jest.fn(() => ({
    addTo: jest.fn(),
    clearLayers: jest.fn(),
    addLayer: jest.fn(),
    getLayers: jest.fn(() => []),
  })),
  FeatureGroup: jest.fn(() => ({
    getBounds: jest.fn(() => ({
      pad: jest.fn(() => ({})),
    })),
  })),
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: jest.fn(),
    },
  },
}));

describe('SimpleMap', () => {
  const defaultProps = {
    center: [43.7, -79.4] as [number, number],
    zoom: 10,
    height: '400px',
    markers: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SimpleMap {...defaultProps} />);
    expect(screen.getByText('Loading map...')).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    const { container } = render(
      <SimpleMap {...defaultProps} height="500px" />
    );
    
    const mapContainer = container.querySelector('.map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('handles markers prop correctly', async () => {
    const markers = [
      {
        position: [43.7, -79.4] as [number, number],
        popup: 'Test marker',
      },
    ];

    render(<SimpleMap {...defaultProps} markers={markers} />);
    
    // Should show loading initially
    expect(screen.getByText('Loading map...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SimpleMap {...defaultProps} className="custom-class" />
    );
    
    const mapContainer = container.querySelector('.map-container.custom-class');
    expect(mapContainer).toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Mock import to throw an error
    jest.doMock('leaflet', () => {
      throw new Error('Failed to load Leaflet');
    });

    render(<SimpleMap {...defaultProps} />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Failed to initialize map')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
