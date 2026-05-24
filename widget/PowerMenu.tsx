import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"

const actions = [
  { label: "Shutdown",  icon: "system-shutdown-symbolic",  cmd: "systemctl poweroff" },
  { label: "Reboot",    icon: "system-reboot-symbolic",    cmd: "systemctl reboot" },
  { label: "Suspend",   icon: "system-suspend-symbolic",   cmd: "systemctl suspend" },
  { label: "Lock",      icon: "system-lock-screen-symbolic", cmd: "hyprlock" },
  { label: "Logout",    icon: "system-log-out-symbolic",   cmd: "hyprctl dispatch exit" },
]

export default function PowerMenu(gdkmonitor: Gdk.Monitor) {
  const close = () => app.toggle_window("power-menu")

  return (
    <window
      name="power-menu"
      class="PowerMenu"
      gdkmonitor={gdkmonitor}
      application={app}
      visible={false}
      keymode={Astal.Keymode.ON_DEMAND}
      layer={Astal.Layer.OVERLAY}
      $={(self: Astal.Window) => {
        const ctrl = new Gtk.EventControllerKey()
        ctrl.connect("key-pressed", (_: Gtk.EventControllerKey, keyval: number) => {
          if (keyval === Gdk.KEY_Escape) close()
        })
        self.add_controller(ctrl)
      }}
    >
      <box
        orientation={Gtk.Orientation.VERTICAL}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        class="power-menu-box"
      >
        {actions.map(({ label, icon, cmd }) => (
          <button
            class="power-menu-btn"
            onClicked={() => {
              close()
              execAsync(cmd).catch(console.error)
            }}
          >
            <box spacing={12}>
              <image iconName={icon} iconSize={Gtk.IconSize.LARGE} />
              <label label={label} />
            </box>
          </button>
        ))}
      </box>
    </window>
  )
}
