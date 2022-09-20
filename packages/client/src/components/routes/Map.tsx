import React, { useEffect, useState } from "react";
import { FeatureGroup, MapContainer, Polygon, TileLayer } from "react-leaflet";
import { UserGminasStatus } from "@damianopantani/zaliczgmine-server";
import "leaflet/dist/leaflet.css";
import { GminaBounds } from "../../types";
import { getAllGminas, getCheckedGminas } from "../../api";
import { useSessionStore } from "../../SessionContext";

export const Map: React.FC = () => {
  const user = useSessionStore((s) => s.user);
  const [gminas, setGminas] = useState<GminaBounds[]>([]);
  const [checkedGminas, setCheckedGminas] = useState<UserGminasStatus>({
    checkedGminas: [],
  });
  const [isLoading, setLoading] = useState(false); // TODO: loading spinner

  const userId = user?.userId;

  console.log(checkedGminas);

  useEffect(() => {
    if (userId) {
      setLoading(true);

      Promise.all([
        getAllGminas().then(setGminas),
        getCheckedGminas(userId).then(setCheckedGminas),
      ]).finally(() => setLoading(false));
    }
  }, [userId]);

  // TODO: different paths when on different zoom level (performance)
  return (
    <MapContainer
      center={[52.0691, 19.4797]}
      zoom={7}
      style={{ width: "100%", height: "800px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup>
        {!isLoading &&
          gminas.map((gmina, i) => (
            <Polygon
              eventHandlers={{
                click: () => console.log(gmina.name),
              }}
              key={i}
              positions={gmina.coords}
              stroke
              fillColor="blue" // TODO stroke + fill depends on check status
            />
          ))}
      </FeatureGroup>
    </MapContainer>
  );
};
