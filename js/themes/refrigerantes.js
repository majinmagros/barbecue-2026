import { materials, fakeShadow, makeTable } from './common.js';

export default function createRefrigerantes(THREE, { envMap }) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    inner.add(makeTable(THREE, 1.6, 1.2, 0xbfa98a));

    const cans = [];
    const canGeometry = new THREE.CylinderGeometry(0.14, 0.12, 0.42, 18);
    const bandGeometry = new THREE.CylinderGeometry(0.142, 0.122, 0.14, 18);
    const lidGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 18);
    const baseGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 18);

    const positions = [
        [-0.28, 0.05],
        [0.0, 0.12],
        [0.28, 0.05],
        [-0.14, 0.55],
        [0.14, 0.55],
        [0.0, 0.95]
    ];

    const canMesh = new THREE.InstancedMesh(canGeometry, materials.redCoke, positions.length);
    const bandMesh = new THREE.InstancedMesh(bandGeometry, materials.plastic(0xf2f2f2), positions.length);
    const lidMesh = new THREE.InstancedMesh(lidGeometry, materials.silver, positions.length);
    const baseMesh = new THREE.InstancedMesh(baseGeometry, materials.silver, positions.length);

    const dummy = new THREE.Object3D();

    positions.forEach(([x, z], i) => {
        dummy.position.set(x, 0.5, z);
        dummy.updateMatrix();
        canMesh.setMatrixAt(i, dummy.matrix);
        bandMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, 0.5 + 0.21, z);
        dummy.updateMatrix();
        bandMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, 0.5 + 0.41, z);
        dummy.updateMatrix();
        lidMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, 0.5 + 0.015, z);
        dummy.updateMatrix();
        baseMesh.setMatrixAt(i, dummy.matrix);
    });

    canMesh.instanceMatrix.needsUpdate = true;
    bandMesh.instanceMatrix.needsUpdate = true;
    lidMesh.instanceMatrix.needsUpdate = true;
    baseMesh.instanceMatrix.needsUpdate = true;

    canMesh.castShadow = true;
    bandMesh.castShadow = true;
    lidMesh.castShadow = true;
    baseMesh.castShadow = true;

    inner.add(canMesh, bandMesh, lidMesh, baseMesh);

    inner.add(fakeShadow(THREE, 1.3, 0.25));

    return {
        group,
        update(t) {
            inner.rotation.y = Math.sin(t * 0.5) * 0.15;
        }
    };
}