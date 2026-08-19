import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react'
import { Member, MemberSummary } from '@/modules/members/member.model'
import { Team, TeamID } from '@/modules/teams/team.model'
import { getTeamDetails } from "@/modules/teams/team.service";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { listMembersForTeam } from "../members";

export default function TeamDetailPage() {
    const { id } = useParams<{ id: string }>();
    const teamId = id as TeamID;

    const api = useApi();

    const [team, setTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<MemberSummary[]>([]);

    useEffect(() => {
        if (!teamId) return;

        const load = async () => {
            try {
                const [teamData, result] = await Promise.all([
                    getTeamDetails(api, teamId),
                    listMembersForTeam(api, teamId, {
                        limit: 20,
                        offset: 0,
                    }),
                ]);

                setTeam(teamData);
                setMembers(result.items);
            } catch (err) {
                console.error("Failed to load team details", err);
            }
        };

        load();
    }, [teamId, api]);

    return (
        <div className="min-h-screen flex justify-center p-6">
            <div className="w-full max-w-3xl space-y-6">

                {/* TEAM */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl text-center">
                            Détails de l'équipe
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        {team && (
                            <div className="space-y-3 text-center">
                                <h2 className="text-xl font-semibold">{team.name}</h2>

                                {team.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {team.description}
                                    </p>
                                )}

                                <div className="flex gap-2 flex-wrap justify-center">
                                    <Badge variant="secondary">
                                        {team.teamLeaders?.length ?? 0} leaders
                                    </Badge>

                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* MEMBERS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">
                            Membres
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-2">
                            {members.map((m) => (
                                <div
                                    key={m.id}
                                    className="flex items-center justify-between border rounded-lg p-3"
                                >
                                    <span>{m.name}</span>

                                    <Badge variant="secondary">
                                        membre
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}