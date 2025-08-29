import { Lightbulb, BarChart3, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BasicsContent } from "./basics/basics-content"

export function ContentTabs() {
  return (
    <Tabs defaultValue="basics" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 h-12">
        <TabsTrigger 
          value="basics" 
          className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
        >
          <Lightbulb className="h-4 w-4" />
          Basic Concepts
        </TabsTrigger>
        <TabsTrigger 
          value="pools" 
          className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
        >
          <BarChart3 className="h-4 w-4" />
          Liquidity Pools
        </TabsTrigger>
        <TabsTrigger 
          value="risks" 
          className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
        >
          <Shield className="h-4 w-4" />
          Risks and Strategies
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basics">
        <BasicsContent />
      </TabsContent>

      <TabsContent value="pools" className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Content in Development</h3>
          <p className="text-muted-foreground">This section will be available soon.</p>
        </div>
      </TabsContent>

      <TabsContent value="risks" className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Content in Development</h3>
          <p className="text-muted-foreground">This section will be available soon.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
