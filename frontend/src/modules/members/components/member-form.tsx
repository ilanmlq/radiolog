import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import { Address } from "@/modules/common.model"
import { TeamID, UserID } from "@/modules/members/member.model"
import { MemberFormFieldErrors } from "@/modules/members/member.validation"
import type { Team } from "@/modules/teams/team.model"
import type { UserSummary } from "@/modules/users"

function formatList(values: string[]) {
  return values.join(", ")
}

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function parsePhoneList(value: string) {
  return value
    .split(",")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean)
}

function formatRoleTitles(values: string[]) {
  return values.join(",")
}

function sanitizeRoleTitlesInput(value: string) {
  return value.replace(/[^\p{L}\p{M}0-9,]/gu, "")
}

function parseRoleTitles(value: string) {
  return sanitizeRoleTitlesInput(value)
    .split(",")
    .filter(Boolean)
}

function areListsEqual(first: string[], second: string[]) {
  return first.length === second.length && first.every((value, index) => value === second[index])
}

interface MemberFormProps {
    name: string;
    surnames: string[];
    email: string[];
    phone: string[]; 
    address: Address;
    roleTitles: string[];
    teams: Team[];
    users: UserSummary[];
    teamIds: TeamID[];
    userId: UserID;
    error?: string | null;
    fieldErrors?: MemberFormFieldErrors;
    isSubmitting?: boolean;
    onNameChange: (value: string) => void;
    onSurnamesChange: (value: string[]) => void;
    onEmailChange: (value: string[]) => void;
    onPhoneChange: (value: string[]) => void;
    // onAddressChange: (value: Address) => void;
    onLine1Change: (value: string) => void;
    onLine2Change: (value: string) => void;
    onPostalCodeChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onCountryChange: (value: string) => void;
    onRoleTitlesChange: (value: string[]) => void;
    onTeamIdsChange: (value: string[]) => void;
    onUserIdChange: (value: string) => void;
}

export function MemberForm({
    name,
    surnames,
    email,
    phone, 
    address,
    roleTitles,
    teams,
    users,
    teamIds,
    userId,
    error,
    fieldErrors,
    isSubmitting,
    onNameChange,
    onSurnamesChange,
    onEmailChange,
    onPhoneChange,
    // onAddressChange,
    onLine1Change,
    onLine2Change,
    onPostalCodeChange,
    onCityChange,
    onCountryChange,
    onRoleTitlesChange,
    onTeamIdsChange,
    onUserIdChange,
}: MemberFormProps) {
  const [roleTitlesInput, setRoleTitlesInput] = useState(formatRoleTitles(roleTitles))
  const [phoneInput, setPhoneInput] = useState(formatList(phone))

  useEffect(() => {
    setRoleTitlesInput((current) => {
      if (areListsEqual(parseRoleTitles(current), roleTitles)) {
        return current
      }

      return formatRoleTitles(roleTitles)
    })
  }, [roleTitles])

  useEffect(() => {
    setPhoneInput((current) => {
      if (areListsEqual(parsePhoneList(current), phone)) {
        return current
      }

      return formatList(phone)
    })
  }, [phone])

  const handleRoleTitlesChange = (value: string) => {
    const sanitizedValue = sanitizeRoleTitlesInput(value)
    setRoleTitlesInput(sanitizedValue)
    onRoleTitlesChange(parseRoleTitles(sanitizedValue))
  }

  const handleRoleTitlesBlur = () => {
    setRoleTitlesInput(formatRoleTitles(parseRoleTitles(roleTitlesInput)))
  }

  const handlePhoneChange = (value: string) => {
    setPhoneInput(value)
    onPhoneChange(parsePhoneList(value))
  }

  const handlePhoneBlur = () => {
    setPhoneInput(formatList(parsePhoneList(phoneInput)))
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="member-name">Nom du membre *</Label>
        <Input
          id="member-name"
          placeholder="ex: John Member"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          aria-invalid={Boolean(fieldErrors?.name)}
          required
          disabled={isSubmitting}
        />
        {fieldErrors?.name && (
          <p className="text-sm text-destructive">{fieldErrors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="member-surname">Surnoms du membre</Label>
        <Input
          id="member-surname"
          placeholder="ex. johnny jo'"
          value={formatList(surnames)}
          onChange={(e) => onSurnamesChange(parseList(e.target.value))}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="member-email">Emails du membre</Label>
        <Input
          id="member-email"
          placeholder="ex. John@mail.com"
          value={formatList(email)}
          onChange={(e) => onEmailChange(parseList(e.target.value))}
          aria-invalid={Boolean(fieldErrors?.email)}
          required
          disabled={isSubmitting}
        />
        {fieldErrors?.email && (
          <p className="text-sm text-destructive">{fieldErrors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="member-phones">Téléphones du membre</Label>
        <Input
          id="member-phones"
          placeholder="ex. +41 79 000 00 00"
          value={phoneInput}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={handlePhoneBlur}
          aria-invalid={Boolean(fieldErrors?.phone)}
          required
          disabled={isSubmitting}
        />
        {fieldErrors?.phone && (
          <p className="text-sm text-destructive">{fieldErrors.phone}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Équipes</Label>

        <div className="flex flex-col gap-2">
          {teamIds.map((teamId, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={teamId}
                onChange={(e) => {
                  const updated = [...teamIds]
                  updated[index] = e.target.value

                  onTeamIdsChange(updated)
                }}
                required
                disabled={isSubmitting}
                className="border rounded px-2 py-1"
              >
                <option value="">Choisir une équipe...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={isSubmitting}
                className="text-red-500"
                onClick={() => {
                  onTeamIdsChange(teamIds.filter((_, i) => i !== index))
                }}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            disabled={isSubmitting}
            className="w-fit"
            onClick={() => {
              onTeamIdsChange([...teamIds, ""])
            }}
          >
            <Plus className="size-4" />
          </button>
        </div>
        {fieldErrors?.teamIds && (
          <p className="text-sm text-destructive">{fieldErrors.teamIds}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="member-user">Utilisateur lié</Label>
        <select
          id="member-user"
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          disabled={isSubmitting}
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <option value="">Aucun utilisateur lié</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="member-roles">Roles</Label>
        <Input
          id="member-roles"
          placeholder="ex. admin,benevole"
          value={roleTitlesInput}
          onChange={(e) => handleRoleTitlesChange(e.target.value)}
          onBlur={handleRoleTitlesBlur}
          required
          disabled={isSubmitting}
        />

      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="member-address-line-1">Adresse complète</Label>
        <Input
          id="member-address-line-1"
          placeholder="ex. rue de Genève 1A"
          value={address.line1}
          onChange={(e) => onLine1Change(e.target.value)}
          disabled={isSubmitting}
        />

        <Label
        htmlFor="member-address-line-2">Adresse ligne 2</Label>
        <Input
          id="member-address-line-2"
          placeholder=""
          value={address.line2}
          onChange={(e) => onLine2Change(e.target.value)}
          disabled={isSubmitting}
        />

        <Label htmlFor="member-address-postal-code">Code Postal</Label>
        <Input
          id="member-address-postal-code"
          placeholder="ex. 1201"
          value={address.postalCode}
          onChange={(e) => onPostalCodeChange(e.target.value)}
          disabled={isSubmitting}
        />

        <Label
        htmlFor="member-address-city">Ville</Label>
        <Input
          id="member-address-city"
          placeholder="ex. Genève"
          value={address.city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={isSubmitting}
        />

        <Label
        htmlFor="member-address-country">Pays</Label>
        <Input
          id="member-address-country"
          placeholder="ex. Suisse"
          value={address.country}
          onChange={(e) => onCountryChange(e.target.value)}
          disabled={isSubmitting}
        />

      </div>
    </div>
  )
}
