import { useState, useCallback, useEffect } from 'react';
import { CreateCanalDTO, UpdateCanalDTO } from '../canal.model';

export interface CanalFormData {
  number: string;
  name: string;
  description: string;
}

export interface UseCanalFormOptions {
  initialData?: Partial<CanalFormData>;
  onSubmit: (data: CreateCanalDTO | UpdateCanalDTO) => Promise<void>;
  onSuccess?: () => void;
}

export function useCanalForm({ initialData, onSubmit, onSuccess }: UseCanalFormOptions) {
  const [number, setNumber] = useState(initialData?.number ?? '');
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize form state with initialData when it changes
  useEffect(() => {
    setNumber(initialData?.number ?? '');
    setName(initialData?.name ?? '');
    setDescription(initialData?.description ?? '');
  }, [initialData?.number, initialData?.name, initialData?.description]);

  const reset = useCallback((data?: Partial<CanalFormData>) => {
    setNumber(data?.number ?? initialData?.number ?? '');
    setName(data?.name ?? initialData?.name ?? '');
    setDescription(data?.description ?? initialData?.description ?? '');
    setError(null);
  }, [initialData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!number || !name) {
      setError('Le numéro et le nom sont requis');
      return;
    }

    const parsedNumber = parseInt(number, 10);
    if (isNaN(parsedNumber) || parsedNumber < 1) {
      setError('Le numéro doit être un nombre positif');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        number: parsedNumber,
        name,
        description,
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  }, [number, name, description, onSubmit, onSuccess]);

  return {
    formData: {
      number,
      name,
      description,
    },
    setters: {
      setNumber,
      setName,
      setDescription,
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
