import React, { useEffect } from "react";
import cx from "classnames";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngTuple } from "leaflet";

import capitalCitiesCoords from "../../resources/capital_coords_prec_3.json";
import { LoadingSpinner } from "../LoadingSpinner";
import { useSessionStore } from "../core/SessionContext";

import { MapProvider, useMapStore } from "./MapContext";
import { MapFooter } from "./MapFooter";
import {
  CapitalsLayer,
  GminasToUnvisitLayer,
  GminasToVisitLayer,
  UnvisitedGminasLayer,
  VisitedGminasLayer,
} from "./MapLayers";
import { DEFAULT_ZOOM_LEVEL, useZoomLevel } from "./useZoomLevel";
import styles from "./Map.module.scss";
import "leaflet/dist/leaflet.css";

const CAPITALS_ZOOM_LEVEL = 8;
const polandGeoCenter: LatLngTuple = [52.0691, 19.4797];

export const Map: React.FC = () => {
  return (
    <MapProvider>
      <MapConsumer />
    </MapProvider>
  );
};

const MapConsumer: React.FC = () => {
  const initializeGminasStatus = useMapStore((s) => s.initializeGminasStatus);
  const user = useSessionStore((s) => s.user);

  useEffect(() => {
    user?.userId && initializeGminasStatus(user.userId);
  }, [user?.userId, initializeGminasStatus]);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={polandGeoCenter}
        zoom={DEFAULT_ZOOM_LEVEL}
        className={styles.map}
      >
        <GminasMap />
      </MapContainer>
      <MapFooter />
    </div>
  );
};

const GminasMap: React.FC = () => {
  const zoomLevel = useZoomLevel();
  const isInitialized = useMapStore((s) => s.isInitialized);
  const isSaving = useMapStore((s) => s.isSaving);
  const initializingError = useMapStore((s) => s.initializingError);
  const strokeWidth = zoomLevel / 8;

  return (
    <>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {initializingError ? (
        <div className={cx(styles.fillContainer, styles.error)}>
          {initializingError}
        </div>
      ) : (
        <>
          <VisitedGminasLayer strokeWidth={strokeWidth} />
          <UnvisitedGminasLayer strokeWidth={strokeWidth} />
          <GminasToVisitLayer strokeWidth={strokeWidth} />
          <GminasToUnvisitLayer strokeWidth={strokeWidth} />

          {zoomLevel >= CAPITALS_ZOOM_LEVEL && (
            <CapitalsLayer
              capitalCitiesCoords={capitalCitiesCoords as [number, number][]}
            />
          )}
        </>
      )}

      {(!isInitialized || isSaving) && (
        <div className={styles.fillContainer}>
          <LoadingSpinner size="lg" />
        </div>
      )}
    </>
  );
};
