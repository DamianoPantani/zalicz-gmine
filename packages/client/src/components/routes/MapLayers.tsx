import React from "react";
import { Coords, GminaCoords } from "@damianopantani/zaliczgmine-server";
import { Tooltip, Polygon, Circle, FeatureGroup } from "react-leaflet";

import { useMapContext } from "./MapContext";

type GminasLayerProps = {
  stroke: string;
  fill: string;
  opacity?: number;
  strokeWidth: number;
  gminas: GminaCoords[];
};

type CapitalsLayerCoords = {
  capitalCitiesCoords?: Coords;
};

export const GminasLayer = ({
  stroke,
  fill,
  opacity = 0.5,
  strokeWidth,
  gminas,
}: GminasLayerProps) => {
  const { toggleVisited } = useMapContext();

  return (
    <FeatureGroup
      pathOptions={{
        color: stroke,
        fillColor: fill,
        fillOpacity: opacity,
        weight: strokeWidth,
      }}
    >
      {gminas.map((gmina, i) => (
        <Polygon
          key={i}
          positions={gmina.coords}
          stroke
          eventHandlers={{ click: () => toggleVisited(gmina) }}
        >
          <Tooltip sticky opacity={0.8} direction="top">
            <strong>{gmina.name}</strong>
          </Tooltip>
        </Polygon>
      ))}
    </FeatureGroup>
  );
};

export const CapitalsLayer = ({ capitalCitiesCoords }: CapitalsLayerCoords) => {
  return (
    <FeatureGroup
      pathOptions={{ fillColor: "#000000", fillOpacity: 0.3, weight: 0 }}
    >
      {capitalCitiesCoords?.map((coords, i) => (
        <Circle key={i} center={coords} radius={250} />
      ))}
    </FeatureGroup>
  );
};
