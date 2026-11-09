import type { Material, Object3D, Texture } from 'three/webgpu';

function disposeMaterial(material: Material) {
  for (const value of Object.values(material)) {
    if (value && typeof value === 'object' && (value as Texture).isTexture) (value as Texture).dispose();
  }
  material.dispose();
}

/** Frees GPU resources (geometries, materials, textures) under `root`. */
export function disposeTree(root: Object3D): void {
  root.traverse((object) => {
    const mesh = object as Object3D & {
      geometry?: { dispose(): void };
      material?: Material | Material[];
    };
    mesh.geometry?.dispose();
    if (Array.isArray(mesh.material)) mesh.material.forEach(disposeMaterial);
    else if (mesh.material) disposeMaterial(mesh.material);
  });
  root.removeFromParent();
}
