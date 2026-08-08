import { fakeShadow } from './common.js';

export default function createClube(THREE) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    const ground = new THREE.Mesh(
        new THREE.CircleGeometry(2.5, 40),
        new THREE.MeshStandardMaterial({ color: 0x8ec06c, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.01;
    inner.add(ground);

    const pool = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, 0.35, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x1f6feb, roughness: 0.2, metalness: 0.1 })
    );
    pool.position.set(-0.7, 0.19, -0.65);
    inner.add(pool);

    const poolRim = new THREE.Mesh(
        new THREE.BoxGeometry(1.96, 0.06, 1.26),
        new THREE.MeshStandardMaterial({ color: 0xd9dde3, roughness: 0.6 })
    );
    poolRim.position.set(-0.7, 0.41, -0.65);
    inner.add(poolRim);

    const umbrellaColors = [0xe74c3c, 0xf1c40f];
    const umbrellas = [];

    [-0.2, 1.3].forEach((x, index) => {
        const umbrella = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8), new THREE.MeshStandardMaterial({ color: 0x7f8c8d, roughness: 0.6 }));
        pole.position.y = 0.55;
        umbrella.add(pole);

        const canopy = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshStandardMaterial({
                color: umbrellaColors[index],
                roughness: 0.7,
                side: THREE.DoubleSide
            })
        );
        canopy.scale.set(1, 0.55, 1);
        canopy.position.y = 1.12;
        umbrella.add(canopy);

        umbrella.position.set(x, 0, 0.35);
        umbrella.userData.index = index;
        inner.add(umbrella);
        umbrellas.push(umbrella);
    });

    inner.add(fakeShadow(THREE, 2.2, 0.12));

    return {
        group,
        update(t) {
            umbrellas.forEach((u) => {
                u.rotation.y = Math.sin(t * 0.6 + u.userData.index) * 0.08;
            });
            pool.position.y = 0.19 + Math.sin(t * 0.6) * 0.015;
        }
    };
}