import React, { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { useTranslation } from "react-i18next";

import { getCapitalCitiesCoords } from "../../api/requests";
import { useAsync } from "../../api/useAsync";
import { Button } from "../forms/Button";

import { MapProvider, useMapContext } from "./MapContext";
import { CapitalsLayer, GminasLayer } from "./MapLayers";
import { DEFAULT_ZOOM_LEVEL, useZoomLevel } from "./useZoomLevel";
import styles from "./Map.module.scss";
import "leaflet/dist/leaflet.css";

const CAPITALS_ZOOM_LEVEL = 9;
const polandGeoCenter: LatLngTuple = [52.0691, 19.4797];

export const Map: React.FC = () => {
  // TODO: different paths when on different zoom level (performance)
  return (
    <MapProvider>
      <MapConsumer />
    </MapProvider>
  );
};

const MapConsumer: React.FC = () => {
  const { hasChanges, saveChanges, isSaving } = useMapContext();
  const { t } = useTranslation();

  return (
    <div>
      <MapContainer
        center={polandGeoCenter}
        zoom={DEFAULT_ZOOM_LEVEL}
        className={styles.mapContainer}
      >
        <GminasMap />
      </MapContainer>
      <Button disabled={!hasChanges} isLoading={isSaving} onClick={saveChanges}>
        {t("form.map.save")}
      </Button>
    </div>
  );
};

const GminasMap: React.FC = () => {
  const zoomLevel = useZoomLevel();
  const {
    data: capitalCitiesCoords,
    run: runGetCapitalCitiesCoords,
    isLoading: isLoadingCapitalCitiesCoords,
  } = useAsync(getCapitalCitiesCoords);
  const {
    isInitialized, // TODO: loading spinner
    initializingError, // TODO: error handling
    visitedGminas,
    unvisitedGminas,
    gminasToAdd,
    gminasToRemove,
  } = useMapContext();

  const shouldFetchCapitals =
    zoomLevel > CAPITALS_ZOOM_LEVEL &&
    !capitalCitiesCoords &&
    !isLoadingCapitalCitiesCoords;

  const strokeWidth = zoomLevel / 8;

  useEffect(() => {
    shouldFetchCapitals && runGetCapitalCitiesCoords();
  }, [shouldFetchCapitals, runGetCapitalCitiesCoords]);

  return (
    <>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {isInitialized && (
        <>
          <GminasLayer
            gminas={visitedGminas}
            stroke="#919102"
            fill="#bbbb00"
            strokeWidth={strokeWidth}
          />

          <GminasLayer
            gminas={unvisitedGminas}
            stroke="#e88127"
            fill="#e88127"
            opacity={0.3}
            strokeWidth={strokeWidth}
          />

          <GminasLayer
            gminas={gminasToAdd}
            stroke="#7d8822"
            fill="#dcfc26"
            strokeWidth={strokeWidth}
          />

          <GminasLayer
            gminas={gminasToRemove}
            stroke="#441212"
            fill="#771212"
            strokeWidth={strokeWidth}
          />

          {zoomLevel >= CAPITALS_ZOOM_LEVEL && (
            <CapitalsLayer capitalCitiesCoords={capitalCitiesCoords} />
          )}
        </>
      )}
    </>
  );
};
