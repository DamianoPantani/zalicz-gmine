import React, { PropsWithChildren } from "react";
import { Coords, GminaCoords } from "@damianopantani/zaliczgmine-server";
import { Tooltip, Polygon, Circle, FeatureGroup } from "react-leaflet";

import { useMapStore } from "./MapContext";
import styles from "./GminasLayer.module.scss";

type GminasLayerProps = { strokeWidth: number };

type AbstractGminasLayerProps = PropsWithChildren<
  GminasLayerProps & {
    stroke: string;
    fill: string;
    opacity?: number;
    gminas: GminaCoords[];
  }
>;

type CapitalsLayerCoords = {
  capitalCitiesCoords: Coords;
};

type VoivodeshipsLayerCoords = {
  voivodeships: GminaCoords[];
};

export const VisitedGminasLayer = ({ strokeWidth }: GminasLayerProps) => {
  const visitedGminas = useMapStore((s) => s.visitedGminas);

  return (
    <GminasLayer
      gminas={visitedGminas}
      stroke="#290"
      fill="#290"
      strokeWidth={strokeWidth}
    >
      ✅
    </GminasLayer>
  );
};

export const UnvisitedGminasLayer = ({ strokeWidth }: GminasLayerProps) => {
  const unvisitedGminas = useMapStore((s) => s.unvisitedGminas);

  return (
    <GminasLayer
      gminas={unvisitedGminas}
      stroke="#b70"
      fill="#d92"
      opacity={0.3}
      strokeWidth={strokeWidth}
    ></GminasLayer>
  );
};

export const GminasToVisitLayer = ({ strokeWidth }: GminasLayerProps) => {
  const gminasToAdd = useMapStore((s) => s.gminasToAdd);

  return (
    <GminasLayer
      gminas={gminasToAdd}
      stroke="#992"
      fill="#df0"
      strokeWidth={strokeWidth}
    >
      ➕
    </GminasLayer>
  );
};

export const GminasToUnvisitLayer = ({ strokeWidth }: GminasLayerProps) => {
  const gminasToRemove = useMapStore((s) => s.gminasToRemove);

  return (
    <GminasLayer
      gminas={gminasToRemove}
      stroke="#441212"
      fill="#771212"
      strokeWidth={strokeWidth}
    >
      ❌
    </GminasLayer>
  );
};

const GminasLayer = ({
  stroke,
  fill,
  opacity = 0.5,
  strokeWidth,
  gminas,
  children,
}: AbstractGminasLayerProps) => {
  const toggleVisited = useMapStore((s) => s.toggleVisited);

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
      bubblingMouseEvents
      interactive={false}
      pathOptions={{ fillColor: "#000000", fillOpacity: 0.3, weight: 0 }}
    >
      {capitalCitiesCoords.map((coords, i) => (
        <Circle key={i} center={coords} radius={350} />
      ))}
    </FeatureGroup>
  );
};

export const VoivodeshipsLayer = ({
  voivodeships,
}: VoivodeshipsLayerCoords) => {
  return (
    <FeatureGroup
      bubblingMouseEvents
      interactive={false}
      pathOptions={{
        color: "#000000",
        weight: 1,
      }}
    >
      {voivodeships.map((voivodeship, i) => (
        <Polygon key={i} positions={voivodeship.coords} stroke />
      ))}
    </FeatureGroup>
  );
};
