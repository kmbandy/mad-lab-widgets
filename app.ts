import app from "ags/gtk4/app"
import style from "./style.scss"
import PowerMenu from "./widget/PowerMenu"

app.start({
  css: style,
  instanceName: "mad-lab",
  main() {
    const monitors = app.get_monitors()
    const primary = monitors.find((m: any) => m.get_connector?.() === "DP-1") ?? monitors[0]
    if (primary) PowerMenu(primary)
  },
})
