import React, { PropsWithChildren } from "react";
import { Coords, GminaCoords } from "@damianopantani/zaliczgmine-server";
import { Tooltip, Polygon, Circle, FeatureGroup } from "react-leaflet";

import { useMapContext } from "./MapContext";
import styles from "./GminasLayer.module.scss";

type GminasLayerProps = PropsWithChildren<{
  stroke: string;
  fill: string;
  opacity?: number;
  strokeWidth: number;
  gminas: GminaCoords[];
}>;

type CapitalsLayerCoords = {
  capitalCitiesCoords?: Coords;
};

export const GminasLayer = ({
  stroke,
  fill,
  opacity = 0.5,
  strokeWidth,
  gminas,
  children,
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
          <Tooltip
            sticky
            opacity={0.8}
            direction="right"
            className={styles.tooltip}
          >
            <span>{gmina.name}</span>
            {children}
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
