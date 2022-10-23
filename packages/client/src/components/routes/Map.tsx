import React, { useCallback, useEffect } from "react";
import {
  Circle,
  FeatureGroup,
  MapContainer,
  Polygon,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { useTranslation } from "react-i18next";
import { getCapitalCitiesCoords, updateGminas } from "../../api/requests";
import {
  commitMap,
  toggleUnvisitedGmina,
  toggleVisitedGmina,
} from "./useGminasStatusReducer";
import { MapProvider, useMapContext } from "./MapContext";
import { Button } from "../forms/Button";
import { useAsync } from "../../api/useAsync";
import { DEFAULT_ZOOM_LEVEL, useZoomLevel } from "./useZoomLevel";
import styles from "./Map.module.scss";

import "leaflet/dist/leaflet.css";

// TODO: import order

const CAPITALS_ZOOM_LEVEL = 9;
const polandGeoCenter: LatLngTuple = [52.0691, 19.4797];

// TODO: rename
export const MapPROTOTYPE: React.FC = () => {
  // TODO: different paths when on different zoom level (performance)
  return (
    <MapProvider>
      <Map />
    </MapProvider>
  );
};

const Map: React.FC = () => {
  const { apiState, gminasToAdd, gminasToRemove, dispatch } = useMapContext();
  const { t } = useTranslation();
  const { runWithParams: runUpdateGminas, isLoading: isSaving } =
    useAsync(updateGminas); // TODO: error handling
  const hasChanges = gminasToAdd.length || gminasToRemove.length;

  const saveChanges = useCallback(() => {
    runUpdateGminas(
      {
        date: { day: 2, month: 9, year: 2022 }, // TODO: inputs
        status: apiState,
      },
      (isSuccess) => {
        if (isSuccess) {
          dispatch(commitMap());
        }
        // TODO: notify user: toast(error ?? successMessage);
      }
    );
  }, [apiState, runUpdateGminas, dispatch]);

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
  const {
    data: capitalCitiesCoords,
    run: runGetCapitalCitiesCoords,
    isLoading: isLoadingCapitalCitiesCoords,
  } = useAsync(getCapitalCitiesCoords);

  const zoomLevel = useZoomLevel();
  const {
    isInitialized, // TODO: loading spinner
    initializingError, // TODO: error handling
    visitedGminas,
    unvisitedGminas,
    gminasToAdd,
    gminasToRemove,
    dispatch,
  } = useMapContext();

  useEffect(() => {
    if (zoomLevel > CAPITALS_ZOOM_LEVEL) {
      if (!capitalCitiesCoords && !isLoadingCapitalCitiesCoords) {
        runGetCapitalCitiesCoords();
      }
    }
  }, [
    zoomLevel,
    capitalCitiesCoords,
    runGetCapitalCitiesCoords,
    isLoadingCapitalCitiesCoords,
  ]);

  return (
    <>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {isInitialized && (
        <>
          <FeatureGroup
            key="visited"
            pathOptions={{
              color: "#919102",
              fillColor: "#bbbb00",
              fillOpacity: 0.5,
              weight: zoomLevel / 8,
            }}
          >
            {visitedGminas.map((gmina, i) => (
              <Polygon
                eventHandlers={{
                  click: () => dispatch(toggleUnvisitedGmina(gmina)),
                }}
                key={i}
                positions={gmina.coords}
                stroke
              >
                <Tooltip sticky opacity={0.8} direction="top">
                  <strong>{gmina.name}</strong>
                </Tooltip>
              </Polygon>
            ))}
          </FeatureGroup>

          <FeatureGroup
            key="unvisited"
            pathOptions={{
              color: "#e88127",
              fillOpacity: 0.3,
              fillColor: "#e88127", // TODO: color code by voivodeship
              weight: zoomLevel / 8,
            }}
          >
            {unvisitedGminas.map((gmina, i) => (
              <Polygon
                eventHandlers={{
                  click: () => dispatch(toggleVisitedGmina(gmina)),
                }}
                key={i}
                positions={gmina.coords}
                stroke
              >
                <Tooltip sticky opacity={0.8} direction="top">
                  <strong>{gmina.name}</strong>
                </Tooltip>
              </Polygon>
            ))}
          </FeatureGroup>

          <FeatureGroup
            key="toVisit"
            pathOptions={{
              color: "#7d8822",
              fillColor: "#dcfc26",
              fillOpacity: 0.5,
              weight: zoomLevel / 8,
            }}
          >
            {gminasToAdd.map((gmina, i) => (
              <Polygon
                eventHandlers={{
                  click: () => dispatch(toggleVisitedGmina(gmina)),
                }}
                key={i}
                positions={gmina.coords}
                stroke
              >
                <Tooltip sticky opacity={0.8} direction="top">
                  <strong>{gmina.name}</strong>
                </Tooltip>
              </Polygon>
            ))}
          </FeatureGroup>

          <FeatureGroup
            key="toRemove"
            pathOptions={{
              color: "#441212",
              fillColor: "#771212",
              fillOpacity: 0.5,
              weight: zoomLevel / 8,
            }}
          >
            {gminasToRemove.map((gmina, i) => (
              <Polygon
                eventHandlers={{
                  click: () => dispatch(toggleUnvisitedGmina(gmina)),
                }}
                key={i}
                positions={gmina.coords}
                stroke
              >
                <Tooltip sticky opacity={0.8} direction="top">
                  <strong>{gmina.name}</strong>
                </Tooltip>
              </Polygon>
            ))}
          </FeatureGroup>

          {zoomLevel >= CAPITALS_ZOOM_LEVEL && (
            <FeatureGroup
              key="capitals"
              pathOptions={{
                fillColor: "#000000",
                fillOpacity: 0.3,
                weight: 0,
              }}
            >
              {capitalCitiesCoords?.map((coords, i) => (
                <Circle key={i} center={coords} radius={250} />
              ))}
            </FeatureGroup>
          )}
        </>
      )}
    </>
  );
};
