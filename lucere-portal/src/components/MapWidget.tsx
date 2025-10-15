"use client";

import MapWidgetClient from "./MapWidgetClient";

type CampaignPoint = { name: string; coords: [number, number]; value?: number };

export function MapWidget({ points }: { points: CampaignPoint[] }) {
  return <MapWidgetClient points={points} />;
}


