"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Network Map</h1>
      <div className="card overflow-hidden">
        <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: 480, width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((p) => (
            <Marker position={[p.lat, p.lng]} key={`${p.name}-${p.lat}-${p.lng}`} icon={icon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-gray-400">{p.city}</div>
                  <div>Impressions (30d): {p.impressions.toLocaleString()}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}


