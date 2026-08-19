import { UserCog } from 'lucide-react';
import { ModuleHeader } from '@/modules/admin/components/module-header';
import { ModuleStats } from '@/modules/admin/components/module.stats';
import { useUser } from '@/modules/users';
import { userColumns } from './user-columns';
import { DataTable } from '@/modules/admin/components/data-table';
import { useCallback } from 'react';
import { SortingState } from '@tanstack/react-table';

export default function UserList() {
  const {
    users,
    rowCount,
    pagination,
    sorting,
    globalFilter,
    isLoading,
    setPagination,
    setSorting,
    setGlobalFilter,
  } = useUser();

  const handleSortingChange = useCallback((updater: SortingState | ((old: SortingState) => SortingState)) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
  }, [sorting, setSorting]);

  const moduleInfo = {
    title: 'Utilisateurs',
    description: 'Gérez les comptes utilisateurs, roles et permissions',
    icon: <UserCog className="size-5" />
  }

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        title={moduleInfo.title}
        description={moduleInfo.description}
      >
        {moduleInfo.icon}
      </ModuleHeader>
      <ModuleStats stats={[
        { label: 'Utilisateurs', value: rowCount },
      ]} />
      <DataTable
        columns={userColumns}
        data={users}
        searchPlaceholder="Rechercher dans les utilisateurs..."
        pagination={pagination}
        sorting={sorting}
        globalFilter={globalFilter}
        rowCount={rowCount}
        isLoading={isLoading}
        onPageChange={setPagination}
        onSortingChange={handleSortingChange}
        onGlobalFilterChange={setGlobalFilter}
      />
    </div>
  )
}
