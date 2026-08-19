import { useState, useCallback, useEffect } from "react"
import { CreateMemberDTO, TeamID, UpdateMemberDTO, UserID } from "../member.model"
import { Address } from "@/modules/common.model"
import { MemberFormFieldErrors, validateMemberFormData } from "../member.validation"

const EMPTY_ADDRESS: Address = {
  line1: "",
  line2: "",
  postalCode: "",
  city: "",
  country: "",
}

function normalizeAddress(address?: Address): Address | undefined {
  if (!address) {
    return undefined
  }

  const line2 = address.line2?.trim() ?? ""
  const hasAddress = [
    address.line1,
    line2,
    address.postalCode,
    address.city,
    address.country,
  ].some((value) => value.trim().length > 0)

  if (!hasAddress) {
    return undefined
  }

  return {
    line1: address.line1.trim(),
    ...(line2 ? { line2 } : {}),
    postalCode: address.postalCode.trim(),
    city: address.city.trim(),
    country: address.country.trim(),
  }
}

export interface MemberFormData {
    name: string;
    surnames: string[];
    email: string[];
    phone: string[];
    address?: Address;
    roleTitles: string[];
    teamId: TeamID[];
    teamIds: TeamID[];
    userId: UserID;
}

export interface UseMemberFormOptions {
  initialData?: Partial<MemberFormData>;
  onSubmit: (data: CreateMemberDTO | UpdateMemberDTO) => Promise<void>;
  onSuccess?: () => void;
}

function getInitialTeamIds(data?: Partial<MemberFormData>): TeamID[] {
  if (data?.teamIds?.length) {
    return data.teamIds
  }

  return data?.teamId ?? []
}

export function useMemberForm({ initialData, onSubmit, onSuccess }: UseMemberFormOptions) {
    const [name, setName] = useState(initialData?.name ?? "")
    const [surnames, setSurnames] = useState(initialData?.surnames ?? [])
    const [email, setEmail] = useState(initialData?.email ?? [])
    const [phone, setPhone] = useState(initialData?.phone ?? [])
    const [address, setAddress] = useState(initialData?.address ?? EMPTY_ADDRESS)
    const [roleTitles, setRoleTitles] = useState(initialData?.roleTitles ?? [])
    const [teamIds, setTeamIds] = useState(getInitialTeamIds(initialData))
    const [userId, setUserId] = useState(initialData?.userId ?? "")

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<MemberFormFieldErrors>({})

  // Synchronize form state with initialData when it changes
  useEffect(() => {
    setName(initialData?.name ?? "")
    setSurnames(initialData?.surnames ?? [])
    setEmail(initialData?.email ?? [])
    setPhone(initialData?.phone ?? [])
    setAddress(initialData?.address ?? EMPTY_ADDRESS)
    setRoleTitles(initialData?.roleTitles ?? [])
    setTeamIds(getInitialTeamIds(initialData))
    setUserId(initialData?.userId ?? "")
    setFieldErrors({})
    setError(null)
  }, [initialData?.name, initialData?.surnames, initialData?.email, initialData?.phone, initialData?.address, initialData?.roleTitles, initialData?.teamId, initialData?.teamIds, initialData?.userId])

  const handleSetName = useCallback((value: string) => {
    setName(value)
    setFieldErrors((current) => ({ ...current, name: undefined }))
    setError(null)
  }, [])

  const handleSetEmail = useCallback((value: string[]) => {
    setEmail(value)
    setFieldErrors((current) => ({ ...current, email: undefined }))
    setError(null)
  }, [])

  const handleSetPhone = useCallback((value: string[]) => {
    setPhone(value)
    setFieldErrors((current) => ({ ...current, phone: undefined }))
    setError(null)
  }, [])

  const handleSetTeamIds = useCallback((value: TeamID[]) => {
    setTeamIds(value)
    setFieldErrors((current) => ({ ...current, teamIds: undefined }))
    setError(null)
  }, [])

  const reset = useCallback((data?: Partial<MemberFormData>) => {
    setName(data?.name ?? initialData?.name ?? "")
    setSurnames(data?.surnames ?? initialData?.surnames ?? [])
    setEmail(data?.email ?? initialData?.email ?? [])
    setPhone(data?.phone ?? initialData?.phone ?? [])
    setAddress(data?.address ?? initialData?.address ?? EMPTY_ADDRESS)
    setRoleTitles(data?.roleTitles ?? initialData?.roleTitles ?? [])
    setTeamIds(data ? getInitialTeamIds(data) : getInitialTeamIds(initialData))
    setUserId(data?.userId ?? initialData?.userId ?? "")
    setFieldErrors({})
    setError(null)
  }, [initialData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedTeamIds = teamIds.filter(Boolean)

    const { fieldErrors: validationErrors, formError } = validateMemberFormData({
      name,
      email,
      phone,
      teamIds: selectedTeamIds,
    })

    if (formError) {
      setFieldErrors(validationErrors)
      setError(formError)
      return
    }

    setIsSubmitting(true)
    setFieldErrors({})
    setError(null)

    try {
      await onSubmit({
        name,
        surnames,
        email,
        phone, 
        address: normalizeAddress(address),
        roleTitles,
        teamId: selectedTeamIds,
        ...(userId ? { userId } : {}),
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }, [name, surnames, email, phone, address, roleTitles, teamIds, userId, onSubmit, onSuccess])

  return {
    formData: {
        name,
        surnames,
        email,
        phone, 
        address,
        roleTitles,
        teamId: teamIds,
        teamIds,
        userId,
    },
    setters: {
        setName: handleSetName,
        setSurnames,
        setEmail: handleSetEmail,
        setPhone: handleSetPhone, 
        setAddress,
        setRoleTitles,
        setTeamIds: handleSetTeamIds,
        setUserId,
    },
    state: {
      isSubmitting,
      error,
      fieldErrors,
    },
    actions: {
      handleSubmit,
      reset,
    },
  }
}
