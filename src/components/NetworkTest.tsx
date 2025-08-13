'use client';

import { useEffect, useState } from 'react';

export default function NetworkTest() {
  const [tests, setTests] = useState({
    openstreetmap: { status: 'testing', message: 'Testing...' },
    leafletCdn: { status: 'testing', message: 'Testing...' },
    internet: { status: 'testing', message: 'Testing...' }
  });

  useEffect(() => {
    const runTests = async () => {
      // Test 1: OpenStreetMap tiles
      try {
        const osmResponse = await fetch('https://tile.openstreetmap.org/0/0/0.png', { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        setTests(prev => ({
          ...prev,
          openstreetmap: { status: 'success', message: 'OpenStreetMap tiles accessible' }
        }));
      } catch (error) {
        setTests(prev => ({
          ...prev,
          openstreetmap: { status: 'error', message: `OpenStreetMap error: ${error}` }
        }));
      }

      // Test 2: Leaflet CDN
      try {
        const leafletResponse = await fetch('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        setTests(prev => ({
          ...prev,
          leafletCdn: { status: 'success', message: 'Leaflet CDN accessible' }
        }));
      } catch (error) {
        setTests(prev => ({
          ...prev,
          leafletCdn: { status: 'error', message: `Leaflet CDN error: ${error}` }
        }));
      }

      // Test 3: General internet connectivity
      try {
        const internetResponse = await fetch('https://httpbin.org/get', { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        setTests(prev => ({
          ...prev,
          internet: { status: 'success', message: 'Internet connection working' }
        }));
      } catch (error) {
        setTests(prev => ({
          ...prev,
          internet: { status: 'error', message: `Internet error: ${error}` }
        }));
      }
    };

    runTests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '🔄';
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Network Connectivity Test</h3>
      <div className="space-y-3">
        {Object.entries(tests).map(([testName, result]) => (
          <div key={testName} className={`p-3 border rounded-lg ${getStatusColor(result.status)}`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{getStatusIcon(result.status)}</span>
              <span className="font-medium capitalize">{testName.replace(/([A-Z])/g, ' $1')}</span>
            </div>
            <p className="text-sm mt-1 ml-7">{result.message}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium mb-2">Troubleshooting Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• If OpenStreetMap fails: Check firewall/proxy settings</li>
          <li>• If Leaflet CDN fails: Try using local Leaflet installation</li>
          <li>• If all fail: Check internet connection</li>
          <li>• Corporate networks may block external map services</li>
        </ul>
      </div>
    </div>
  );
}
