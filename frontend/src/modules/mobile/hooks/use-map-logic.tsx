import { useState, useRef, useEffect, useCallback } from "react";
import { POI, DraftPOI } from "../types/map";

export function useMapLogic(initialPois: POI[]) {
  const mapRef = useRef<any>(null);
  const [pois, setPois] = useState<POI[]>(initialPois);
  const [userPos, setUserPos] = useState<{ longitude: number; latitude: number } | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [draftPOI, setDraftPOI] = useState<DraftPOI | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => setUserPos({ longitude: pos.coords.longitude, latitude: pos.coords.latitude }),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  const locateUser = useCallback(() => {
    if (userPos && mapRef.current) {
      mapRef.current.flyTo({
        center: [userPos.longitude, userPos.latitude],
        zoom: 16,
        duration: 1500
      });
    }
  }, [userPos]);

  const openPOI = useCallback((poi: POI) => {
    setSelectedPOI(poi);
    mapRef.current?.flyTo({
      center: [poi.longitude, poi.latitude],
      zoom: 18.5,
      duration: 1200,
      essential: true
    });
  }, []);

  const closePOI = useCallback(() => {
    setSelectedPOI(null);
  }, []);

  const saveNewPOI = (data: Omit<POI, "id" | "latitude" | "longitude" | "incident">) => {
    if (!draftPOI) return;
    const newPOI: POI = { 
      id: String(Date.now()), 
      ...draftPOI, 
      ...data, 
      incident: null 
    };
    setPois(prev => [...prev, newPOI]);
    setDraftPOI(null);
    setIsAddingMode(false);
  };

  const updatePOI = (updatedPOI: POI) => {
    setPois(prev => prev.map(p => p.id === updatedPOI.id ? updatedPOI : p));
    setSelectedPOI(updatedPOI);
  };

  const deletePOI = (id: String) => {
    setPois(prev => prev.filter(p => p.id !== id));
    setSelectedPOI(null);
  };

  const resolveIncident = (poiId: String) => {
    setPois(prev => prev.map(p => 
      p.id === poiId ? { ...p, incident: null } : p
    ));
    if (selectedPOI?.id === poiId) {
      setSelectedPOI({ ...selectedPOI, incident: null });
    }
  };

  return {
    mapRef, pois, userPos, selectedPOI, isAddingMode, draftPOI,
    setSelectedPOI, setIsAddingMode, setDraftPOI, setPois,
    locateUser,
    openPOI, 
    closePOI,
    saveNewPOI, 
    updatePOI, 
    deletePOI, 
    resolveIncident
  };
}