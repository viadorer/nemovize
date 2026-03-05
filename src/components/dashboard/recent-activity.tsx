import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateShort } from "@/lib/format"
import type { Activity } from "@/types"

interface RecentActivityProps {
  activities: Activity[]
}

const entityLabels: Record<string, string> = {
  property: "Nemovitost",
  client: "Klient",
  inquiry: "Poptávka",
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Poslední aktivita</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
Žádná aktivita
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    {activity.description ?? activity.action}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">
                      {entityLabels[activity.entity_type] ?? activity.entity_type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateShort(activity.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
