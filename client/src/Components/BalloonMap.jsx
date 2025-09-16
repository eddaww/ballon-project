import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { fetchBalloonData, fetchBalloonHistory } from "../utils/fetchBalloonData";
import { showBalloonPopup, getBalloonTrack } from "../utils/balloonHelpers";

import "../styles/BalloonMap.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function BalloonMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-119.4179, 36.7783],
      zoom: 5,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }));

    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        placeholder: "Search for a place",
      }),
      "top-left"
    );

    map.on("load", () => {
      loadBalloons(map);
    });

    return () => map.remove();
  }, []);

  async function loadBalloons(map) {
    const balloons = await fetchBalloonData("00");

    if (!balloons || balloons.length === 0) {
      console.warn("No balloon data found");
      return;
    }

    const geojson = {
      type: "FeatureCollection",
      features: balloons.map((b, i) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [b[1], b[0]] },
        properties: { id: i, height: b[2] },
      })),
    };

    if (map.getSource("balloons")) {
      ["clusters", "cluster-count", "unclustered-point"].forEach((layer) => {
        if (map.getLayer(layer)) map.removeLayer(layer);
      });
      map.removeSource("balloons");
    }

    map.addSource("balloons", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "balloons",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#51bbd6",
        "circle-radius": 20,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "balloons",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 14,
      },
    });

    map.loadImage("/balloon.png", (error, image) => {
      if (error) return console.error("Failed to load icon:", error);
      if (!map.hasImage("balloon-icon")) map.addImage("balloon-icon", image);

      map.addLayer(
        {
          id: "unclustered-point",
          type: "symbol",
          source: "balloons",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": "balloon-icon",
            "icon-size": 0.05,
            "icon-allow-overlap": true,
          },
        },
        "clusters"
      );
    });

    map.on("click", "unclustered-point", (e) => {
      const feature = e.features[0];
      const { id, height } = feature.properties;
      const [lon, lat] = feature.geometry.coordinates;
      showBalloonPopup(map, id, lon, lat, height);
    });
  }

  async function handleSearch() {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const history = await fetchBalloonHistory(24);
    const { coords, features } = getBalloonTrack(history, parseInt(searchId));

    if (!coords.length) {
      alert("Balloon not found");
      return;
    }

    const [lon, lat] = coords[0];
    map.flyTo({ center: [lon, lat], zoom: 6 });

    if (map.getSource("balloon-track")) {
      map.removeLayer("balloon-track-line");
      map.removeLayer("balloon-track-points");
      map.removeSource("balloon-track");
    }

    map.addSource("balloon-track", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          { type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} },
          ...features,
        ],
      },
    });

    map.addLayer({
      id: "balloon-track-line",
      type: "line",
      source: "balloon-track",
      paint: { "line-color": "#ff0000", "line-width": 2 },
      filter: ["==", ["geometry-type"], "LineString"],
    });

    map.addLayer({
      id: "balloon-track-points",
      type: "symbol",
      source: "balloon-track",
      layout: { "icon-image": "balloon-icon", "icon-size": 0.04, "icon-allow-overlap": true },
      filter: ["==", ["geometry-type"], "Point"],
    });

    map.on("click", "balloon-track-points", (e) => {
      const f = e.features[0];
      const { id, height, hour } = f.properties;
      const [lon, lat] = f.geometry.coordinates;
      showBalloonPopup(map, id, lon, lat, height, hour);
    });
  }

  return (
    <div className="project-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter balloon ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter"){
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch}>Search balloon + show track</button>
      </div>

      <div ref={mapContainerRef} className="map-container" />
      <div className="note">
        <p>
          Since the job market is really bad right now, I am wondering if the position has already been filled.  
          I don't have much time to work on this project in the next few days, so I decided to wrap up this project and deliver the product.  
          If you are interested in this project, feel free to contact me at <span>edd01work@gmail.com</span>.  
          I am able to do more on this.  
          If you are interested in me, you can check out my project
          <a href="https://edwinproject.click" target="_blank" rel="noopener noreferrer">https://edwinproject.click</a>.  
          Only one project for now, but I am continuously delivering new projects for better job opportunities. Here is my resume<a href="https://drive.google.com/file/d/1fVZbBnr7BAc2vzR18dHcPaWf7EPraS7v/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Click here</a>  
          . Hope you like this.
        </p>
        <p className="name">Yi Tian Cai</p>
      </div>

    </div>
  );
}
