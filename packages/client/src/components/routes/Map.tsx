import React, { useCallback, useEffect } from "react";
import cx from "classnames";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { useTranslation } from "react-i18next";

import { getCapitalCitiesCoords } from "../../api/requests";
import { RequestResults, useAsync } from "../../api/useAsync";
import { Button } from "../forms/Button";
import { DatePicker } from "../forms/DatePicker";
import { LoadingSpinner } from "../LoadingSpinner";
import { Toast, useToast } from "../toast";

import { MapProvider, useMapContext } from "./MapContext";
import { CapitalsLayer, GminasLayer } from "./MapLayers";
import { DEFAULT_ZOOM_LEVEL, useZoomLevel } from "./useZoomLevel";
import styles from "./Map.module.scss";
import "leaflet/dist/leaflet.css";

const CAPITALS_ZOOM_LEVEL = 9;
const polandGeoCenter: LatLngTuple = [52.0691, 19.4797];

export const Map: React.FC = () => {
  return (
    <MapProvider>
      <MapConsumer />
    </MapProvider>
  );
};

const MapConsumer: React.FC = () => {
  const { hasChanges, saveChanges, isSaving, setVisitDate, visitDate } =
    useMapContext();
  const { t } = useTranslation();
  const toast = useToast();
  const { openError } = toast;

  const saveChangesAndNotifyUser = useCallback(async () => {
    try {
      await saveChanges();
    } catch (e) {
      const { error } = e as RequestResults<void>;
      openError(t("form.map.saveError", { error }));
    }
  }, [saveChanges, openError, t]);

  return (
    <div>
      <Toast toast={toast} />
      <MapContainer
        center={polandGeoCenter}
        zoom={DEFAULT_ZOOM_LEVEL}
        className={styles.mapContainer}
      >
        <GminasMap />
      </MapContainer>
      {/* TODO: style date picker and save button */}
      <DatePicker onChange={setVisitDate} value={visitDate} />
      <Button
        disabled={!hasChanges}
        isLoading={isSaving}
        onClick={saveChangesAndNotifyUser}
      >
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
    error: capitalCitiesError,
  } = useAsync(getCapitalCitiesCoords);
  const {
    isInitialized,
    isSaving,
    initializingError,
    visitedGminas,
    unvisitedGminas,
    gminasToAdd,
    gminasToRemove,
  } = useMapContext();

  const shouldFetchCapitals =
    zoomLevel > CAPITALS_ZOOM_LEVEL &&
    !capitalCitiesCoords &&
    !capitalCitiesError &&
    !isLoadingCapitalCitiesCoords;

  const strokeWidth = zoomLevel / 8;

  useEffect(() => {
    shouldFetchCapitals && runGetCapitalCitiesCoords();
  }, [shouldFetchCapitals, runGetCapitalCitiesCoords]);

  return (
    <>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {initializingError ? (
        <div className={cx(styles.fillContainer, styles.error)}>
          {initializingError}
        </div>
      ) : (
        isInitialized && (
          <>
            <GminasLayer
              gminas={visitedGminas}
              stroke="#919102"
              fill="#bbbb00"
              strokeWidth={strokeWidth}
            >
              ✅
            </GminasLayer>

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
        )
      )}

      {(!isInitialized || isSaving) && (
        <div className={styles.fillContainer}>
          <LoadingSpinner size="lg" />
        </div>
      )}
    </>
  );
};
