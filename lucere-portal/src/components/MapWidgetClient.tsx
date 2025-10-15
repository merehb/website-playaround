"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

type CampaignPoint = { name: string; coords: [number, number]; value?: number };

export default function MapWidgetClient({ points }: { points: CampaignPoint[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 pt-3 text-sm text-gray-400">Live Campaign Map</div>
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: 220, width: "100%" }}
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OSM'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <CircleMarker
            key={p.name}
            center={p.coords}
            radius={8}
            pathOptions={{ color: "#f59e0b", fillColor: "#ff7a00", fillOpacity: 0.8 }}
          >
            <Popup>{p.name}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}


