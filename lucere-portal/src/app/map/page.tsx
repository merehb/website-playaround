"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons in Next/Leaflet
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPage() {
  const [points, setPoints] = React.useState<{ name: string; lat: number; lng: number; city: string; impressions: number }[]>([]);

  React.useEffect(() => {
    (async () => {
      const res = await fetch('/api/brand/locations');
      if (!res.ok) return;
      const data = await res.json();
      setPoints(data.points || []);
    })();
  }, []);

  function FitToPoints({ pts }: { pts: { lat: number; lng: number }[] }) {
    const map = useMap();
    React.useEffect(() => {
      if (!pts || pts.length === 0) return;
      const bounds = L.latLngBounds(pts.map((p) => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }, [pts, map]);
    return null;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Network Map</h1>
      <div className="card overflow-hidden">
        <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: 480, width: "100%" }} scrollWheelZoom={true} zoomControl={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitToPoints pts={points} />
          {points.map((p) => (
            <CircleMarker key={`${p.name}-${p.lat}-${p.lng}`} center={[p.lat, p.lng]} radius={9} pathOptions={{ color: "#f59e0b", fillColor: "#ff7a00", fillOpacity: 0.85 }}>
              <Popup>
                <div className="text-sm">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-gray-400">{p.city}</div>
                  <div>Impressions (30d): {p.impressions.toLocaleString()}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}


