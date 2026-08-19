import { ModuleHeader } from "@/modules/admin/components/module-header";
import { UsersRound } from "lucide-react";
import { ModuleStats } from "@/modules/admin/components/module.stats";
import { DataTable } from "@/modules/admin/components/data-table";
import { Team } from "../team.model";
import { AddTeamDialog } from "./add-team-dialog";
import { getTeamColumns } from "./team-columns";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTeam } from "@/modules/teams";
import { Member, useMember } from "@/modules/members";

export default function Teams() {
  const {
    teams,
    rowCount,
    pagination,
    sorting,
    globalFilter,
    isLoading,
    setPagination,
    setSorting,
    setGlobalFilter,
  } = useTeam();

  const { members } = useMember();

  const [membres, setMembres] = useState<Member[]>([]);
  const [teams2, setTeams2] = useState<Team[]>([]);
  const [isLoading2, setIsLoading2] = useState(false);
  const navigate = useNavigate();

  const moduleInfo = {
    title: "Équipes",
    description: "Gérez les équipes, leurs responsables et les affectations",
    icon: <UsersRound className="size-5" />,
  };

  async function getTeams(): Promise<Team[]> {
    const url = "http://localhost:3000/api/teams";
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erreur HTTP");
      const result: { items: Team[] } = await response.json();
      console.log("RESULT :");
      console.log(result);
      return result.items;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function getMembers(): Promise<Member[]> {
    const url = "http://localhost:3000/api/members";
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erreur HTTP");
      const result: { items: Member[] } = await response.json();
      return result.items;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  const fetchData = async () => {
    try {
      setIsLoading2(true);

      const [data, members] = await Promise.all([getTeams(), getMembers()]);

      setMembres(members);

      const membersMap = new Map(
        members.flatMap((m) => [
          [m.id, m.name],
          [m.userId, m.name],
        ])
      );

      const formatted = data.map((team) => ({
        ...team,
        teamLeaders: (team.teamLeaders ?? []).map(
          (id) => membersMap.get(id) ?? "Inconnu"
        ),
      }));

      setTeams2(formatted);
    } catch (error) {
      console.error("Erreur fetch teams:", error);
    } finally {
      setIsLoading2(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        title={moduleInfo.title}
        description={moduleInfo.description}
        actions={
          <AddTeamDialog
            teams={teams}
            members={
              members
            } /*teams={teams} membres={members} fetch={fetchData}*/
          />
        }
      >
        {moduleInfo.icon}
      </ModuleHeader>

      <ModuleStats
        stats={[
          { label: "Équipes", value: teams.length },
          { label: "Équipes principales", value: 0 },
          { label: "Sous-équipes", value: 0 },
        ]}
      />

      <DataTable
        columns={getTeamColumns(teams2, members, fetchData)}
        data={teams2}
        searchPlaceholder="Rechercher dans les équipes..."
        pagination={pagination}
        sorting={sorting}
        globalFilter={globalFilter}
        rowCount={rowCount}
        isLoading={isLoading}
        onPageChange={setPagination}
        onSortingChange={setSorting}
        onGlobalFilterChange={setGlobalFilter}
        onRowClick={(row: Team) => {
          navigate(`/admin/teams/${row.id}`);
        }}
      />
    </div>
  );
}
