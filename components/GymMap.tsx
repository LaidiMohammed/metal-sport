'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Loader2 } from 'lucide-react';

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
    fetch(`/api/overpass?mode=${mode}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { console.error('Overpass error:', data.error); setLoading(false); return; }
        setPois(data.elements || []);
        setCount(data.count || 0);
        setLoading(false);
      })
      .catch((e) => { console.error('Fetch error:', e); setLoading(false); });
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
