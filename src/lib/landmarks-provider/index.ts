import {
  createFaceLandmarker,
  transformLandmarks,
} from "../utils/landmarker-utils";
import type { FaceLandmarker } from "@mediapipe/tasks-vision";

export class FaceLandmarksProvider {
  private _landmarker: FaceLandmarker | null = null;

  static async init() {
    const fl = await createFaceLandmarker();
    return new FaceLandmarksProvider(fl);
  }

  constructor(fl: FaceLandmarker) {
    this._landmarker = fl;
  }

  detect(videoElement: HTMLVideoElement, time?: number) {
    if (!this._landmarker) return null;

    const results = this._landmarker.detectForVideo(
      videoElement,
      time ?? Date.now()
    );

    const streamAr = videoElement.videoWidth / videoElement.videoHeight;
    const isPortrait = window.innerWidth / window.innerHeight < streamAr;
    const videoAr = videoElement.videoWidth / videoElement.videoHeight;
    const screenAr = isPortrait
      ? window.innerHeight / window.innerWidth
      : window.innerWidth / window.innerHeight;
    const arOffsets = isPortrait
      ? [screenAr * videoAr, videoAr]
      : [1, screenAr];

    return transformLandmarks(results.faceLandmarks[0], ...arOffsets);
  }
}
