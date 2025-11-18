import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import type { Vec3 } from "../../types";

async function createFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  const faceLandmarker = await FaceLandmarker.createFromOptions(
    filesetResolver,
    {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "GPU",
      },
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
      runningMode: "VIDEO",
      numFaces: 1,
    }
  );
  return faceLandmarker;
}

function transformLandmarks(
  landmarks: Vec3[] | null,
  xRatioOffset = 1,
  yRatioOffset = 1
) {
  if (!landmarks) return landmarks;

  // 1) invert z because tasks-vision uses negative = closer
  const invertedZ = landmarks.map((l) => -l.z);

  // 2) compute ear baseline using indices 234 and 454 if available.
  //    If either ear index missing, fall back to the global minimum inverted z
  // const earA =
  //   typeof landmarks[234] !== "undefined"
  //     ? invertedZ[234]
  //     : Number.NEGATIVE_INFINITY;
  // const earB =
  //   typeof landmarks[454] !== "undefined"
  //     ? invertedZ[454]
  //     : Number.NEGATIVE_INFINITY;
  // const baseline =
  //   Math.max(earA, earB) === Number.NEGATIVE_INFINITY
  //     ? Math.min(...invertedZ) // fallback if ears aren't present
  //     : Math.max(earA, earB);

  const earA = invertedZ[234];
  const earB = invertedZ[454];
  const baseline = Math.max(earA, earB);

  // 3) produce transformed landmarks
  return landmarks.map((lm, i) => ({
    x: (lm.x * 2 - 1) * xRatioOffset,
    y: (1 - lm.y * 2) * yRatioOffset,
    z: invertedZ[i] - baseline,
  }));
}

export { createFaceLandmarker, transformLandmarks };
