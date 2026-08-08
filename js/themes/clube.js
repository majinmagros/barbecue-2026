import { materials, fakeShadow } from './common.js';

export default function createClube(THREE, { envMap }) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    const ground = new THREE.Mesh(
        new THREE.CircleGeometry(2.5, 40),
        materials.grass
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.01;
    ground.receiveShadow = true;
    inner.add(ground);

    const pool = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, 0.35, 1.2),
        materials.water
    );
    pool.position.set(-0.7, 0.19, -0.65);
    pool.castShadow = true;
    pool.receiveShadow = true;
    inner.add(pool);

    const poolRim = new THREE.Mesh(
        new THREE.BoxGeometry(1.96, 0.06, 1.26),
        materials.plastic(0xd9dde3)
    );
    poolRim.position.set(-0.7, 0.41, -0.65);
    poolRim.castShadow = true;
    poolRim.receiveShadow = true;
    inner.add(poolRim);

    const umbrellaColors = [0xe74c3c, 0xf1c40f];
    const umbrellas = [];

    [-0.2, 1.3].forEach((x, index) => {
        const umbrella = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8), materials.pole);
        pole.position.y = 0.55;
        pole.castShadow = true;
        umbrella.add(pole);

        const canopy = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
            materials.umbrellaFabric(umbrellaColors[index])
        );
        canopy.scale.set(1, 0.55, 1);
        canopy.position.y = 1.12;
        canopy.castShadow = true;
        umbrella.add(canopy);

        umbrella.position.set(x, 0, 0.35);
        umbrella.userData.index = index;
        inner.add(umbrella);
        umbrellas.push(umbrella);
    });

    const loungerPositions = [[0.6, 0, 0.8], [1.0, 0, 1.3]];
    loungerPositions.forEach(([x, z, angle]) => {
        const lounger = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.45), materials.lounge);
        base.position.set(0, 0.3, 0);
        base.castShadow = true;
        base.receiveShadow = true;
        lounger.add(base);

        const back = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.45, 0.08), materials.lounge);
        back.position.set(0, 0.6, -0.18);
        back.rotation.x = -Math.PI / 6;
        back.castShadow = true;
        lounger.add(back);

        const legMat = materials.pole;
        const legGeo = new THREE.BoxGeometry(0.06, 0.3, 0.06);
        [[-0.4, -0.18], [0.4, -0.18], [-0.4, 0.18], [0.4, 0.18]].forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(legGeo, legMat);
            leg.position.set(lx, 0.15, lz);
            leg.castShadow = true;
            lounger.add(leg);
        });

        lounger.position.set(x, 0, z);
        lounger.rotation.y = angle;
        inner.add(lounger);
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