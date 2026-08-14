import { MAHALAYA_GEOMETRY as G } from "../data/mahalayaGeometry";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Where the window and the radio land on screen.
 *
 * The room image is painted at `object-fit: cover`, so its window opening moves
 * with the crop. This reproduces that crop from the room's aspect and the
 * window's fractional position, so the sky behind and the click target on the
 * radio sit exactly where the painted window and sill are, at any size. Shared
 * by the scene and the page so they cannot disagree.
 */
export function mahalayaLayout(vw: number, vh: number): { win: Rect; radio: Rect } {
  const A = G.roomAspect;
  let rW: number, rH: number;
  if (vw / vh >= A) {
    rW = vw;
    rH = vw / A;
  } else {
    rH = vh;
    rW = vh * A;
  }
  // Centred horizontally, anchored to the bottom (object-position 50% 100%), so
  // the sill lands well above the screen's foot on a wide desktop and the radio
  // on it stays fully in frame.
  const ox = (vw - rW) / 2;
  const oy = vh - rH;

  const win: Rect = {
    x: ox + G.window.left * rW,
    y: oy + G.window.top * rH,
    w: (G.window.right - G.window.left) * rW,
    h: (G.window.bottom - G.window.top) * rH,
  };

  // The radio sits on the wooden sill, centred. The sill's top surface is a
  // little below the window opening in the room art, so its base rests there
  // rather than on the opening's edge. Capped so it never runs off the bottom.
  const rw = Math.min(win.w * 0.64, vw * 0.3);
  const rh = rw / G.radioAspect;
  const sillY = oy + 0.905 * rH; // top of the sill ledge, fraction of the room
  const radio: Rect = {
    x: win.x + win.w * 0.5 - rw * 0.5,
    y: Math.min(sillY - rh, vh - rh - 6),
    w: rw,
    h: rh,
  };

  return { win, radio };
}
