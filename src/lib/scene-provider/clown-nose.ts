import * as THREE from "three";
import type { Vec3 } from "../../types";

export class ClownNose {
  private scene: THREE.Scene;
  private nose: THREE.Mesh;
  private geometry: THREE.BufferGeometry;
  private material: THREE.Material;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.geometry = new THREE.SphereGeometry(0.125);
    this.material = new THREE.MeshStandardMaterial({
      color: "red",
      wireframe: false,
    });

    this.nose = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.nose);
  }

  animate(v: Vec3 | undefined, z = 1) {
    if (!v) return;

    this.nose.position.x = v.x;
    this.nose.position.y = v.y + z * 0.075;
    this.nose.position.z = v.z;
    this.nose.scale.set(z, z, z);
  }
}
