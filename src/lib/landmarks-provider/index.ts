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

    const videoAr = videoElement.videoWidth / videoElement.videoHeight;
    const isHorizontallyCropped =
      window.innerWidth / window.innerHeight < videoAr;
    const screenAr = isHorizontallyCropped
      ? window.innerHeight / window.innerWidth
      : window.innerWidth / window.innerHeight;
    const xOff = isHorizontallyCropped ? videoAr : screenAr;
    const yOff = isHorizontallyCropped ? 1 : screenAr / videoAr;

    const rawZ = results.facialTransformationMatrixes[0]?.data[14] || -40;
    const depth = Math.max(1e-3, -rawZ); // avoid division by zero

    // Choose a reference depth where scale = 1
    const referenceDepth = 40; // tune this based on what "normal" distance is
    const minScale = 0.25;
    const maxScale = 2.5;

    let scale = referenceDepth / depth; // Perspective-like scale: closer → bigger

    console.log(Math.min(maxScale, Math.max(minScale, scale)));

    return {
      landmarks: transformLandmarks(results.faceLandmarks[0], xOff, yOff),
      zIndex: Math.min(maxScale, Math.max(minScale, scale)),
    };
  }
}
