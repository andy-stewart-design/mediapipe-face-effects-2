import GUI from "lil-gui";
import { CameraProvider } from "./lib/camera-provider";
import { FaceLandmarksProvider } from "./lib/landmarks-provider";
import { SceneManager } from "./lib/scene-provider";
import { createStats } from "./lib/utils/stats";
import "./style.css";

const DEBUG = false;

async function main() {
  const video = document.querySelector<HTMLVideoElement>(".input");
  const canvas = document.querySelector<HTMLCanvasElement>(".output");
  const gui = new GUI();
  const stats = createStats();

  if (!video || !canvas) return;

  const landmarker = await FaceLandmarksProvider.init();
  const camera = await CameraProvider.init(video, gui, 960, 720);
  const sceneManager = new SceneManager(canvas, 960 / 720, DEBUG);

  const animate = async () => {
    stats.begin();
    const results = !camera.video.paused ? landmarker.detect(video) : null;
    sceneManager.animate(results);
    stats.end();
    stats.update();
    requestAnimationFrame(animate);
  };

  animate();
}

main();
