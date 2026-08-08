import { materials, fakeShadow, makeTable } from './common.js';

export default function createSucos(THREE, { envMap }) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    inner.add(makeTable(THREE, 1.9, 1.1, 0xd8c4a2));

    const colors = [0xff8c00, 0x8bc34a, 0xe53935, 0xfdd835];
    const xPositions = [-0.7, -0.23, 0.23, 0.7];

    const glassGeometry = new THREE.CylinderGeometry(0.14, 0.1, 0.5, 18, 1, true);
    const juiceGeometry = new THREE.CylinderGeometry(0.12, 0.08, 0.32, 18);
    const strawGeometry = new THREE.CylinderGeometry(0.018, 0.018, 0.5, 8);

    const glassMesh = new THREE.InstancedMesh(glassGeometry, materials.glass, xPositions.length);
    const juiceMesh = new THREE.InstancedMesh(juiceGeometry, materials.liquid(0xffffff), xPositions.length);
    const strawMesh = new THREE.InstancedMesh(strawGeometry, materials.silver, xPositions.length);

    const dummy = new THREE.Object3D();

    xPositions.forEach((x, i) => {
        dummy.position.set(x, 0.77, 0);
        dummy.updateMatrix();
        glassMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, 0.68, 0);
        dummy.updateMatrix();
        juiceMesh.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x + 0.06, 1.02, 0);
        dummy.rotation.z = -0.2;
        dummy.updateMatrix();
        strawMesh.setMatrixAt(i, dummy.matrix);
    });

    const juiceMaterials = colors.map(c => materials.liquid(c));
    const juiceColorMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
    juiceMesh.material = juiceColorMat;
    juiceMesh.instanceMatrix.needsUpdate = true;

    juiceMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(xPositions.length * 3), 3);
    colors.forEach((c, i) => {
        const color = new THREE.Color(c);
        juiceMesh.instanceColor.setXYZ(i, color.r, color.g, color.b);
    });
    juiceMesh.instanceColor.needsUpdate = true;

    glassMesh.instanceMatrix.needsUpdate = true;
    juiceMesh.instanceMatrix.needsUpdate = true;
    strawMesh.instanceMatrix.needsUpdate = true;

    glassMesh.castShadow = true;
    juiceMesh.castShadow = true;
    strawMesh.castShadow = true;

    inner.add(glassMesh, juiceMesh, strawMesh);

    inner.add(fakeShadow(THREE, 1.5, 0.2));

    return {
        group,
        update(t) {
            glassMesh.rotation.y = Math.sin(t * 0.8) * 0.25;
            juiceMesh.rotation.y = Math.sin(t * 0.8) * 0.25;
            strawMesh.rotation.y = Math.sin(t * 0.8) * 0.25;
        }
    };
}