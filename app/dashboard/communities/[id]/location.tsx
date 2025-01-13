"use client";
import React from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYW5kcmVpc2Fsb21pYSIsImEiOiJjbTRlODg3enMwdnUwMmlzYXVqMzh3bXRzIn0.BXOCj0oiZqI2naZHOGBuLw";

interface EventLocationProps {
    latitude: number;
    longitude: number;
}

export default function Location({ latitude, longitude }: EventLocationProps) {
    if (!latitude || !longitude) {
        return null;
    }
    return (
        <Map
            initialViewState={{
                longitude,
                latitude,
                zoom: 12,
            }}
            style={{ width: "100%", height: "400px" }}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v11"
        >
            <Marker longitude={longitude} latitude={latitude} />
        </Map>
    );
}