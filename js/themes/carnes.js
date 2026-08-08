import { materials, fakeShadow } from './common.js';

export default function createCarnes(THREE, { envMap }) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    const board = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, 0.18, 1.1),
        materials.wood
    );
    board.position.y = 0.24;
    board.castShadow = true;
    board.receiveShadow = true;
    inner.add(board);

    const meats = [];
    const specs = [
        { x: -0.45, z: 0.0, color: 0xc0392b, scale: [1, 0.6, 0.9], r: 0.32 },
        { x: 0.0, z: 0.25, color: 0xa12f1d, scale: [1.1, 0.65, 1], r: 0.38 },
        { x: 0.45, z: 0.0, color: 0xd3542d, scale: [1, 0.55, 0.85], r: 0.3 }
    ];

    specs.forEach((data, index) => {
        const meat = new THREE.Mesh(new THREE.SphereGeometry(data.r, 22, 16), materials.meat(data.color));
        meat.scale.set(data.scale[0], data.scale[1], data.scale[2]);
        meat.position.set(data.x, 0.24 + data.r * data.scale[1], data.z);
        meat.castShadow = true;
        inner.add(meat);
        meats.push(meat);

        const fat = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), materials.fat);
        fat.position.set(data.x + (index === 0 ? -0.08 : index === 1 ? 0.1 : 0), 0.24 + data.r * data.scale[1] * 1.12, data.z + (index === 1 ? 0.12 : 0));
        fat.castShadow = true;
        inner.add(fat);
        meats.push(fat);
    });

    inner.add(fakeShadow(THREE, 1.4, 0.35));

    return {
        group,
        update(t) {
            inner.rotation.y = Math.sin(t * 0.4) * 0.12;
            meats.forEach((m, i) => {
                m.position.y += Math.sin(t * 1.6 + i * 2.1) * 0.004;
            });
        }
    };
}