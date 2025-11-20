import * as THREE from "three";
import type { Vec3 } from "../../types";
import { FILTERED_TRIANGULATION as TRIANGULATION } from "../constants/geometry";

export class FaceMesh {
  private scene: THREE.Scene;
  private face: THREE.Mesh;
  private geometry: THREE.BufferGeometry;
  private material: THREE.Material;
  private positionAttr: THREE.BufferAttribute | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setIndex(TRIANGULATION);
    this.material = new THREE.MeshNormalMaterial({ wireframe: false });

    this.face = new THREE.Mesh(this.geometry, this.material);
    this.face.visible = false; // start hidden until we have landmarks
    this.face.position.set(0, 0, 0);

    this.scene.add(this.face);
  }

  private getPositionAttr(itemCount: number) {
    const itemSize = 3;
    const arraySize = itemCount * itemSize;

    if (this.positionAttr === null) {
      const array = new Float32Array(arraySize);
      this.positionAttr = new THREE.BufferAttribute(array, itemSize);

      this.positionAttr.setUsage(THREE.DynamicDrawUsage); // hint that it will change often
      this.geometry.setAttribute("position", this.positionAttr);
    }

    return this.positionAttr;
  }

  update(landmarks?: Vec3[] | null) {
    if (!landmarks || landmarks.length === 0) {
      this.face.visible = false;
      return;
    }

    const attr = this.getPositionAttr(landmarks.length);
    const array = attr.array;

    for (let i = 0; i < landmarks.length; i++) {
      array[i * 3 + 0] = landmarks[i].x;
      array[i * 3 + 1] = landmarks[i].y;
      array[i * 3 + 2] = landmarks[i].z;
    }

    attr.needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.face.visible = true;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.face);

    this.positionAttr = null;
  }
}
