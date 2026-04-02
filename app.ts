import app from "ags/gtk4/app"
import style from "./style.scss"
import GpuScroll from "./widget/GpuScroll"

app.start({
  css: style,
  main() {
    // Only put GPU scroll on the primary monitor (index 0)
    const monitors = app.get_monitors()
    if (monitors.length > 0) GpuScroll(monitors[0])
  },
})
