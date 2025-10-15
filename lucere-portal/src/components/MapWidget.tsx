import dynamic from "next/dynamic";

const MapWidgetClient = dynamic(() => import("./MapWidgetClient"), { ssr: false });

type CampaignPoint = { name: string; coords: [number, number]; value?: number };

export function MapWidget({ points }: { points: CampaignPoint[] }) {
  return <MapWidgetClient points={points} />;
}


