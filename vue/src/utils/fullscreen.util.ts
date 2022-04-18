import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";

const doc = document as FullScreenDocument

export const fullscreenUtil = (canvas: FullScreenDocumentElement) => {
  // Double click to full screen
  window.addEventListener('dblclick', () => {

    const fullscreenElement = doc.fullscreenElement || doc.webkitFullscreenElement

    // Check if screen isn't full screen, then make it fullscreen
    if (!fullscreenElement) {
      if(canvas.requestFullscreen) {
        canvas.requestFullscreen()
      } else if(canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen()
      }
    // Fullscreen? Well let's size that down!
    } else {
      if(doc.exitFullscreen()) {
        doc.exitFullscreen()
      } else if(doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen()
      }
    }
  })
}
