import { HeroSection } from "./hero-section"
import { ProgressIndicator } from "./progress-indicator"
import { LearningPath } from "./learning-path"
import { ContentTabs } from "./content-tabs"
import { AdditionalResources } from "./additional-resources"

export function LearnContent() {
  return (
    <div className="max-w-6xl mx-auto">
      <HeroSection />
      <ProgressIndicator />
      <LearningPath />
      <ContentTabs />
      <AdditionalResources />
    </div>
  )
}
