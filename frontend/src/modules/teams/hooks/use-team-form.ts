import { useState, useCallback, useEffect } from 'react';
import { CreateTeamDTO } from '../team.model';

export interface TeamFormData {
  eventId: string;
  parentTeamId?: string;
  canalId?: string;
  name: string;
  teamLeaders: string[];
  description: string;
}

export interface UseTeamFormOptions {
  initialData?: Partial<TeamFormData>;
  onSubmit: (data: CreateTeamDTO) => Promise<void>;
  onSuccess?: () => void;
}

export function useTeamForm({
  initialData,
  onSubmit,
  onSuccess,
}: UseTeamFormOptions) {

  const [eventId, setEvenId] = useState<string>(initialData?.eventId ?? '');
  const [parentTeamId, setParentTeamId] = useState<string | undefined>(initialData?.parentTeamId);
  const [canalId, setCanalId] = useState<string | undefined>(initialData?.canalId);
  const [name, setName] = useState(initialData?.name ?? '');
  const [teamLeaders, setTeamLeaders] = useState<string[]>(initialData?.teamLeaders ?? []);
  const [description, setDescription] = useState(initialData?.description ?? '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize form state with initialData when it changes
  useEffect(() => {
    setParentTeamId(initialData?.parentTeamId ?? '');
    setCanalId(initialData?.canalId ?? '');
    setName(initialData?.name ?? '');
    setTeamLeaders(initialData?.teamLeaders ?? []);
    setDescription(initialData?.description ?? '');
    setEvenId(initialData?.eventId ?? '');
  }, [initialData]);

  const reset = useCallback((data?: Partial<TeamFormData>) => {
    setParentTeamId(data?.parentTeamId ?? '');
    setEvenId(data?.eventId ?? '');
    setCanalId(data?.canalId ?? '');
    setName(data?.name ?? '');
    setTeamLeaders(data?.teamLeaders ?? []);
    setDescription(data?.description ?? '');
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!name) {
      setError('Le nom est requis');
      return;
    }

    if (!eventId) {
      setError('Un event est requis');
      return;
    }
    
    const validTeamLeaders = teamLeaders.filter(
      (id) => id.trim() !== ""
    );

    if (validTeamLeaders.length === 0) {
      setError('Au moins un team leader est requis');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        eventId: eventId,
        parentTeamId: parentTeamId || undefined,
        canalId: canalId || undefined,
        name,
        teamLeaders,
        description,
      }); 

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    eventId,
    parentTeamId,
    canalId,
    name,
    teamLeaders,
    description,
    onSubmit,
    onSuccess,
  ]);

    return {
    formData: {
      parentTeamId,
      canalId,
      name,
      teamLeaders,
      description,
      eventId
    },
    setters: {
      setParentTeamId,
      setCanalId,
      setName,
      setTeamLeaders,
      setDescription,
      setEvenId
    },
    state: {
      isSubmitting,
      error,
    },
    actions: {
      handleSubmit,
      reset,
    },
  };
}