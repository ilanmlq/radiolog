import { ModuleHeader } from '@/modules/admin/components/module-header'
import { Users } from 'lucide-react';
import { ModuleStats } from '@/modules/admin/components/module.stats'
import { DataTable } from '@/modules/admin/components/data-table'
import { useCallback } from 'react'
import { useNavigate } from "react-router-dom";
import { AddMemberDialog } from '@/modules/members/components/add-member-dialog';
import { SortingState } from '@tanstack/react-table'
import { memberColumns } from '@/modules/members/components/member-columns';
import { MemberSummary, useMember } from '@/modules/members';

export default function MembersPage() {
  const {
    members,
    rowCount,
    responsibleCount,
    pagination,
    sorting,
    globalFilter,
    isLoading,
    setPagination,
    setSorting,
  } = useMember();

  const handleSortingChange = useCallback((updater: SortingState | ((old: SortingState) => SortingState)) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
  }, [sorting, setSorting]);

  const navigate = useNavigate()

  const moduleInfo = {
    title: 'Membres',
    description: 'Gérez les inscriptions, les rôles et les coordonnées des membres',
    icon: <Users className="size-5" />
  }

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        title={moduleInfo.title}
        description={moduleInfo.description}
        actions={<AddMemberDialog />}
      >
        {moduleInfo.icon}
      </ModuleHeader>

      <ModuleStats stats={[
        { label: "Bénévoles", value: rowCount - responsibleCount },
        { label: "Responsables", value: responsibleCount },
      ]} />

      <DataTable
        columns={memberColumns}
        data={members}
        searchPlaceholder="Rechercher dans les membres..."
        pagination={pagination}
        sorting={sorting}
        globalFilter={globalFilter}
        rowCount={rowCount}
        isLoading={isLoading}
        onPageChange={setPagination}
        onSortingChange={handleSortingChange}
        onRowClick={(row: MemberSummary) => {
          navigate(`/admin/members/${row.id}`)
        }}

      />
    </div>
  )
}
