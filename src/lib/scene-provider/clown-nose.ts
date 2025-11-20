import * as THREE from "three";
import type { Vec3 } from "../../types";

export class ClownNose {
  private scene: THREE.Scene;
  private nose: THREE.Mesh;
  private geometry: THREE.BufferGeometry;
  private material: THREE.Material;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.geometry = new THREE.SphereGeometry(0.1);
    this.material = new THREE.MeshNormalMaterial({
      // color: "red",
      wireframe: false,
    });

    this.nose = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.nose);
  }

  animate(v: Vec3 | undefined, z = 1) {
    if (!v) return;

    const ratio = window.innerWidth / window.innerHeight;
    const scaleOffset =
      window.innerWidth / window.innerHeight > 4 / 3 ? ratio : 1.333;
    const scale = z * scaleOffset;
    const yDistanceOffset = z * 0.05;
    const yScreenWidthOffset = Math.max(0, ratio - 1) * 0.0375 * z;

    this.nose.position.x = v.x;
    this.nose.position.y = v.y + yDistanceOffset + yScreenWidthOffset;
    this.nose.position.z = v.z;
    this.nose.scale.set(scale, scale, scale);
  }

  resize() {
    this.geometry.scale;
  }
}
