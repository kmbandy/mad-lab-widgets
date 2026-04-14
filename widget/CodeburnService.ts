import { createPoll } from "ags/time"
import { execAsync } from "ags/process"

export interface CodeburnStats {
  todayCost: string
  todayCalls: number
  monthCost: string
  monthCalls: number
}

function parseCodeburn(output: string): CodeburnStats {
  try {
    const data = JSON.parse(output)
    return {
      todayCost:   `$${data.today.cost.toFixed(2)}`,
      todayCalls:  data.today.calls,
      monthCost:   `$${data.month.cost.toFixed(2)}`,
      monthCalls:  data.month.calls,
    }
  } catch {
    return { todayCost: "ERR", todayCalls: 0, monthCost: "ERR", monthCalls: 0 }
  }
}

// Poll every 5 minutes — codeburn reads from disk, no API call needed
export const codeburnStats = createPoll(
  { todayCost: "--", todayCalls: 0, monthCost: "--", monthCalls: 0 },
  300_000,
  () => execAsync("codeburn status --format json")
        .then(parseCodeburn)
        .catch(() => ({ todayCost: "ERR", todayCalls: 0, monthCost: "ERR", monthCalls: 0 }))
)
