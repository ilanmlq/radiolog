import {
  Team,
  TeamID,
  CreateTeamDTO,
  UpdateTeamDTO,
} from './team.model';

import {
  listTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from './team.service';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/hooks/use-auth';
import { PaginationState, SortingState, Updater } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination-contants';

import { TeamWithParent } from '../members/member-details';

const INITIAL_SORT_BY = 'name';

interface TeamContextValue {
  teams: Team[];
  rowCount: number;

  pagination: PaginationState;
  sorting: SortingState;
  globalFilter: string;

  isLoading: boolean;

  teamWithParent: TeamWithParent | null;

  setPagination: (updater: Updater<PaginationState>) => void;
  setSorting: (updater: Updater<SortingState>) => void;
  setGlobalFilter: (f: string) => void;

  addTeam: (data: CreateTeamDTO) => Promise<void>;
  updateTeam: (id: TeamID, data: UpdateTeamDTO) => Promise<void>;
  deleteTeam: (id: TeamID) => Promise<void>;

  fetchTeamWithParent: (id: string) => Promise<TeamWithParent>;
}

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamWithParent, setTeamWithParent] = useState<TeamWithParent | null>(null);
  const [rowCount, setRowCount] = useState(0);

  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: DEFAULT_PAGE_SIZE,
    pageIndex: 0,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: INITIAL_SORT_BY, desc: false },
  ]);

  const [globalFilter, setGlobalFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const api = useApi();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const fetchTeams = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;
  
    setIsLoading(true);

    try {
      const sortBy = sorting[0]?.id ?? INITIAL_SORT_BY;
      const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';

      const result = await listTeams(api, {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        query: globalFilter,
        sortBy,
        sortOrder,
      });

      // mapping API → UI model Team
      setTeams(
        result.items.map((t: any) => ({
          id: t.id,
          name: t.name,
          teamLeaders: t.teamLeaders ?? [],
          description: t.description,
          eventId: t.eventId,
          parentTeamId: t.parentTeamId,
          canalId: t.canalId,
        }))
      );
      setRowCount(result.total);

    } catch (error) {
      console.error("Failed to load teams:", error);

      toast({
        title: "Erreur",
        description: "Impossible de charger les équipes.",
        variant: "destructive",
      });

    } finally {
      setIsLoading(false);
    }
  }, [
    api,
    toast,
    isAuthenticated,
    authLoading,
    pagination,
    sorting,
    globalFilter,
  ]);

  const fetchTeamWithParent = useCallback(
    async (idTeam: string): Promise<TeamWithParent> => {
      const res = await fetch(`http://localhost:3000/api/teams/${idTeam}`);
      if (!res.ok) throw new Error("Erreur HTTP");

      const base = await res.json();

      const parentTeams: string[] = [];
      let currentParentId = base.parentTeamId;

      while (currentParentId) {
        const parentRes = await fetch(
          `http://localhost:3000/api/teams/${currentParentId}`
        );

        if (!parentRes.ok) break;

        const parent = await parentRes.json();

        parentTeams.push(parent.name);
        currentParentId = parent.parentTeamId;
      }

      const result: TeamWithParent = {
        ...base,
        parentTeam: parentTeams,
      };

      setTeamWithParent(result);

      return result;
    },
    []
  );
  
  const handleAddTeam = useCallback(async (data: CreateTeamDTO) => {
    try {
      const cleanedData: CreateTeamDTO = {
        ...data,
        teamLeaders: [
          ...new Set(
            data.teamLeaders.filter(
              (id) => id.trim() !== ""
            )
          ),
        ],
      };
      await createTeam(api, cleanedData);
      await fetchTeams();

      toast({
        title: "Équipe créée",
        description: "L'équipe a été créée avec succès.",
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Création impossible.",
        variant: "destructive",
      });

      throw error;
    }
  }, [api, fetchTeams, toast]);

  const handleUpdateTeam = useCallback(async (id: TeamID, data: UpdateTeamDTO) => {
    try {
      await updateTeam(api, id, data);
      await fetchTeams();

      toast({
        title: "Équipe modifiée",
        description: "L'équipe a été mise à jour.",
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Modification impossible.",
        variant: "destructive",
      });
      throw error;
    }
  }, [api, fetchTeams, toast]);

  const handleDeleteTeam = useCallback(async (id: TeamID) => {
    try {
      await deleteTeam(api, id);
      await fetchTeams();

      toast({
        title: "Équipe supprimée",
        description: "L'équipe a été supprimée.",
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Suppression impossible.",
        variant: "destructive",
      });

      throw error;
    }
  }, [api, fetchTeams, toast]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchTeams();
    }
  }, [isAuthenticated, authLoading, fetchTeams]);

  return (
    <TeamContext.Provider
      value={{
        teams,
        rowCount,
        pagination,
        sorting,
        globalFilter,
        isLoading,

        teamWithParent,

        setPagination,
        setSorting,
        setGlobalFilter,

        addTeam: handleAddTeam,
        updateTeam: handleUpdateTeam,
        deleteTeam: handleDeleteTeam,

        fetchTeamWithParent,
      }}
    >
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
}