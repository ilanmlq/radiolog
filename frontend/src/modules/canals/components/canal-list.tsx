import { useCallback } from 'react';
import { Hash } from 'lucide-react';
import { SortingState } from '@tanstack/react-table';
import { ModuleHeader } from '@/modules/admin/components/module-header';
import { ModuleStats } from '@/modules/admin/components/module.stats';
import { DataTable } from '@/modules/admin/components/data-table';
import { canalColumns } from './canal-columns';
import { AddCanalDialog } from './add-canal-dialog';
import { useCanal } from '@/modules/canals';

export default function CanalList() {
  const {
    canals,
    rowCount,
    pagination,
    sorting,
    globalFilter,
    isLoading,
    setPagination,
    setSorting,
  } = useCanal();

  const handleSortingChange = useCallback((updater: SortingState | ((old: SortingState) => SortingState)) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
  }, [sorting, setSorting]);

  const moduleInfo = {
    title: 'Canaux',
    description: 'Gérez les canaux de communication et leurs affectations',
    icon: <Hash className="size-5" />
  }

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        title={moduleInfo.title}
        description={moduleInfo.description}
        actions={<AddCanalDialog />}
      >
        {moduleInfo.icon}
      </ModuleHeader>
      <ModuleStats stats={[
        { label: 'Canaux', value: rowCount }
      ]} />
      <DataTable
        columns={canalColumns}
        data={canals}
        searchPlaceholder="Rechercher dans les canaux..."
        pagination={pagination}
        sorting={sorting}
        globalFilter={globalFilter}
        rowCount={rowCount}
        isLoading={isLoading}
        onPageChange={setPagination}
        onSortingChange={handleSortingChange}
      />
    </div>
  )
}

