import app from "ags/gtk4/app"
import style from "./style.scss"
import BookWidget from "./widget/BookWidget"

app.start({
  css: style,
  main() {
    const monitors = app.get_monitors()
    // Find DP-2 monitor or fall back to first
    const target = monitors.find((m: any) => m.get_connector?.() === 'DP-2') ?? monitors[0]
    if (target) BookWidget(target)
  },
})
