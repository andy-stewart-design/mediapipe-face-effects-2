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
    this.material = new THREE.MeshStandardMaterial({
      color: "red",
      wireframe: false,
    });

    this.nose = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.nose);
  }

  animate(v: Vec3 | undefined, z = 1) {
    if (!v) return;

    const ratio = window.innerWidth / window.innerHeight;
    const offset =
      window.innerWidth / window.innerHeight > 4 / 3 ? ratio : 1.333;
    const scale = z * offset;

    this.nose.position.x = v.x;
    this.nose.position.y = v.y + z * 0.075;
    this.nose.position.z = v.z;
    this.nose.scale.set(scale, scale, scale);
  }

  resize() {
    this.geometry.scale;
  }
}
