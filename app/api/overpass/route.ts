import { NextRequest, NextResponse } from 'next/server';

const GYM_LAT = 35.6993197;
const GYM_LNG = -0.6195929;

const QUERIES: Record<string, string> = {
  douches: `[out:json];(node["amenity"~"hammam|hamam|public_bath|bathhouse|shower"](around:3000,${GYM_LAT},${GYM_LNG});node["shop"="hammam"](around:3000,${GYM_LAT},${GYM_LNG});node["name"~"hammam|hamam|douche|bain turc|bain maure|حمام",i](around:3000,${GYM_LAT},${GYM_LNG});node["leisure"="sauna"](around:3000,${GYM_LAT},${GYM_LNG}););out center 30;`,
  restaurants: `[out:json];(node["amenity"~"restaurant|fast_food"](around:2000,${GYM_LAT},${GYM_LNG});way["amenity"~"restaurant|fast_food"](around:2000,${GYM_LAT},${GYM_LNG}););out center 30;`,
};

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('mode') || 'gym';

  if (mode === 'gym') {
    return NextResponse.json({ elements: [] });
  }

  const query = QUERIES[mode];
  if (!query) {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  }

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'MetalSportGym/1.0' },
    });
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Overpass returned invalid JSON', raw: text.slice(0, 300) }, { status: 502 });
    }

    const elements = (data.elements || []).map((el: any) => ({
      lat: el.lat || el.center?.lat || GYM_LAT,
      lng: el.lon || el.center?.lon || GYM_LNG,
      name: el.tags?.name || el.tags?.['name:fr'] || el.tags?.amenity || el.tags?.leisure || (mode === 'douches' ? 'Hammam' : 'Restaurant'),
    }));

    return NextResponse.json({ elements, count: elements.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
