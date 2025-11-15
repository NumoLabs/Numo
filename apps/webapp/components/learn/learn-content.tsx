import { HeroSection } from "./hero-section"
import { ProgressIndicator } from "./progress-indicator"
import { LearningPath } from "./learning-path"
import { ContentTabs } from "./content-tabs"

export function LearnContent() {
  return (
    <div className="max-w-6xl mx-auto">
      <HeroSection />
      <ProgressIndicator />
      <LearningPath />
      <ContentTabs />
    </div>
  )
}
