import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function ProgressIndicator() {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tu Progreso de Aprendizaje</h3>
          <Badge variant="secondary" className="gap-1">
            <Star className="h-4 w-4" />
            Principiante
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Conceptos Básicos</span>
            <span>0/3 completados</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
