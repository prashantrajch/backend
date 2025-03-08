mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", //container ID
  //Choose from Mapbox's core stles, or make your own stle with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v-12", //style URL
  center: coordinates, // starting position [lng,lat],
  zoom: 12, //starting zoom
}); 

const marker = new mapboxgl.Marker({color: 'red'}).setLngLat(coordinates).addTo(map)
 