import Link from "next/link"
import { BookOpen, ExternalLink, BarChart3, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AdditionalResources() {
  const officialDocs = [
    {
      title: "Starknet Documentation",
      description: "Complete guide to the Starknet ecosystem",
      href: "https://docs.starknet.io/documentation/",
      icon: ExternalLink,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600",
      external: true,
    },
    {
      title: "Advanced Concepts",
      description: "Advanced DeFi strategies and techniques",
      href: "/learn/advanced",
      icon: BookOpen,
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600",
      external: false,
    },
  ]

  const tools = [
    {
      title: "Impermanent Loss Calculator",
      description: "Estimate potential losses in AMM pools",
      icon: BarChart3,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600",
    },
    {
      title: "APY Monitor",
      description: "Track returns in real-time",
      icon: TrendingUp,
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-indigo-500" />
          Additional Resources
        </CardTitle>
        <CardDescription>Continue your DeFi education</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Official Documentation</h4>
            <div className="space-y-3">
              {officialDocs.map((doc) => (
                <Link key={doc.title} href={doc.href} target={doc.external ? "_blank" : "_self"}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div className={`h-10 w-10 rounded-lg ${doc.bgColor} flex items-center justify-center`}>
                      <doc.icon className={`h-5 w-5 ${doc.iconColor}`} />
                    </div>
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Useful Tools</h4>
            <div className="space-y-3">
              {tools.map((tool) => (
                <div key={tool.title} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className={`h-10 w-10 rounded-lg ${tool.bgColor} flex items-center justify-center`}>
                    <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-medium">{tool.title}</p>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
