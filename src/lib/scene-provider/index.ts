import * as THREE from "three";
import { FaceMesh } from "./facemesh";
import { ClownNose } from "./clown-nose";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Environment } from "./environment";
import type { Vec3 } from "../../types";

export class SceneManager {
  private scene: THREE.Scene;
  private debug: boolean;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.OrthographicCamera;
  private sceneAspectRatio: number;
  private facemesh: FaceMesh | undefined;
  private nose: ClownNose | undefined;
  private controls: OrbitControls | null;
  private width = typeof window !== "undefined" ? window.innerWidth : 0;
  private height = typeof window !== "undefined" ? window.innerHeight : 0;
  private abortController = new AbortController();

  constructor(canvas: HTMLCanvasElement, aspectRatio: number, debug = false) {
    this.scene = new THREE.Scene();
    this.debug = debug;
    this.sceneAspectRatio = aspectRatio;
    this.sceneAspectRatio = window.innerWidth / window.innerHeight;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    new Environment(this.scene, this.renderer);
    // this.scene.add(new THREE.AmbientLight(0xffffff, 1));
    // const light = new THREE.PointLight(0xffffff, 2, 10);
    // light.position.set(-0.5, 1, 0.5);
    // const helper = new THREE.PointLightHelper(light, 1);
    // this.scene.add(light);
    // this.scene.add(helper);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000);
    this.facemesh = new FaceMesh(this.scene);
    this.nose = new ClownNose(this.scene);
    this.controls = this.buildControls();
    this.resize();

    window.addEventListener("resize", this.resize.bind(this), {
      signal: this.abortController.signal,
    });
  }

  private buildControls() {
    if (this.debug) {
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.update();
      return controls;
    }
    return null;
  }

  private updateCamera() {
    this.camera.left = -1 * this.sceneAspectRatio;
    this.camera.right = 1 * this.sceneAspectRatio;
    this.camera.top = 1;
    this.camera.bottom = -1;
    this.camera.updateProjectionMatrix();
  }

  private resize() {
    const { clientWidth, clientHeight } = this.renderer.domElement;

    this.width = clientWidth;
    this.height = clientHeight;
    this.sceneAspectRatio = this.width / this.height;
    this.renderer.setSize(this.width, this.height, false);
    this.updateCamera();
  }

  animate(landmarks?: Vec3[] | null, zIndex?: number) {
    if (this.controls) this.controls.update();
    this.facemesh?.update(landmarks);
    this.renderer.render(this.scene, this.camera);
    this.nose?.animate(landmarks?.[19], zIndex);
  }
}
