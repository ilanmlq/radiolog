import { useState, useEffect } from "react";
import { X, MapPin, Edit2, Trash2, AlertTriangle, Check } from "lucide-react";
import { POI, IncidentLevel, POICategory } from "../mobile/types/map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface POIPanelProps {
  poi: POI;
  categories: { id: string; name: string }[]; 
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (updatedPoi: POI) => void;
  onResolve: (id: string) => void; 
}

export function POIPanel({ poi, categories, onClose, onDelete, onUpdate, onResolve }: POIPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState<POI>(poi);

  useEffect(() => {
    setEditForm(poi);
    setIsEditing(false);
  }, [poi]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editForm);
    setIsEditing(false);
  };

  const isIncidentMode = !!poi.incident && !isEditing;
  const categoryName = categories?.find(c => String(c.id) === String(poi.type))?.name || poi.type;

  const getIncidentBadge = (level: IncidentLevel) => {
    switch (level) {
      case "3": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "2": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "1": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-zinc-500";
    }
  };

  return (
    <div className={cn(
      "absolute z-50 bg-zinc-900/95 backdrop-blur-xl border-zinc-800 shadow-2xl transition-all duration-300 ease-out",
      "bottom-15 left-0 w-full rounded-t-[32px] border-t p-6 pb-10 animate-in slide-in-from-bottom-full",
      "md:bottom-auto md:top-6 md:left-6 md:w-[400px] md:rounded-[24px] md:border-2 md:p-7 md:slide-in-from-left-8",
      poi.incident ? (poi.incident.level === "3" ? "border-red-500/50" : "border-orange-500/50") : "border-zinc-800"
    )}>
      
      {/* Bouton Fermer seul et épuré (plus d'en-tête, plus de barre de drag) */}
      <div className="flex justify-end mb-2">
        <button onClick={onClose} className="text-zinc-500 hover:text-white bg-zinc-800/50 p-2 rounded-full transition-colors shadow-sm">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {isIncidentMode ? (
          <div className="space-y-5 text-left">
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">{poi.incident!.title}</h2>
              <p className="text-zinc-400 text-sm mt-1 flex items-center gap-1.5">
                <MapPin size={14} /> {poi.name}
              </p>
            </div>

            <div className="bg-zinc-950/40 rounded-2xl p-5 border border-zinc-800/50 flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-medium">Criticité</span>
                <span className={cn("text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border", getIncidentBadge(poi.incident!.level))}>
                  Niveau {poi.incident!.level}
                </span>
              </div>
            </div>

            <Button 
              className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold h-14 rounded-2xl shadow-lg"
              onClick={() => {
                onResolve(poi.id);
                onClose();
              }}
            >
              <Check size={20} className="mr-2" />
              Résoudre l'incident
            </Button>
          </div>

        ) : !isEditing ? (
          <div className="space-y-5 text-left">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{poi.name}</h2>
              <div className="mt-3">
                <span className="inline-block bg-blue-500/10 text-blue-400 text-[10px] font-black px-3 py-1.5 rounded-lg border border-blue-500/20 uppercase tracking-widest">
                  {categoryName}
                </span>
              </div>
            </div>
            
            <p className="text-zinc-400 text-base leading-relaxed">
              {poi.description || "Aucune description disponible."}
            </p>

            <div className="pt-4 flex gap-3">
              <Button onClick={() => setIsEditing(true)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl h-12">
                <Edit2 size={18} className="mr-2" /> Modifier
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(true)} className="px-4 border-zinc-800 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl h-12">
                <Trash2 size={18} />
              </Button>
            </div>

            {showDeleteConfirm && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 space-y-4 animate-in zoom-in-95 duration-200">
                <p className="text-red-400 text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle size={18} /> Confirmer la suppression ?
                </p>
                <div className="flex gap-2">
                  <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => onDelete(poi.id)}>Supprimer</Button>
                  <Button variant="outline" className="flex-1 bg-zinc-800 border-zinc-700 text-white rounded-xl" onClick={() => setShowDeleteConfirm(false)}>Annuler</Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Nom du lieu</label>
              <Input autoFocus required className="bg-zinc-950 border-zinc-800 text-white h-12 rounded-xl" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Catégorie</label>
              <Select value={editForm.type} onValueChange={(value) => setEditForm({ ...editForm, type: value as POICategory })}>
                <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-xl">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Description</label>
              <Textarea rows={4} className="bg-zinc-950 border-zinc-800 text-white rounded-xl resize-none" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl font-bold">
                Enregistrer
              </Button>
              <Button type="button" variant="outline" className="bg-zinc-800 border-zinc-700 text-white h-12 rounded-xl" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}