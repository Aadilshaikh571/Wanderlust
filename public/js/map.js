console.log("l;dfkjasldkfs");
mapboxgl.accessToken = MapToken;
  const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center:[ 77.668749, 19.219539 ],
  zoom: 8,
});
console.log("kjhf",coordinates);
console.log("ksdfjhf",MapToken);
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat([ 77.668749, 19.219539 ])
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      "<h4>Exact Location provided after booking</h4>"
    )
  )
  .addTo(map);