import { codeburnStats } from "./CodeburnService"

export default function CodeburnWidget() {
  return (
    <box class="CodeburnWidget" spacing={6}>
      <label class="codeburn-icon" label="🔥" />
      <box orientation={1} spacing={2}>
        <label
          class="codeburn-today"
          label={codeburnStats(s => `${s.todayCost} today`)}
          halign={1}
        />
        <label
          class="codeburn-month"
          label={codeburnStats(s => `${s.monthCost} / mo`)}
          halign={1}
        />
      </box>
    </box>
  )
}
