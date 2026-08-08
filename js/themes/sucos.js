import { fakeShadow, makeTable } from './common.js';

export default function createSucos(THREE) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    inner.add(makeTable(THREE, 1.9, 1.1, 0xd8c4a2));

    const colors = [0xff8c00, 0x8bc34a, 0xe53935, 0xfdd835];
    const glasses = [];
    const xPositions = [-0.7, -0.23, 0.23, 0.7];

    xPositions.forEach((x, i) => {
        const glassGroup = new THREE.Group();
        const glassMat = new THREE.MeshStandardMaterial({
            color: 0xe6f7ff,
            roughness: 0.1,
            metalness: 0,
            transparent: true,
            opacity: 0.5
        });

        const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.5, 18, 1, true), glassMat);
        glass.position.y = 0.77;
        glassGroup.add(glass);

        const juice = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.32, 18), new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.3 }));
        juice.position.y = 0.68;
        glassGroup.add(juice);

        const straw = new THREE.Mesh(
            new THREE.CylinderGeometry(0.018, 0.018, 0.5, 8),
            new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.4 })
        );
        straw.position.set(0.06, 1.02, 0);
        straw.rotation.z = -0.2;
        glassGroup.add(straw);

        glassGroup.position.x = x;
        glassGroup.userData.index = i;
        inner.add(glassGroup);
        glasses.push(glassGroup);
    });

    inner.add(fakeShadow(THREE, 1.5, 0.2));

    return {
        group,
        update(t) {
            glasses.forEach((g) => {
                g.rotation.y = Math.sin(t * 0.8) * 0.25;
            });
        }
    };
}