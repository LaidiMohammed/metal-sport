// Test broader queries for douches and restaurants
const GYM_LAT = 35.6993197;
const GYM_LNG = -0.6195929;

const queries = [
  // Broader hammam/douche query - more tag variations
  {
    label: 'Douches (broad)',
    q: `[out:json];(node["amenity"~"hammam|public_bath|bathhouse|bath|shower|sauna|hamam"](around:5000,${GYM_LAT},${GYM_LNG});way["amenity"~"hammam|public_bath|bathhouse|bath|shower|sauna|hamam"](around:5000,${GYM_LAT},${GYM_LNG});node["shop"="hammam"](around:5000,${GYM_LAT},${GYM_LNG});node["leisure"="sauna"](around:5000,${GYM_LAT},${GYM_LNG});node["name"~"hammam|hamam|douche|bain|bain turc|bain maure|حمام",i](around:5000,${GYM_LAT},${GYM_LNG}););out center 20;`
  },
  // Restaurants - original query but also check ways
  {
    label: 'Restaurants (broad)',
    q: `[out:json];(node["amenity"~"restaurant|fast_food"](around:2000,${GYM_LAT},${GYM_LNG});way["amenity"~"restaurant|fast_food"](around:2000,${GYM_LAT},${GYM_LNG}););out center 20;`
  }
];

(async () => {
  for (const { label, q } of queries) {
    const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(q);
    console.log('\n' + label + ':');
    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'MetalSportGym/1.0', 'Accept': 'application/json' }
      });
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); } catch(e) { console.log('  Not JSON:', text.substring(0, 100)); continue; }
      console.log('  Results: ' + (data.elements ? data.elements.length : 0));
      if (data.elements && data.elements.length > 0) {
        data.elements.slice(0, 5).forEach(function(el) {
          var t = el.tags || {};
          console.log('  - ' + (t.name || t['name:fr'] || t.amenity || t.shop || '(unnamed)') + ' (' + el.type + ')');
        });
      }
    } catch(e) {
      console.log('  ERROR: ' + e.message);
    }
  }
})();
