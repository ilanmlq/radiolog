import { MemberID, MemberSummary, CreateMemberDTO, UpdateMemberDTO, TeamID } from './member.model';
import { Team } from '@/modules/teams/team.model'
import { listMembers, deleteMember, createMember, updateMember } from './member.service';
import { listTeams } from '@/modules/teams/team.service'
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/hooks/use-auth';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination-contants';

const INITIAL_SORT_BY = 'number';
const MAX_API_PAGE_SIZE = 100;

interface MemberContextValue {
  members: MemberSummary[]
  teams: Team[]
  membersNoLimit: MemberSummary[]
  teamsNoLimit: Team[]
  rowCount: number
  responsibleCount: number
  pagination: PaginationState
  sorting: SortingState
  globalFilter: string
  isLoading: boolean
  setPagination: (pagination: PaginationState) => void
  setSorting: (sorting: SortingState) => void
  setGlobalFilter: (filter: string) => void
  addMember: (data: CreateMemberDTO) => Promise<void>
  updateMember: (id: MemberID, data: UpdateMemberDTO) => Promise<void>
  deleteMember: (id: MemberID) => Promise<void>
}

const MemberContext = createContext<MemberContextValue | undefined>(undefined)

function getMemberTeamIds(member: MemberSummary): TeamID[] {
  if (member.teamId?.length) {
    return member.teamId
  }

  return Array.isArray(member.teamId) ? member.teamId : [member.teamId]
}

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<MemberSummary[]>([])
  const [membersNoLimit, setmembersNoLimit] = useState<MemberSummary[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [teamsNoLimit, setTeamsNoLimit] = useState<Team[]>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [responsibleCount, setResponsibleCount] = useState<number>(0)
  const [pagination, setPagination] = useState<PaginationState>({ pageSize: DEFAULT_PAGE_SIZE, pageIndex: 0 })
  const [sorting, setSorting] = useState<SortingState>([{ id: INITIAL_SORT_BY, desc: false }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const api = useApi()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const fetchMembers = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;

    setIsLoading(true)
    try {
      const sortBy = sorting.length > 0 ? sorting[0].id : INITIAL_SORT_BY
      const sortOrder = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc'

      const result = await listMembers(api, {
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
          query: globalFilter,
          sortBy,
          sortOrder,
        })
      const teamsResult = await listTeams(api, {
        limit: 100,
        offset: 0,
      })

      const teams = teamsResult.items
      setTeams(teams)

      const teamMap = new Map(teams.map(t => [t.id, t.name]))
      const respMap = new Map(teams.map(t => [t.id, t.teamLeaders]))

      const enrichMember = (member: MemberSummary): MemberSummary => {
        const memberTeamIds = getMemberTeamIds(member)

        return {
          ...member,
          teamId: memberTeamIds,
          teamName: memberTeamIds.map((teamId) => teamMap.get(teamId) ?? "Inconnu").join(", "),
          isResponsable: memberTeamIds.some((teamId) => respMap.get(teamId)?.includes(member.id) ?? false)
        }
      }

      const enrichedMembers = result.items.map(enrichMember)
      setMembers(enrichedMembers)
      setRowCount(result.total)

      if (result.total === result.items.length) {
        setResponsibleCount(enrichedMembers.filter(member => member.isResponsable).length)
        return
      }

      if (result.total === 0) {
        setResponsibleCount(0)
        return
      }

      const statsPages = await Promise.all(
        Array.from(
          { length: Math.ceil(result.total / MAX_API_PAGE_SIZE) },
          (_, index) => listMembers(api, {
            limit: MAX_API_PAGE_SIZE,
            offset: index * MAX_API_PAGE_SIZE,
            query: globalFilter,
          })
        )
      )

      const allMembers = statsPages.flatMap(page => page.items)
      setResponsibleCount(
        allMembers
          .map(enrichMember)
          .filter(member => member.isResponsable).length
      )
    } catch (error) {
      console.error("Failed to load members:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des membres.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [api, toast, isAuthenticated, authLoading, pagination, sorting, globalFilter])

  const fetchMembersNoLimit = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;

    setIsLoading(true)
    try {
      const sortBy = sorting.length > 0 ? sorting[0].id : INITIAL_SORT_BY
      const sortOrder = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc'

      const result = await listMembers(api, {
          limit: 10000,
          offset: pagination.pageIndex * pagination.pageSize,
          query: globalFilter,
          sortBy,
          sortOrder,
        })
      const teamsResult = await listTeams(api, {
        limit: 100,
        offset: 0,
      })

      const teams = teamsResult.items
      setTeamsNoLimit(teams)

      const teamMap = new Map(teams.map(t => [t.id, t.name]))
      const respMap = new Map(teams.map(t => [t.id, t.teamLeaders]))


      setmembersNoLimit(result.items.map(member => {
        const memberTeamIds = getMemberTeamIds(member)

        return {
            ...member,
            teamId: memberTeamIds,
            teamName: memberTeamIds.map((teamId) => teamMap.get(teamId) ?? "Inconnu").join(", "),
            isResponsable: memberTeamIds.some((teamId) => respMap.get(teamId)?.includes(member.id) ?? false)
        }
      }))
      setRowCount(result.total)
    } catch (error) {
      console.error("Failed to load members:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des membres.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [api, toast, isAuthenticated, authLoading, pagination, sorting, globalFilter])

  const handleSetPagination = useCallback((newPagination: PaginationState) => {
    setPagination(newPagination)
  }, [setPagination])

  const handleSetSorting = useCallback((newSorting: SortingState) => {
    setSorting(newSorting)
    setPagination({...pagination, pageIndex: 0 })
  }, [setSorting, pagination])

  const handleSetGlobalFilter = useCallback((filter: string) => {
    setGlobalFilter(filter)
    setPagination({...pagination, pageIndex: 0 })
  }, [setGlobalFilter, pagination])

  const handleAddMember = useCallback(async (data: CreateMemberDTO) => {
    try {
      await createMember(api, data)
      await fetchMembers()
      toast({
        title: "Member créé",
        description: "Le membre a été créé avec succès.",
      })
    } catch (error) {
      console.error("Failed to create member:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du membre.",
        variant: "destructive",
      })
      throw error
    }
  }, [api, fetchMembers, toast])

  const handleUpdateMember = useCallback(async (id: MemberID, data: UpdateMemberDTO) => {
    try {
      await updateMember(api, id, data)
      await fetchMembers()
      toast({
        title: "Membre modifié",
        description: "Le membre a été modifié avec succès.",
      })
    } catch (error) {
      console.error("Failed to update member:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du membre.",
        variant: "destructive",
      })
      throw error
    }
  }, [api, fetchMembers, toast])

  const handleDeleteMember = useCallback(async (id: MemberID) => {
    try {
      await deleteMember(api, id)
      await fetchMembers()
      toast({
        title: "Member supprimé",
        description: "Le membre a été supprimé avec succès.",
      })
    } catch (error) {
      console.error("Failed to delete member:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du membre.",
        variant: "destructive",
      })
      throw error
    }
  }, [api, fetchMembers, toast])

  // Load members when authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchMembers()
      fetchMembersNoLimit()
    }
  }, [isAuthenticated, authLoading, fetchMembers, fetchMembersNoLimit])

  return (
    <MemberContext.Provider
      value={{
        members,
        teams,
        rowCount,
        responsibleCount,
        pagination,
        sorting,
        globalFilter,
        isLoading,
        membersNoLimit,
        teamsNoLimit,
        setPagination: handleSetPagination,
        setSorting: handleSetSorting,
        setGlobalFilter: handleSetGlobalFilter,
        addMember: handleAddMember,
        updateMember: handleUpdateMember,
        deleteMember: handleDeleteMember,
      }}
    >
      {children}
    </MemberContext.Provider>
  )
}

export function useMember() {
  const ctx = useContext(MemberContext)
  if (!ctx) throw new Error("useMember must be used within MemberProvider")
  return ctx
}
