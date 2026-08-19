import { Users } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

type MemberID = string
type TeamID = string
type UserID = string

type Address = {
  street?: string
  city?: string
  zip?: string
  country?: string
}

type Team = {
  id: TeamID
  name: string
  teamLeaders: MemberID[]
  parentTeamId?: TeamID
}

type Member = {
  id: MemberID
  teamId: TeamID
  userId?: UserID
  name: string
  surnames: string[]
  email: string[]
  phone: string[]
  address?: Address
  roleTitles: string[]
}

type MemberInTable = Member & {
  teamName: string
  isResponsable: boolean
}

export function DirectoryView() {
  const [members, setMembers] = useState<MemberInTable[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function getTeams(): Promise<Team[]> {
    const response = await fetch("http://localhost:3000/api/teams")
    if (!response.ok) throw new Error("Erreur HTTP")
    const result: { items: Team[] } = await response.json()
    return result.items
  }

  async function getMembers(): Promise<MemberInTable[]> {
    try {
      setIsLoading(true)
      const [membersRes, teams] = await Promise.all([
        fetch("http://localhost:3000/api/members"),
        getTeams()
      ])
      if (!membersRes.ok) throw new Error("Erreur HTTP")
      const result: { items: Member[] } = await membersRes.json()
      const teamMap = new Map(teams.map(t => [t.id, t.name]))
      const respMap = new Map(teams.map(t => [t.id, t.teamLeaders]))
      return result.items.map(member => ({
        ...member,
        teamName: teamMap.get(member.teamId) ?? "Inconnu",
        isResponsable: respMap.get(member.teamId)?.includes(member.userId ?? "") ?? false
      })).sort((a, b) => {
        const teamCompare = a.teamName.localeCompare(b.teamName, 'fr')
        if (teamCompare !== 0) return teamCompare
        return a.name.localeCompare(b.name, 'fr')
      })
    } catch (e) {
      console.error(e)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function fetchData() {
      const data = await getMembers()
      setMembers(data)
    }
    fetchData()
  }, [])

  if (isLoading) return <div className="flex justify-center mt-10"><Spinner /></div>

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 pt-16 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10">
        <Users className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-foreground">Annuaire</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m, i) => {
          const showTeam = i === 0 || members[i - 1].teamName !== m.teamName
          return (
            <div key={m.id} className="col-span-1">
              {showTeam && <p className="mb-2 text-lg font-bold text-left">{m.teamName}</p>}
              <Card onClick={() => navigate(`/directory/${m.id}`)} className="hover:shadow-md cursor-pointer transition">
                <CardContent className="p-5 flex gap-4 items-start">
                  <Avatar><AvatarFallback>{m.name?.charAt(0)}</AvatarFallback></Avatar>
                  <div className="flex flex-col gap-1 text-left">
                    <p className="font-semibold text-foreground">{m.name}</p>
                    {m.email?.[0] && <a href={`mailto:${m.email[0]}`} className="text-sm text-blue-500 hover:underline">{m.email[0]}</a>}
                    {m.phone?.[0] && <a href={`tel:${m.phone[0]}`} className="text-sm text-blue-500 hover:underline">{m.phone[0]}</a>}
                    {m.roleTitles?.[0] && <div className="mt-2"><Badge variant="secondary">{m.roleTitles[0]}</Badge></div>}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}