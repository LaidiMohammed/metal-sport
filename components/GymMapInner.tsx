'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GYM_LAT = 35.6993197;
const GYM_LNG = -0.6195929;

interface POI {
  lat: number;
  lng: number;
  name: string;
}

function FitBounds({ pois }: { pois: POI[] }) {
  const map = useMap();
  useEffect(() => {
    if (pois.length > 0) {
      const bounds = L.latLngBounds([[GYM_LAT, GYM_LNG]]);
      pois.forEach(p => bounds.extend([p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else {
      map.setView([GYM_LAT, GYM_LNG], 16);
    }
  }, [pois, map]);
  return null;
}

const gymIcon = L.divIcon({
  className: '',
  html: `<div style="background:#00d4aa;width:20px;height:20px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function GymMapInner({ pois, mode }: { pois: POI[]; mode: string }) {
  return (
    <MapContainer
      center={[GYM_LAT, GYM_LNG]}
      zoom={16}
      className="w-full h-full rounded-2xl"
      style={{ filter: 'invert(0.9) hue-rotate(160deg)' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds pois={pois} />
      <Marker position={[GYM_LAT, GYM_LNG]} icon={gymIcon}>
        <Popup>Metal Sport Boukli — Oran</Popup>
      </Marker>
      {mode !== 'gym' && (
        <LayerGroup>
          {pois.map((poi, i) => (
            <Marker
              key={i}
              position={[poi.lat, poi.lng]}
              icon={L.divIcon({
                className: '',
                html: `<div style="background:${mode === 'douches' ? '#3b82f6' : '#f59e0b'};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7],
              })}
            >
              <Popup>{poi.name}</Popup>
            </Marker>
          ))}
        </LayerGroup>
      )}
    </MapContainer>
  );
}
