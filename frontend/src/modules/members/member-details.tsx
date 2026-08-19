import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useTeam } from "../teams/team.provider";
import { useApi } from "@/hooks/use-api";
import { getMemberDetails } from "./member.service";
import type { Member } from "./member.model";

type MemberID = string;
type TeamID = string;
type EventID = string;
type CanalID = string;

export type TeamWithParent = {
    id: TeamID;
    eventId: EventID;
    parentTeamId?: TeamID;
    canalId?: CanalID;
    name: string;
    teamLeaders: Array<MemberID>;
    description?: string;
    parentTeam?: Array<string>;
};

export default function MemberDetailPage() {
    const { id } = useParams<{ id: string }>();

    const [member, setMember] = useState<Member | null>(null);
    const [team, setTeam] = useState<TeamWithParent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const api = useApi();
    const { fetchTeamWithParent } = useTeam();

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        const memberId = id;
        let isCurrent = true;

        async function loadMember() {
            setIsLoading(true);

            try {
                const memberDetails = await getMemberDetails(api, memberId);
                const firstTeamId = memberDetails.teamId[0];
                const teamDetails = firstTeamId
                    ? await fetchTeamWithParent(firstTeamId)
                    : null;

                if (!isCurrent) return;

                setMember(memberDetails);
                setTeam(teamDetails);
            } catch (error) {
                console.error("Failed to load member details:", error);

                if (!isCurrent) return;

                setMember(null);
                setTeam(null);
            } finally {
                if (isCurrent) {
                    setIsLoading(false);
                }
            }
        }

        loadMember();

        return () => {
            isCurrent = false;
        };
    }, [api, id, fetchTeamWithParent]);

    if (isLoading) {
        return (
            <div className="flex justify-center mt-10">
                <Spinner />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="mt-10 text-center text-muted-foreground">
                Membre introuvable.
            </div>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto mt-10 shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/40 pb-6 pt-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                        {member.name.charAt(0)}
                    </div>

                    <div>
                        <CardTitle className="text-3xl">
                            {member.name}
                        </CardTitle>

                        <div className="flex gap-2 mt-2 flex-wrap">
                            {member.roleTitles.map((r, i) => (
                                <Badge key={i} variant="secondary">
                                    {r}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">

                {/* Equipe */}
                <div>
                    <h3 className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                        Équipe
                    </h3>

                    <div className="flex gap-2 flex-wrap">
                        {team ? (
                            <Badge className="text-sm px-3 py-1">
                                {team.name}
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-sm px-3 py-1">
                                Inconnue
                            </Badge>
                        )}

                        {team?.parentTeam?.map((pt, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className="text-sm px-3 py-1"
                            >
                                {pt}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Email */}
                    {member.email.length > 0 && (
                        <div className="rounded-2xl border p-4">
                            <h3 className="text-sm uppercase tracking-wide text-muted-foreground mb-3">
                                Email
                            </h3>

                            <div className="space-y-2">
                                {member.email.map((e, i) => (
                                    <a
                                        key={i}
                                        href={`mailto:${e}`}
                                        className="block hover:underline text-primary"
                                    >
                                        {e}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Téléphone */}
                    {member.phone.length > 0 && (
                        <div className="rounded-2xl border p-4">
                            <h3 className="text-sm uppercase tracking-wide text-muted-foreground mb-3">
                                Téléphone
                            </h3>

                            <div className="space-y-2">
                                {member.phone.map((p, i) => (
                                    <a
                                        key={i}
                                        href={`tel:${p}`}
                                        className="block hover:underline text-primary"
                                    >
                                        {p}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Surnoms */}
                {member.surnames.length > 0 && (
                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                            Surnoms
                        </h3>

                        <div className="flex gap-2 flex-wrap">
                            {member.surnames.map((s, i) => (
                                <Badge key={i} variant="outline">
                                    {s}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
