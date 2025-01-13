import EventHeatmap from "@/components/EventHeatmap";

export default function HeatmapPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-center text-3xl font-bold mb-4">Bucharest Event Heatmap</h1>
      <div className="w-[90vw] max-w-[1600px] h-[80vh] rounded-lg overflow-hidden shadow-lg">
        <EventHeatmap />
      </div>
    </div>
  );
}
