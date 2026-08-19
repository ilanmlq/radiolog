import { useEffect, useState, useCallback } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Plus, X, Loader2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMapLogic } from "../hooks/use-map-logic";
import { POIPanel } from "../../map/poi-panel";
import { AddPOIForm } from "../../map/add-poi-form";
import { IncidentList } from "../../map/incident-list";
import { POI, IncidentLevel } from "../types/map";
import { useEvent } from "@/modules/events";
import { useApi } from "@/hooks/use-api";

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const MAPTILER_HYBRIDE_KEY = import.meta.env.VITE_MAPTILER_HYBRIDE_API_KEY;
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;
const HYBRID_STYLE = `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_HYBRIDE_KEY || MAPTILER_KEY}`;

export function MapView() {
  const { selectedEventId } = useEvent();
  const api = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isHybridMode, setIsHybridMode] = useState(false);
  const [gridData, setGridData] = useState<any>(null);

  const {
    mapRef, pois, setPois, selectedPOI, setSelectedPOI,
    isAddingMode, setIsAddingMode, draftPOI, setDraftPOI,
    openPOI
  } = useMapLogic([]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({ pitch: isHybridMode ? 0 : 70, bearing: 0, duration: 800 });
    }
  }, [isHybridMode, mapRef]);

  useEffect(() => {
    fetch("/grid.json")
      .then(res => res.json())
      .then(data => setGridData(data))
      .catch(err => console.error("Erreur chargement grille:", err));
  }, []);

  const getIncidentColor = (level: string) => {
    switch (level) {
      case "3": return "text-red-400 border-red-500/50 bg-red-500/10";
      case "2": return "text-orange-400 border-orange-500/50 bg-orange-500/10";
      case "1": return "text-yellow-400 border-yellow-500/50 bg-yellow-500/10";
      default: return "text-zinc-400 border-zinc-500/50 bg-zinc-500/10";
    }
  };

  const createPOI = async (formData: any) => {
    try {
      const payload = {
        eventId: selectedEventId,
        name: formData.name,
        description: formData.description || "",
        latitude: draftPOI?.latitude,
        longitude: draftPOI?.longitude,
        categoryId: formData.type
      };

      const res = await api.post('/places', payload);
      const savedPoi = res.data;

      const newPoiForMap: POI = {
        id: String(savedPoi.id ?? savedPoi._id),
        name: savedPoi.name,
        type: savedPoi.categoryId || formData.type,
        description: savedPoi.description || "",
        latitude: Number(savedPoi.latitude),
        longitude: Number(savedPoi.longitude),
        incident: null
      };

      setPois(prevPois => [...prevPois, newPoiForMap]);
      setDraftPOI(null);
      setIsAddingMode(false);
      setSelectedPOI(newPoiForMap);
    } catch (error: any) {
      console.error("Échec de la création:", error);
      const message = error?.response?.data?.message || error?.message || "Erreur inconnue";
      alert(`Le backend a refusé l'ajout :\n${message}`);
    }
  };

  const updatePOI = async (updatedPoi: POI) => {
    try {
      await api.put(`/places/${updatedPoi.id}`, {
        name: updatedPoi.name,
        description: updatedPoi.description,
        latitude: updatedPoi.latitude,
        longitude: updatedPoi.longitude,
        categoryId: updatedPoi.type
      });

      setPois(prevPois => prevPois.map(p => p.id === updatedPoi.id ? updatedPoi : p));
      setSelectedPOI(updatedPoi);
    } catch (error: any) {
      console.error("Échec de la modification:", error);
      const message = error?.response?.data?.message || error?.message || "Erreur inconnue";
      alert(`Le backend a refusé la modification :\n${message}`);
    }
  };

  const deletePOI = async (placeId: string) => {
    try {
      await api.delete(`/places/${placeId}`);
      setPois(prevPois => prevPois.filter(p => p.id !== placeId));
      setSelectedPOI(null);
    } catch (error) {
      console.error("Échec de la suppression:", error);
      alert("Impossible de supprimer ce lieu.");
    }
  };

  const resolveIncident = async (poiId: string) => {
    const poi = pois.find(p => p.id === poiId);
    if (!poi?.incident?.statusId) return;
    try {
      await api.put(`/status/${poi.incident.statusId}`, {
        resolve: true,
        description: "Résolu depuis la map"
      });
      setPois(prev => prev.map(p => p.id === poiId ? { ...p, incident: null } : p));
      setSelectedPOI(null);
    } catch (error: any) {
      alert(error?.response?.data ? JSON.stringify(error.response.data) : "Impossible de résoudre l'incident.");
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resPlaces, resIncidents, resStatuses] = await Promise.all([
        api.get('/places?limit=100&offset=0'),
        api.get('/incidents?limit=100&offset=0'),
        api.get('/status?limit=100&offset=0').catch(() => ({ data: { items: [] } })),
      ]);

      const allIncidents = resIncidents.data?.items || [];
      const allStatuses = resStatuses.data?.items || [];

      try {
        const resCategories = await api.get('/categories');
        setCategories(resCategories.data?.items || resCategories.data || []);
      } catch {
        console.error("API Catégories injoignable");
      }

      const mergedPois: POI[] = (resPlaces.data?.items || []).map((p: any) => {
        const placeId = String(p.id ?? p._id);
        const foundIncident = allIncidents.find((inc: any) => {
          if (inc.placeId !== placeId) return false;
          const status = allStatuses.find((s: any) => s.id === inc.statusId);
          return status?.resolve === false;
        });
        return {
          id: placeId,
          name: p.name,
          type: p.categoryId || p.type || "Lieu",
          description: p.description || "",
          latitude: Number(p.latitude),
          longitude: Number(p.longitude),
          incident: foundIncident ? {
            id: String(foundIncident.id ?? foundIncident._id),
            statusId: String(foundIncident.statusId),
            level: String(foundIncident.criticality) as IncidentLevel,
            title: foundIncident.description || "Incident signalé",
            time: foundIncident.time || "",
          } : null
        };
      }).filter((p: any) => !isNaN(p.latitude) && !isNaN(p.longitude));

      setPois(mergedPois);
    } catch {
      setError("Erreur de connexion au backend.");
    } finally {
      setIsLoading(false);
    }
  }, [api, setPois]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const incidentsForList = pois
    .filter(p => p.incident !== null)
    .map(p => ({
      ...p,
      incident: { id: p.incident!.id, statusId: p.incident!.statusId, level: p.incident!.level, title: p.incident!.title, time: p.incident!.time }
    }));

  return (
    <div className="w-screen h-screen relative bg-zinc-950 flex flex-col overflow-hidden">

      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-md">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
          <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">Chargement...</p>
        </div>
      )}

      {!isLoading && incidentsForList.length > 0 && (
        <div className="hidden md:block">
          <IncidentList
            incidents={incidentsForList as any}
            onSelect={(poi) => openPOI(poi as any)}
            getIncidentColor={getIncidentColor}
          />
        </div>
      )}

      <div className="flex-1 w-full h-full relative">
        <Map
          ref={mapRef}
          initialViewState={{ longitude: 6.1153, latitude: 46.1842, zoom: 18, pitch: 70, bearing: 0 }}
          mapStyle={isHybridMode ? HYBRID_STYLE : MAP_STYLE}
          style={{ width: "100%", height: "100%" }}
          onClick={(e) => isAddingMode ? setDraftPOI({ longitude: e.lngLat.lng, latitude: e.lngLat.lat }) : setSelectedPOI(null)}
        >
          {gridData && (
            <Source id="grid" type="geojson" data={gridData}>
              <Layer id="grid-fill" type="fill" paint={{ "fill-color": "#ffffff", "fill-opacity": 0.2 }} />
              <Layer id="grid-lines" type="line" paint={{ "line-color": "#000000", "line-width": 1, "line-opacity": 0.9 }} />
              <Layer
                id="grid-labels"
                type="symbol"
                layout={{ "text-field": ["get", "label"], "text-size": 20, "text-anchor": "center" }}
                paint={{ "text-color": "#ffffff", "text-halo-color": "#000000", "text-halo-width": 1 }}
              />
            </Source>
          )}

          {pois.map((poi) => (
            <Marker key={poi.id} longitude={poi.longitude} latitude={poi.latitude} anchor="bottom"
              onClick={(e) => { e.originalEvent.stopPropagation(); openPOI(poi); }}>
              <div className="relative flex items-center justify-center cursor-pointer group">
                {poi.incident && (
                  <div className={cn(
                    "absolute h-10 w-10 rounded-full animate-ping opacity-40",
                    poi.incident.level === "3" ? "bg-red-500" : poi.incident.level === "2" ? "bg-orange-500" : "bg-yellow-500"
                  )} />
                )}
                <div className={cn(
                  "w-5 h-5 rounded-full border-4 shadow-md transition-all duration-300",
                  selectedPOI?.id === poi.id ? "bg-blue-500 border-white scale-125" :
                  poi.incident ? (poi.incident.level === "3" ? "bg-red-500 border-red-200" : "bg-orange-500 border-orange-200") : "bg-white border-zinc-900"
                )} />
              </div>
            </Marker>
          ))}

          {draftPOI && (
            <Marker longitude={draftPOI.longitude} latitude={draftPOI.latitude} anchor="bottom">
              <div className="w-5 h-5 rounded-full border-4 border-blue-400 bg-blue-600 shadow-lg animate-bounce" />
            </Marker>
          )}
        </Map>
      </div>

      {selectedPOI && (
        <POIPanel
          poi={selectedPOI}
          categories={categories}
          onClose={() => setSelectedPOI(null)}
          onResolve={resolveIncident}
          onDelete={deletePOI}
          onUpdate={updatePOI}
        />
      )}

      {draftPOI && isAddingMode && (
        <AddPOIForm
          draft={draftPOI}
          categories={categories}
          onSave={createPOI}
          onCancel={() => { setDraftPOI(null); setIsAddingMode(false); }}
        />
      )}

      <button
        onClick={() => { setIsAddingMode(!isAddingMode); setDraftPOI(null); setSelectedPOI(null); }}
        className={cn(
          "absolute top-5 right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-full text-xs font-bold uppercase shadow-lg transition-colors duration-200",
          isAddingMode ? "bg-red-600 text-white" : "bg-black text-white"
        )}
      >
        {isAddingMode ? <X size={16} /> : <Plus size={16} />}
        {isAddingMode ? "Annuler" : "Ajouter un lieu"}
      </button>

      <button
        onClick={() => setIsHybridMode(!isHybridMode)}
        className={cn(
          "absolute z-40 flex items-center justify-center p-3.5 rounded-full bg-white text-zinc-900 shadow-lg hover:bg-zinc-200 transition-all duration-200",
          "bottom-20 right-4 md:bottom-20 md:right-8"
        )}
        title="Changer de fond de carte"
      >
        <Layers size={20} />
      </button>

    </div>
  );
}