import React, { useEffect, useMemo, useState } from "react";
import {
  FeatureGroup,
  MapContainer,
  Polygon,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import {
  GminaCoords,
  UserGminasStatus,
} from "@damianopantani/zaliczgmine-server";
import "leaflet/dist/leaflet.css";
import { getAllGminas, getCheckedGminaIds } from "../../api";
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

      Promise.all([
        getAllGminas().then(setGminas),
        getCheckedGminaIds(userId).then(setCheckedGminaIds),
      ]).finally(() => setLoading(false));
    }
  }, [userId]);

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
