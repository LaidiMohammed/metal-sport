'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Loader2 } from 'lucide-react';

const GYM_LAT = 35.6993197;
const GYM_LNG = -0.6195929;

interface POI {
  lat: number;
  lng: number;
  name: string;
}

const MapContent = dynamic(() => import('./GymMapInner'), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-2xl">
    <Loader2 className="w-6 h-6 text-[#00d4aa] animate-spin" />
  </div>
) });

export function GymMap({ mode }: { mode: 'gym' | 'douches' | 'restaurants' }) {
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (mode === 'gym') { setPois([]); setCount(0); return; }

    setLoading(true);
    const query = mode === 'douches'
      ? `[out:json];(node["amenity"="hammam"](around:2000,${GYM_LAT},${GYM_LNG});node["shop"="hammam"](around:2000,${GYM_LAT},${GYM_LNG});node["amenity"~"bathhouse|sauna|public_bath"](around:2000,${GYM_LAT},${GYM_LNG}););out center 20;`
      : `[out:json];(node["amenity"="restaurant"](around:2000,${GYM_LAT},${GYM_LNG});node["amenity"="fast_food"](around:2000,${GYM_LAT},${GYM_LNG}););out center 20;`;

    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(data => {
        const results: POI[] = (data.elements || []).map((el: any) => ({
          lat: el.lat || el.center?.lat || GYM_LAT,
          lng: el.lon || el.center?.lon || GYM_LNG,
          name: el.tags?.name || el.tags?.['name:fr'] || el.tags?.amenity || (mode === 'douches' ? 'Hammam' : 'Restaurant'),
        }));
        setPois(results);
        setCount(results.length);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [mode]);

  return (
    <div className="relative w-full h-full">
      <MapContent pois={pois} mode={mode} />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl z-[1000]">
          <Loader2 className="w-6 h-6 text-[#00d4aa] animate-spin" />
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-black/70 backdrop-blur-md rounded-xl px-5 py-3 border border-white/[0.06] z-[1000]">
        <MapPin className="w-5 h-5 text-[#00d4aa] flex-shrink-0" />
        <span className="text-sm text-white/80 font-medium">
          {mode === 'gym'
            ? 'Metal Sport Boukli — Oran'
            : mode === 'douches'
            ? `${count} douches & hammams à proximité`
            : `${count} restaurants à proximité`}
        </span>
      </div>
    </div>
  );
}
