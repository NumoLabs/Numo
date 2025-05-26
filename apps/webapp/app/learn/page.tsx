import { Header } from "@/components/ui/header"
import { HeroSection } from "@/components/learn/hero-section"
import { ProgressIndicator } from "@/components/learn/progress-indicator"
import { LearningPath } from "@/components/learn/learning-path"
import { ContentTabs } from "@/components/learn/content-tabs"
import { AdditionalResources } from "@/components/learn/additional-resources"

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" />
      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="max-w-6xl mx-auto">
          <HeroSection />
          <ProgressIndicator />
          <LearningPath />
          <ContentTabs />
          <AdditionalResources />
        </div>
      </main>
    </div>
  )
}
