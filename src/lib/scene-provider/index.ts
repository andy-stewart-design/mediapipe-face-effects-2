import * as THREE from "three";
import { Wireframe } from "./wireframe";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Environment } from "./environment";
import type { Vec3 } from "../../types";

export class SceneManager {
  private scene: THREE.Scene;
  private debug: boolean;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.OrthographicCamera;
  private sceneAspectRatio: number;
  private wireframe: Wireframe | null;
  private controls: OrbitControls | null;
  private width = typeof window !== "undefined" ? window.innerWidth : 0;
  private height = typeof window !== "undefined" ? window.innerHeight : 0;
  private abortController = new AbortController();

  constructor(canvas: HTMLCanvasElement, aspectRatio: number, debug = false) {
    this.scene = new THREE.Scene();
    this.debug = debug;
    this.sceneAspectRatio = aspectRatio;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    this.buildEnvironment();
    this.camera = this.buildOrthoCamera();
    this.wireframe = this.buildWireframe();
    this.controls = this.buildControls();
    this.resize();

    window.addEventListener("resize", this.resize.bind(this), {
      signal: this.abortController.signal,
    });
  }

  private buildEnvironment() {
    return new Environment(this.scene, this.renderer);
  }

  private buildWireframe(render = true) {
    if (!render) return null;
    return new Wireframe(this.scene);
  }

  private buildControls() {
    if (this.debug) {
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.update();
      return controls;
    }
    return null;
  }

  private buildOrthoCamera() {
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000);
    camera.position.z = 1;
    return camera;
  }

  private updateCamera() {
    const videoAr = this.sceneAspectRatio;
    console.log(this.sceneAspectRatio);

    this.camera.top = 1 * videoAr;
    this.camera.bottom = -1 * videoAr;
    this.camera.left = -1;
    this.camera.right = 1;
    this.camera.updateProjectionMatrix();
  }

  private resize() {
    const { clientWidth, clientHeight } = this.renderer.domElement;
    this.width = clientWidth;
    this.height = clientHeight;
    this.renderer.setSize(this.width, this.height, false);
    this.updateCamera();
  }

  animate(landmarks?: Vec3[] | null) {
    if (this.controls) this.controls.update();
    this.wireframe?.update(landmarks);
    this.renderer.render(this.scene, this.camera);
  }
}
