import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Circle,
  FeatureGroup,
  MapContainer,
  Polygon,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import { useTranslation } from "react-i18next";
import {
  Coords,
  GminaCoords,
  UserGminasStatus,
} from "@damianopantani/zaliczgmine-server";
import "leaflet/dist/leaflet.css";
import {
  getAllGminas,
  getCapitalCitiesCoords,
  getCheckedGminaIds,
  updateGminas,
} from "../../api";
import { useSessionStore } from "../../SessionContext";
import {
  toggleUnvisitedGmina,
  toggleVisitedGmina,
} from "./useGminasStatusReducer";
import { MapProvider, useMapContext } from "./MapContext";
import { Button } from "../forms/Button";

const DEFAULT_ZOOM_LEVEL = 7;
const CAPITALS_ZOOM_LEVEL = 9;

export const MapPROTOTYPE: React.FC = () => {
  // TODO: different paths when on different zoom level (performance)
  return (
    <MapProvider>
      <Map />
    </MapProvider>
  );
};

const Map: React.FC = () => {
  const { apiState, gminasToAdd, gminasToRemove } = useMapContext();
  const [isSaving, setSaving] = useState(false);
  const { t } = useTranslation();
  const noChanges = !gminasToAdd.length && !gminasToRemove.length;

  const saveChanges = useCallback(() => {
    setSaving(true);
    updateGminas({
      date: { day: 2, month: 9, year: 2022 }, // TODO: inputs
      status: apiState,
    })
      .then() // TODO: commit local map and notify user
      .finally(() => setSaving(false));
  }, [apiState]);

  return (
    <div>
      <MapContainer
        center={[52.0691, 19.4797]}
        zoom={DEFAULT_ZOOM_LEVEL}
        style={{ width: "100%", height: "800px" }}
      >
        <GminasMap />
      </MapContainer>
      <Button disabled={noChanges} isLoading={isSaving} onClick={saveChanges}>
        {t("form.map.save")}
      </Button>
    </div>
  );
};

const GminasMap: React.FC = () => {
  const user = useSessionStore((s) => s.user);
  const [gminas, setGminas] = useState<GminaCoords[]>([]);
  const [capitalCitiesCoords, setCapitalCitiesCoords] = useState<Coords>();
  const [isLoadingCapitalCitiesCoords, setLoadingCapitalCitiesCoords] = // todo: loading spinner
    useState(false);
  const [{ checkedGminaIds }, setCheckedGminaIds] = useState<UserGminasStatus>({
    checkedGminaIds: [],
  });
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_LEVEL);
  const [isLoading, setLoading] = useState(false); // TODO: loading spinner
  const { gminasToAdd, gminasToRemove, dispatch } = useMapContext();

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });
  const userId = user?.userId;

  // TODO: `group` (single loop run)
  const visitedGminas = useMemo(
    () => gminas.filter((g) => checkedGminaIds.includes(g.id)),
    [gminas, checkedGminaIds]
  );
  const unvisitedGminas = useMemo(
    () => gminas.filter((g) => !checkedGminaIds.includes(g.id)),
    [gminas, checkedGminaIds]
  );

  useEffect(() => {
    if (userId) {
      setLoading(true);

      // TODO: error handing
      Promise.all([
        getAllGminas().then(setGminas),
        getCheckedGminaIds(userId).then(setCheckedGminaIds),
      ]).finally(() => setLoading(false));
    }
  }, [userId]);

  useEffect(() => {
    if (zoomLevel > CAPITALS_ZOOM_LEVEL) {
      if (!capitalCitiesCoords && !isLoadingCapitalCitiesCoords) {
        setLoadingCapitalCitiesCoords(true);
        getCapitalCitiesCoords()
          .then(setCapitalCitiesCoords)
          .catch(() => setCapitalCitiesCoords([])) // do not retry in case of errors
          .finally(() => setLoadingCapitalCitiesCoords(false));
      }
    }
  }, [zoomLevel, capitalCitiesCoords, isLoadingCapitalCitiesCoords]);

  return (
    <>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {!isLoading && (
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
