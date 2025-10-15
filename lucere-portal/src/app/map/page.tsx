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

const locations = [
  { name: "Grocery - Philadelphia", coords: [39.9526, -75.1652] as [number, number] },
  { name: "Convenience - New York", coords: [40.7128, -74.006] as [number, number] },
  { name: "Distributor - Chicago", coords: [41.8781, -87.6298] as [number, number] },
  { name: "Casino - Las Vegas", coords: [36.1699, -115.1398] as [number, number] },
];

export default function MapPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Network Map</h1>
      <div className="card overflow-hidden">
        <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: 480, width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((loc) => (
            <Marker position={loc.coords} key={loc.name} icon={icon}>
              <Popup>{loc.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}


