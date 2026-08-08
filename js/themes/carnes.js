import { fakeShadow } from './common.js';

export default function createCarnes(THREE) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    const board = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, 0.18, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x9c6b3a, roughness: 0.9 })
    );
    board.position.y = 0.24;
    inner.add(board);

    const plates = [];
    const plateData = [
        { x: -0.45, z: 0.0, color: 0xc0392b, scale: [1, 0.6, 0.9], r: 0.32 },
        { x: 0.0, z: 0.25, color: 0xa12f1d, scale: [1.1, 0.65, 1], r: 0.38 },
        { x: 0.45, z: 0.0, color: 0xd3542d, scale: [1, 0.55, 0.85], r: 0.3 }
    ];

    plateData.forEach((data, index) => {
        const meat = new THREE.Mesh(new THREE.SphereGeometry(data.r, 22, 16), new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.55 }));
        meat.scale.set(data.scale[0], data.scale[1], data.scale[2]);
        meat.position.set(data.x, 0.24 + data.r * data.scale[1], data.z);
        inner.add(meat);
        plates.push(meat);

        const fat = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), new THREE.MeshStandardMaterial({ color: 0xf5e3c8, roughness: 0.7 }));
        fat.position.set(data.x + (index === 0 ? -0.08 : index === 1 ? 0.1 : 0), 0.24 + data.r * data.scale[1] * 1.12, data.z + (index === 1 ? 0.12 : 0));
        inner.add(fat);
        plates.push(fat);
    });

    inner.add(fakeShadow(THREE, 1.4, 0.35));

    return {
        group,
        update(t) {
            inner.rotation.y = Math.sin(t * 0.4) * 0.12;
            plates.forEach((p, i) => {
                p.position.y += Math.sin(t * 1.6 + i * 2.1) * 0.004;
            });
        }
    };
}