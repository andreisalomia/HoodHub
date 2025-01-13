"use client";
import React, { useEffect, useState } from "react";
import Map, { Layer, Source, MapLayerMouseEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYW5kcmVpc2Fsb21pYSIsImEiOiJjbTRlODg3enMwdnUwMmlzYXVqMzh3bXRzIn0.BXOCj0oiZqI2naZHOGBuLw";

export default function EventHeatmap() {
  const [geoJsonData, setGeoJsonData] = useState<any>({
    type: "FeatureCollection",
    features: [],
  });

  const [hoveredEvent, setHoveredEvent] = useState<any | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false); // Track hover on the card

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: events, error } = await supabase
        .from("events")
        .select("id, title, description, latitude, longitude");

      if (error) throw error;

      const features = events
        .filter((event) => event.latitude && event.longitude)
        .map((event) => ({
          type: "Feature",
          properties: {
            id: event.id,
            title: event.title,
            description: event.description,
          },
          geometry: {
            type: "Point",
            coordinates: [event.longitude, event.latitude],
          },
        }));

      setGeoJsonData({ type: "FeatureCollection", features });
    };

    fetchEvents();
  }, [supabase]);

  // Handle hover events
  const onHover = (event: MapLayerMouseEvent) => {
    if (!isCardHovered) {
      const features = event.features;
      if (features && features.length > 0) {
        setHoveredEvent(features[0].properties);
        setPopupPosition({ x: event.point.x, y: event.point.y });
      } else {
        setHoveredEvent(null);
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <Map
        initialViewState={{
          longitude: 26.1025,
          latitude: 44.4268,
          zoom: 12,
        }}
        style={{ width: "100%", height: "600px" }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        interactiveLayerIds={["heatmap-layer"]}
        onMouseMove={onHover}
        onMouseLeave={() => !isCardHovered && setHoveredEvent(null)}
      >
        <Source id="event-heatmap" type="geojson" data={geoJsonData}>
          <Layer
            id="heatmap-layer"
            type="heatmap"
            paint={{
              "heatmap-intensity": 1,
              "heatmap-radius": 25,
              "heatmap-opacity": 0.7,
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(33,102,172,0)",
                0.2,
                "rgb(103,169,207)",
                0.4,
                "rgb(209,229,240)",
                0.6,
                "rgb(253,219,199)",
                0.8,
                "rgb(239,138,98)",
                1,
                "rgb(178,24,43)",
              ],
            }}
          />
        </Source>
      </Map>

      {/* Event Card Popup */}
      {hoveredEvent && (
        <div
          style={{
            position: "absolute",
            top: popupPosition.y,
            left: popupPosition.x,
            zIndex: 1000,
          }}
          onMouseEnter={() => setIsCardHovered(true)} // Prevent hiding when hovering card
          onMouseLeave={() => {
            setIsCardHovered(false);
            setHoveredEvent(null);
          }}
        >
          <Card className="bg-white shadow-md rounded-lg p-4 w-64">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                {hoveredEvent.title}
              </CardTitle>
              <CardDescription>{hoveredEvent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/events/${hoveredEvent.id}`)}
                className="text-[#0264FA] border-[#0264FA] hover:bg-[#0264FA] hover:text-white transition"
              >
                View Event
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
