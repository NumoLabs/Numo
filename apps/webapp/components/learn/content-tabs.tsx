import { Lightbulb, BarChart3, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BasicsContent } from "./basics/basics-content"

export function ContentTabs() {
  return (
    <Tabs defaultValue="basics" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 h-12">
        <TabsTrigger value="basics" className="gap-2">
          <Lightbulb className="h-4 w-4" />
          Conceptos Básicos
        </TabsTrigger>
        <TabsTrigger value="pools" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Pools de Liquidez
        </TabsTrigger>
        <TabsTrigger value="risks" className="gap-2">
          <Shield className="h-4 w-4" />
          Riesgos y Estrategias
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basics">
        <BasicsContent />
      </TabsContent>

      <TabsContent value="pools" className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Contenido en Desarrollo</h3>
          <p className="text-muted-foreground">Esta sección estará disponible próximamente.</p>
        </div>
      </TabsContent>

      <TabsContent value="risks" className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Contenido en Desarrollo</h3>
          <p className="text-muted-foreground">Esta sección estará disponible próximamente.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
