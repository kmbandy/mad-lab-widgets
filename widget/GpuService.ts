import { createPoll } from "ags/time"
import { execAsync } from "ags/process"

export interface GpuStats {
  temp: string
  gpuUtil: string
  vramUtil: string
}

function parseRocmSmi(output: string): GpuStats {
  for (const line of output.split("\n")) {
    if (/^\d/.test(line.trim())) {
      const parts = line.trim().split(/\s+/)
      return {
        temp:     parts[4] ?? "?°C",
        vramUtil: parts[parts.length - 2] ?? "?%",
        gpuUtil:  parts[parts.length - 1] ?? "?%",
      }
    }
  }
  return { temp: "?°C", gpuUtil: "?%", vramUtil: "?%" }
}

export const gpuStats = createPoll(
  { temp: "--", gpuUtil: "--", vramUtil: "--" },
  2000,
  () => execAsync("/home/kmbandy/therock-rocm7/bin/rocm-smi")
        .then(parseRocmSmi)
        .catch(() => ({ temp: "ERR", gpuUtil: "ERR", vramUtil: "ERR" }))
)
