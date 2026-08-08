import { materials, fakeShadow } from './common.js';

export default function createCervejas(THREE, { envMap }) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    const beerColors = [0x7a5c2e, 0x3f7a2e, 0xc9a12c, 0x4a3420, 0x2e6b8a];
    const xPositions = [-0.85, -0.42, 0, 0.42, 0.85];

    const bottleGeometry = new THREE.CylinderGeometry(0.13, 0.13, 0.5, 18);
    const neckGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.22, 12);
    const capGeometry = new THREE.CylinderGeometry(0.055, 0.055, 0.05, 12);
    const labelGeometry = new THREE.CylinderGeometry(0.134, 0.134, 0.16, 18);
    const foamGeometry = new THREE.SphereGeometry(0.06, 12, 10);

    const bottleMesh = new THREE.InstancedMesh(bottleGeometry, materials.glass, 5);
    const neckMesh = new THREE.InstancedMesh(neckGeometry, materials.glass, 5);
    const capMesh = new THREE.InstancedMesh(capGeometry, materials.metal(0x8a1c1c), 5);
    const labelMesh = new THREE.InstancedMesh(labelGeometry, materials.label, 5);
    const foamMesh = new THREE.InstancedMesh(foamGeometry, materials.foam, 5);

    const dummy = new THREE.Object3D();

    xPositions.forEach((x, i) => {
        dummy.position.set(x, 0.14, 0);
        dummy.updateMatrix();
        bottleMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, 0.14 + 0.78, 0);
        dummy.updateMatrix();
        neckMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, 0.14 + 0.9, 0);
        dummy.updateMatrix();
        capMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, 0.14 + 0.4, 0);
        dummy.updateMatrix();
        labelMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, 0.14 + 0.95, 0);
        dummy.updateMatrix();
        foamMesh.setMatrixAt(i, dummy.matrix);
    });

    bottleMesh.instanceMatrix.needsUpdate = true;
    neckMesh.instanceMatrix.needsUpdate = true;
    capMesh.instanceMatrix.needsUpdate = true;
    labelMesh.instanceMatrix.needsUpdate = true;
    foamMesh.instanceMatrix.needsUpdate = true;

    bottleMesh.castShadow = true;
    neckMesh.castShadow = true;
    capMesh.castShadow = true;
    labelMesh.castShadow = true;
    foamMesh.castShadow = true;

    inner.add(bottleMesh, neckMesh, capMesh, labelMesh, foamMesh);

    const crate = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.16, 0.9),
        materials.wood
    );
    crate.position.y = 0.06;
    crate.castShadow = true;
    crate.receiveShadow = true;
    inner.add(crate);

    inner.add(fakeShadow(THREE, 1.8, 0.32));

    return {
        group,
        update(t) {
            inner.rotation.y = Math.sin(t * 0.5) * 0.18;
        }
    };
}