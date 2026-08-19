import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface CanalFormProps {
  number: string
  name: string
  description: string
  error?: string | null
  isSubmitting?: boolean
  onNumberChange: (value: string) => void
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}

export function CanalForm({
  number,
  name,
  description,
  error,
  isSubmitting,
  onNumberChange,
  onNameChange,
  onDescriptionChange,
}: CanalFormProps) {
  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>Une erreur est survenu. Veuillez vérifier les données du formulaire</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="canal-number">Numéro du canal (unique) *</Label>
        <Input
          id="canal-number"
          type="number"
          placeholder="ex. 1"
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
          min="1"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="canal-name">Nom du canal *</Label>
        <Input
          id="canal-name"
          placeholder="ex. Canal principal"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="canal-description">Description</Label>
        <Textarea
          id="canal-description"
          placeholder="Une brève description du canal"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          disabled={isSubmitting}
        />
      </div>
    </div>
  )
}
