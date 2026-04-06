import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { gpuStats } from "./GpuService"
import { systemStats } from "./SystemService"

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <box cssName="stat-row" orientation={Gtk.Orientation.HORIZONTAL} spacing={8}>
      <label cssName="stat-label" label={label} halign={Gtk.Align.START} hexpand />
      <label cssName="stat-value" label={value} halign={Gtk.Align.END} />
    </box>
  )
}

function UtilBar({ value }: { value: string }) {
  const pct = parseInt(value) / 100 || 0
  const warn = pct > 0.85
  return (
    <levelbar
      cssName={warn ? "util-bar warn" : "util-bar"}
      value={pct}
      minValue={0}
      maxValue={1}
      hexpand
    />
  )
}

export default function GpuScroll(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="gpu-scroll"
      class="GpuScroll"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={BOTTOM | RIGHT}
      margin_bottom={16}
      margin_right={16}
      layer={Astal.Layer.OVERLAY}
      application={app}
    >
      <box cssName="scroll-container" orientation={Gtk.Orientation.VERTICAL} spacing={6}>
        <label cssName="scroll-title" label="▓ GPU ▓" halign={Gtk.Align.CENTER} />

        <box cssName="divider" />

        <StatRow
          label="TEMP"
          value={gpuStats(s => s.temp)}
        />

        <box cssName="stat-section" orientation={Gtk.Orientation.VERTICAL} spacing={2}>
          <StatRow
            label="GPU"
            value={gpuStats(s => s.gpuUtil)}
          />
          <UtilBar value={gpuStats(s => s.gpuUtil)} />
        </box>

        <box cssName="stat-section" orientation={Gtk.Orientation.VERTICAL} spacing={2}>
          <StatRow
            label="VRAM"
            value={gpuStats(s => s.vramUtil)}
          />
          <UtilBar value={gpuStats(s => s.vramUtil)} />
        </box>

        <box cssName="divider" />

        <label cssName="scroll-title" label="▓ SYS ▓" halign={Gtk.Align.CENTER} />

        <box cssName="divider" />

        <StatRow
          label="CPU TEMP"
          value={systemStats(s => s.cpuTemp)}
        />

        <box cssName="stat-section" orientation={Gtk.Orientation.VERTICAL} spacing={2}>
          <StatRow
            label="CPU"
            value={systemStats(s => s.cpuUtil)}
          />
          <UtilBar value={systemStats(s => s.cpuUtil)} />
        </box>

        <box cssName="stat-section" orientation={Gtk.Orientation.VERTICAL} spacing={2}>
          <StatRow
            label="RAM"
            value={systemStats(s => s.ramUtil)}
          />
          <UtilBar value={systemStats(s => s.ramUtil)} />
        </box>
      </box>
    </window>
  )
}