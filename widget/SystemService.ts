import { createPoll } from "ags/time"
import { execAsync } from "ags/process"

export interface SystemStats {
  cpuTemp: string
  cpuUtil: string
  ramUtil: string
}

export const systemStats = createPoll(
  { cpuTemp: "--", cpuUtil: "--", ramUtil: "--" },
  2000,
  async () => {
    try {
      const [tempRaw, ramRaw, cpuRaw] = await Promise.all([
        execAsync("cat /sys/class/hwmon/hwmon1/temp1_input"),
        execAsync("bash -c \"free | awk '/Mem:/ {print int($3/$2*100)}'\""),
        execAsync("bash -c \"top -bn1 | awk '/Cpu/ {print int(100-$8)}'\""),
      ])

      return {
        cpuTemp: `${Math.floor(parseInt(tempRaw.trim()) / 1000)}°C`,
        ramUtil: `${ramRaw.trim()}%`,
        cpuUtil: `${cpuRaw.trim()}%`,
      }
    } catch (e) {
      return { cpuTemp: "ERR", cpuUtil: "ERR", ramUtil: "ERR" }
    }
  }
)
