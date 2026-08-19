import Teams from '@/modules/teams/components/Teams'
import { TeamProvider } from '@/modules/teams/team.provider'

export default function UsersPage() {
  return (
    <TeamProvider>
      <Teams />
    </TeamProvider>
  )
  // return <Teams />
}