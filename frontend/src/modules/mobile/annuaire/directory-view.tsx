import { Users, Phone } from 'lucide-react'
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { useMemo } from 'react'
import { MemberSummary } from '@/modules/members/member.model'
import { TeamID } from '@/modules/teams/team.model'
import { useNavigate } from "react-router-dom"
import { useMember } from '@/modules/members'

export function DirectoryView() {
  type DirectoryMember = Omit<MemberSummary, "teamId" | "teamName" | "isResponsable"> & {
    teamId: TeamID
    teamName: string
    isResponsable: boolean
  }

  type TeamGroup = {
    teamId: TeamID
    teamName: string
    members: DirectoryMember[]
  }

  const {
    membersNoLimit,
    teamsNoLimit,
    isLoading,
  } = useMember();

  const navigate = useNavigate()

  const sortedGroupedMembers = useMemo(() => {
    const teamsById = new Map(teamsNoLimit.map(team => [team.id, team]))

    const directoryMembers = membersNoLimit.flatMap((member): DirectoryMember[] => {
      const memberTeamIds = Array.from(new Set(member.teamId.filter(Boolean)))
      const visibleTeamIds = memberTeamIds.length ? memberTeamIds : ["unknown"]

      return visibleTeamIds.map(teamId => {
        const team = teamsById.get(teamId)

        return {
          ...member,
          teamId,
          teamName: team?.name ?? "Inconnu",
          isResponsable: team?.teamLeaders?.includes(member.id) ?? false,
        }
      })
    })

    const groupedMembers = directoryMembers.reduce((acc, member) => {
      if (!acc[member.teamId]) {
        acc[member.teamId] = {
          teamId: member.teamId,
          teamName: member.teamName,
          members: [],
        }
      }

      acc[member.teamId].members.push(member)
      return acc
    }, {} as Record<TeamID, TeamGroup>)

    return Object.values(groupedMembers)
      .map(group => ({
        ...group,
        members: [...group.members].sort((a, b) => a.name.localeCompare(b.name, 'fr')),
      }))
      .sort((a, b) => a.teamName.localeCompare(b.teamName, 'fr'))
  }, [membersNoLimit, teamsNoLimit])

  if (isLoading) {
    return (
      <div className="mt-10 flex justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center px-4 pt-10 sm:px-8 sm:pt-16">

      {/* HEADER */}
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 sm:size-20">
          <Users className="size-8 text-primary sm:size-10" />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-foreground sm:mt-6">
          Annuaire
        </h2>
      </div>

      {/* LISTE */}
      <div className="mt-6 flex w-full max-w-full flex-col sm:max-w-5xl">

        {sortedGroupedMembers.map(({ teamId, teamName, members }) => (
          <div
            key={teamId}
            className="mb-6 w-full rounded-xl border border-muted bg-muted/50 p-3 sm:p-4"
          >

            {/* TEAM TITLE */}
            <p className="mb-3 text-left text-xl font-bold text-foreground sm:text-2xl">
              {teamName}
            </p>

            {/* MEMBERS */}
            <div className="flex flex-col gap-2">

              {members.map(m => (
                <Card
                  key={`${m.id}-${m.teamId}`}
                  onClick={() => navigate(`/directory/${m.id}`)}
                  className={`w-full cursor-pointer transition bg-muted/100 ${
                    m.isResponsable ? "border-l-4 border-l-primary" : ""
                  }`}
                >
                  <CardContent className="flex w-full items-center justify-between">

                    <div className="flex min-w-0 flex-1 items-center gap-3">

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">
                          {m.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {m.surnames.join(" ")}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-2">

                      {/* ROLES */}
                      {m.roleTitles?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {m.roleTitles.map(role => (
                            <span
                              key={role}
                              className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* PHONE */}
                      {m.phone?.[0] && (
                        <a
                          href={`tel:${m.phone[0]}`}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-full p-2 text-blue-500 transition hover:bg-blue-100"
                        >
                          <Phone className="size-5" />
                        </a>
                      )}

                    </div>

                  </CardContent>
                </Card>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}
