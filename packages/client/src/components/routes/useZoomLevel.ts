import { useMemo, useState } from "react";
import { LeafletEventHandlerFnMap } from "leaflet";
import { useMapEvents } from "react-leaflet";

export const DEFAULT_ZOOM_LEVEL = 7;

export const useZoomLevel = () => {
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_LEVEL);
  const events = useMemo(
    (): LeafletEventHandlerFnMap => ({
      zoomend: (e) =>
        setZoomLevel(e.target?._animateToZoom ?? DEFAULT_ZOOM_LEVEL),
    }),
    []
  );

  useMapEvents(events);

  return zoomLevel;
};
