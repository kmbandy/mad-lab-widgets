import { createPoll } from "ags/time"

const MAD_LAB_URL = "http://100.102.191.30:18810/api/codeburn"

export interface CodeburnStats {
  todayCost: string
  todayCalls: number
  monthCost: string
  monthCalls: number
}

const fallback: CodeburnStats = { todayCost: "--", todayCalls: 0, monthCost: "--", monthCalls: 0 }

async function fetchCodeburn(): Promise<CodeburnStats> {
  try {
    const res = await fetch(MAD_LAB_URL)
    if (!res.ok) return fallback
    const data = await res.json()
    return {
      todayCost:  `$${data.today.cost.toFixed(2)}`,
      todayCalls: data.today.calls,
      monthCost:  `$${data.month.cost.toFixed(2)}`,
      monthCalls: data.month.calls,
    }
  } catch {
    return fallback
  }
}

// Poll every 5 minutes
export const codeburnStats = createPoll(fallback, 300_000, fetchCodeburn)
