import Link from "next/link"
import Image from "next/image"
import { BookOpen, ExternalLink, BarChart3, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AdditionalResources() {
  const officialDocs = [
    {
      title: "Starknet Documentation",
      description: "Complete guide to the Starknet ecosystem",
      href: "https://docs.starknet.io/",
      icon: ExternalLink,
      bgColor: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
      external: true,
      useImage: true,
      imageSrc: "/primary logo.png",
    },
    {
      title: "Numo Documentation",
      description: "Complete guide to Numo platform and features",
      href: "/docs",
      icon: BookOpen,
      bgColor: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
      external: false,
      useImage: true,
      imageSrc: "/numo-logo-blanco.png",
    },
  ]

  const tools = [
    {
      title: "Impermanent Loss Calculator",
      description: "Estimate potential losses in AMM pools",
      icon: BarChart3,
      bgColor: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
    },
    {
      title: "APY Monitor",
      description: "Track returns in real-time",
      icon: TrendingUp,
      bgColor: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
    },
  ]

  return (
    <Card className="relative overflow-hidden transition-all duration-300 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 hover:shadow-lg hover:shadow-bitcoin-orange/10 mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-bitcoin-gold" />
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
                <Link key={doc.title} href={doc.href} target={doc.external ? "_blank" : "_self"} className="block">
                  <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-bitcoin-gold/30 hover:border-bitcoin-gold/50 hover:shadow-lg hover:shadow-bitcoin-orange/10 transition-all duration-300 h-full">
                    <div className={`h-10 w-10 rounded-lg ${doc.bgColor} flex items-center justify-center flex-shrink-0 overflow-hidden mt-1.5`}>
                      {doc.useImage && doc.imageSrc ? (
                        <Image 
                          src={doc.imageSrc} 
                          alt={doc.title} 
                          width={20} 
                          height={20} 
                          className="object-contain"
                        />
                      ) : (
                        <doc.icon className={`h-5 w-5 ${doc.iconColor}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="font-medium break-words mb-1">{doc.title}</p>
                      <p className="text-sm text-muted-foreground break-words leading-relaxed">{doc.description}</p>
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
                <div key={tool.title} className="flex items-start gap-3 p-4 rounded-lg border border-border/50 hover:border-bitcoin-orange/30 hover:shadow-lg hover:shadow-bitcoin-orange/10 transition-all duration-300 h-full">
                  <div className={`h-10 w-10 rounded-lg ${tool.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="font-medium break-words mb-1">{tool.title}</p>
                    <p className="text-sm text-muted-foreground break-words leading-relaxed">{tool.description}</p>
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
