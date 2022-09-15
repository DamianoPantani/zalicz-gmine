import React, { useEffect, useState } from "react";
import { FeatureGroup, MapContainer, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GminaBounds } from "./types";
import { getAllGminas } from "./api";

export const Map: React.FC = () => {
  const [gminas, setGminas] = useState<GminaBounds[]>([]);
  const [isLoading, setLoading] = useState(false); // TODO: loading spinner

  useEffect(() => {
    setLoading(true);

    getAllGminas()
      .then((res) => setGminas(res.data))
      .finally(() => setLoading(false));
  }, []);

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
