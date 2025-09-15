import mapboxgl from "mapbox-gl";

export function showBalloonPopup(map, id, lon, lat, height, hour = null) {
  new mapboxgl.Popup()
    .setLngLat([lon, lat])
    .setHTML(`
      <h3>Balloon #${id}</h3>
      <p>Height: ${height} m</p>
      ${hour !== null ? `<p>${hour} hours ago</p>` : ""}
      
    `)
    .addTo(map);
}

export function getBalloonTrack(history, balloonId) {
  const coords = [];
  const features = [];

  history.forEach((hourData, h) => {
    if (!hourData || !hourData[balloonId]) return;
    const [lat, lon, height] = hourData[balloonId];
    coords.push([lon, lat]);
    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: [lon, lat] },
      properties: { id: balloonId, height, hour: h },
    });
  });

  return { coords, features };
}
