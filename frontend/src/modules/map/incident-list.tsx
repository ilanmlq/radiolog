import { AlertTriangle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Incident {
  level: string;
  title: string;
}

interface POI {
  id: string;
  name: string;
  incident: Incident;
}

interface IncidentListProps {
  incidents: POI[];
  onSelect: (poi: POI) => void;
  getIncidentColor: (level: string) => string;
}

export const IncidentList = ({ incidents, onSelect, getIncidentColor }: IncidentListProps) => (
  <div className="absolute top-20 right-6 z-10 w-72 bg-zinc-900/90 backdrop-blur-xl rounded-xl border border-zinc-800 shadow-2xl overflow-hidden max-h-[60vh]">
    <div className="bg-zinc-950/50 p-3 border-b border-zinc-800 flex items-center gap-2">
      <AlertTriangle className="text-red-500 size-4" />
      <h3 className="font-semibold text-sm text-white">Incidents en cours ({incidents.length})</h3>
    </div>
    <div className="overflow-y-auto flex flex-col p-2 gap-2">
      {incidents.map(poi => (
        <button key={poi.id} onClick={() => onSelect(poi)} className="flex flex-col text-left p-3 rounded-lg hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-700 group">
          <div className="flex justify-between items-start w-full mb-1">
            <span className="font-medium text-sm text-white group-hover:text-blue-400">{poi.name}</span>
            <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border", getIncidentColor(poi.incident.level))}>
              {poi.incident.level}
            </span>
          </div>
          <span className="text-xs text-zinc-400 line-clamp-1">{poi.incident.title}</span>
        </button>
      ))}
    </div>
  </div>
);