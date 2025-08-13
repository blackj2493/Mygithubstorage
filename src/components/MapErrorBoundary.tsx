'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class MapErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if this is a map-related error
    const isMapError = error.message?.includes('Map container is already initialized') ||
                       error.message?.includes('map') ||
                       error.message?.includes('leaflet') ||
                       error.message?.includes('MapContainer');
    
    return { 
      hasError: isMapError, 
      error: isMapError ? error : undefined 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log map-related errors to avoid spam
    if (error.message?.includes('Map container is already initialized') ||
        error.message?.includes('map') ||
        error.message?.includes('leaflet') ||
        error.message?.includes('MapContainer')) {
      console.error('Map Error caught by boundary:', error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Map Loading Error
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">
              There was an issue initializing the map. This can happen in development mode 
              and is usually resolved by refreshing the page.
            </p>
            <div className="space-x-2">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={this.handleRefresh}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
