"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

type CampaignPoint = { name: string; coords: [number, number]; value?: number };

export default function MapWidgetClient({ points }: { points: CampaignPoint[] }) {
  function FitToPoints({ pts }: { pts: CampaignPoint[] }) {
    const map = useMap();
    useEffect(() => {
      if (!pts || pts.length === 0) return;
      const bounds = L.latLngBounds(pts.map((p) => p.coords));
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 8 });
    }, [pts, map]);
    return null;
  }
  return (
    <div className="card overflow-hidden">
      <div className="px-4 pt-3 text-sm text-gray-400">Live Campaign Map</div>
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: 220, width: "100%" }}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; OSM'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToPoints pts={points} />
          {points.map((p) => (
            <CircleMarker
              key={p.name}
              center={p.coords}
              radius={8}
              pathOptions={{ color: "#f59e0b", fillColor: "#ff7a00", fillOpacity: 0.85 }}
            >
              <Popup>{p.name}</Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
}


