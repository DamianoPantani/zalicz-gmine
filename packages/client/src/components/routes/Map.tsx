import React, { useEffect, useMemo, useState } from "react";
import {
  Circle,
  FeatureGroup,
  MapContainer,
  Polygon,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
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
} from "../../api";
import { useSessionStore } from "../../SessionContext";

const DEFAULT_ZOOM_LEVEL = 7;

export const Map: React.FC = () => {
  // TODO: different paths when on different zoom level (performance)
  return (
    <MapContainer
      center={[52.0691, 19.4797]}
      zoom={DEFAULT_ZOOM_LEVEL}
      style={{ width: "100%", height: "800px" }}
    >
      <GminasMap />
    </MapContainer>
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

  console.log(capitalCitiesCoords);

  useEffect(() => {
    if (zoomLevel > 9) {
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
                  click: () => console.log(gmina.name),
                }}
                key={i}
                positions={gmina.coords}
                stroke
              />
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
                  click: () => console.log(gmina.name),
                }}
                key={i}
                positions={gmina.coords}
                stroke
              />
            ))}
          </FeatureGroup>
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
        </>
      )}
    </>
  );
};

// TODO:
/*

var deletedStyle = {
  color: "#441212",
  fillOpacity: 0.8,
  fillColor: "#771212",
};

var addedStyle = {
  color: "#7d8822",
  fillOpacity: 0.5,
  fillColor: "#dcfc26",
};
*/
