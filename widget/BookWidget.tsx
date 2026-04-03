import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { gpuStats } from "./GpuService"
import { systemStats } from "./SystemService"

const FRAME_W = 190
const FRAME_H = 160
const SCALE = 3
const WIDGET_W = FRAME_W * SCALE
const WIDGET_H = FRAME_H * SCALE
const TOTAL_PAGES = 2

export default function BookWidget(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, RIGHT } = Astal.WindowAnchor

  let currentFrame = 0
  let isOpen = false
  let currentPage = 0
  let animating = false

  const GLib = (imports.gi as any).GLib
  const GdkPixbuf = (imports.gi as any).GdkPixbuf

  const pixbuf = GdkPixbuf.Pixbuf.new_from_file(
    `${GLib.get_home_dir()}/GitHub/mad-lab-widgets/assets/RADL_Book_red.png`
  )

  // Drawing area — imperative
  const drawArea = new Gtk.DrawingArea()
  drawArea.set_size_request(WIDGET_W, WIDGET_H)
  drawArea.set_draw_func((_: any, cr: any) => {
    cr.scale(SCALE, SCALE)
    const GdkCairo = (imports.gi as any).Gdk
    GdkCairo.cairo_set_source_pixbuf(cr, pixbuf, -(currentFrame * FRAME_W), 0)
    cr.rectangle(0, 0, FRAME_W, FRAME_H)
    cr.fill()
  })

  function animate(frames: number[], onDone?: () => void) {
    if (animating) return
    animating = true
    let i = 0
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 80, () => {
      currentFrame = frames[i]
      drawArea.queue_draw()
      i++
      if (i >= frames.length) {
        animating = false
        onDone?.()
        return false
      }
      return true
    })
  }

  // Content overlay
  const gpuPage = (
    <box cssName="book-page" orientation={Gtk.Orientation.VERTICAL} spacing={4}>
      <label cssName="book-page-title" label="▓ GPU ▓" />
      <label cssName="book-stat" label={gpuStats(s => `TEMP  ${s.temp}`)} />
      <label cssName="book-stat" label={gpuStats(s => `GPU   ${s.gpuUtil}`)} />
      <label cssName="book-stat" label={gpuStats(s => `VRAM  ${s.vramUtil}`)} />
    </box>
  ) as Gtk.Box

  const sysPage = (
    <box cssName="book-page" orientation={Gtk.Orientation.VERTICAL} spacing={4}>
      <label cssName="book-page-title" label="▓ SYS ▓" />
      <label cssName="book-stat" label={systemStats(s => `TEMP  ${s.cpuTemp}`)} />
      <label cssName="book-stat" label={systemStats(s => `CPU   ${s.cpuUtil}`)} />
      <label cssName="book-stat" label={systemStats(s => `RAM   ${s.ramUtil}`)} />
    </box>
  ) as Gtk.Box

  const pages = [gpuPage, sysPage]

  const contentStack = new Gtk.Stack()
  contentStack.add_named(gpuPage, "gpu")
  contentStack.add_named(sysPage, "sys")
  contentStack.set_visible_child_name("gpu")
  contentStack.set_visible(false)
  contentStack.set_halign(Gtk.Align.START)
  contentStack.set_margin_start(112)
  contentStack.set_valign(Gtk.Align.START)
  contentStack.set_margin_top(105)

  function openBook() {
    if (isOpen || animating) return
    animate([0, 1, 2, 3], () => {
      isOpen = true
      contentStack.set_visible(true)
    })
  }

  function closeBook() {
    if (!isOpen || animating) return
    contentStack.set_visible(false)
  contentStack.set_halign(Gtk.Align.START)
  contentStack.set_margin_start(112)
  contentStack.set_valign(Gtk.Align.START)
  contentStack.set_margin_top(105)
    animate([3, 2, 1, 0], () => { isOpen = false })
  }

  function turnPage() {
    if (!isOpen || animating) return
    contentStack.set_visible(false)
  contentStack.set_halign(Gtk.Align.START)
  contentStack.set_margin_start(112)
  contentStack.set_valign(Gtk.Align.START)
  contentStack.set_margin_top(105)
    animate([3, 4, 5, 6, 3], () => {
      currentPage = (currentPage + 1) % TOTAL_PAGES
      contentStack.set_visible_child_name(currentPage === 0 ? "gpu" : "sys")
      contentStack.set_visible(true)
    })
  }

  const overlay = new Gtk.Overlay()
  overlay.set_child(drawArea)
  overlay.add_overlay(contentStack)

  // Hover controller
  const hoverCtrl = new Gtk.EventControllerMotion()
  hoverCtrl.connect("enter", () => openBook())
  hoverCtrl.connect("leave", () => closeBook())
  overlay.add_controller(hoverCtrl)

  // Click controller for page turning
  const clickCtrl = new Gtk.GestureClick()
  clickCtrl.connect("pressed", () => turnPage())
  overlay.add_controller(clickCtrl)

  return (
    <window
      visible
      name="book-widget"
      class="BookWidget"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={BOTTOM | RIGHT}
      margin_bottom={16}
      margin_right={-28}
      layer={Astal.Layer.OVERLAY}
      application={app}
    >
      {overlay}
    </window>
  )
}
