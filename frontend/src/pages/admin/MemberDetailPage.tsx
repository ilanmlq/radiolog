import MemberDetailPage from "@/modules/members/member-details"
import { TeamProvider } from "@/modules/teams/team.provider"

export default function DirectoryPage() {
    return (
        <TeamProvider>
          <MemberDetailPage />
        </TeamProvider>
      )
}

