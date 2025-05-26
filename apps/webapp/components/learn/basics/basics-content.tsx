import { DefiExplanation } from "./defi-explanation"
import { KeyConcepts } from "./key-concepts"
import { StarknetSection } from "./starknet-section"

export function BasicsContent() {
  return (
    <div className="space-y-6">
      <DefiExplanation />
      <KeyConcepts />
      <StarknetSection />
    </div>
  )
}
