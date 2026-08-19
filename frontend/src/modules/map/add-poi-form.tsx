import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils"; 

interface AddPOIFormProps {
  draft: { latitude: number; longitude: number };
  categories: { id: string; name: string }[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function AddPOIForm({ categories, onSave, onCancel }: AddPOIFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "", 
    description: "",
    incident: null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.type) return; 
    onSave(formData);
  };

  return (
    <div className={cn(
      "absolute bottom-0 left-0 w-full z-50 rounded-t-3xl pb-8",
      "md:bottom-40 md:right-6 md:left-auto md:w-[340px] md:rounded-2xl md:pb-5",
      "bg-zinc-900/95 backdrop-blur-xl shadow-2xl border-t border-zinc-800 md:border p-5 flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-300"
    )}>
      <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
        <h3 className="font-bold text-white tracking-tight uppercase text-sm">Nouveau lieu</h3>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={onCancel} 
          className="h-8 w-8 text-zinc-500 hover:text-white rounded-full"
        >
          <X size={18} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs text-zinc-400">Nom du lieu *</Label>
          <Input
            id="name"
            autoFocus
            required
            placeholder="Ex: Café de la Gare"
            className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Catégorie *</Label>
          <Select 
            required 
            value={formData.type} 
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-10 rounded-xl transition-all">
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200 rounded-xl shadow-2xl shadow-black/50">
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem 
                    key={cat.id} 
                    value={cat.id}
                    className="focus:bg-gray-600 focus:text-white cursor-pointer rounded-lg mx-1 text-sm font-medium my-0.5 transition-colors"
                  >
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-zinc-500">Aucune catégorie disponible</div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-xs text-zinc-400">Description</Label>
          <Textarea
            id="description"
            placeholder="Un petit mot sur cet endroit..."
            className="bg-zinc-950 border-zinc-800 text-white resize-none focus-visible:ring-blue-500"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <Button 
          type="submit" 
          disabled={!formData.name.trim() || !formData.type}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold mt-2"
        >
          Créer le point
        </Button>
      </form>
    </div>
  );
}