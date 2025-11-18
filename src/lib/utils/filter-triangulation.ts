import { LEFT_EYE, RIGHT_EYE, TRIANGULATION } from "../constants/geometry";

function filterTriangulation() {
  const eyeSet = new Set([...LEFT_EYE, ...RIGHT_EYE]);

  const filtered: number[] = [];
  for (let i = 0; i < TRIANGULATION.length; i += 3) {
    const a = TRIANGULATION[i];
    const b = TRIANGULATION[i + 1];
    const c = TRIANGULATION[i + 2];

    // number of vertices that are in eye sets
    const inEyeCount =
      (eyeSet.has(a) ? 1 : 0) +
      (eyeSet.has(b) ? 1 : 0) +
      (eyeSet.has(c) ? 1 : 0);

    // exclude triangles where all 3 vertices are eye vertices (preserves edges)
    if (inEyeCount < 3) {
      filtered.push(a, b, c);
    }
  }
  return filtered;
}

export { filterTriangulation };
