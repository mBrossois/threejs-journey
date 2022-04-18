export interface FullScreenDocument extends Document {
  mozCancelFullScreen: () => void;
  mozCancelFullscreen: () => void;
  webkitExitFullscreen: () => void;
  mozFullScreenElement: () => void;
  webkitFullscreenElement: () => void;
  msExitFullscreen: () => void;
}

export interface FullScreenDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}
