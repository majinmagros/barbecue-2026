import { fakeShadow } from './common.js';

export default function createCervejas(THREE) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    const beerColors = [0x7a5c2e, 0x3f7a2e, 0xc9a12c, 0x4a3420, 0x2e6b8a];
    const bottles = [];
    const xPositions = [-0.85, -0.42, 0, 0.42, 0.85];

    xPositions.forEach((x, i) => {
        const bottle = new THREE.Group();
        const glassMat = new THREE.MeshStandardMaterial({
            color: beerColors[i],
            roughness: 0.25,
            metalness: 0.1,
            transparent: true,
            opacity: 0.85
        });

        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.5, 18), glassMat);
        body.position.y = 0.45;
        bottle.add(body);

        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 12), glassMat);
        neck.position.y = 0.78;
        bottle.add(neck);

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.05, 12), new THREE.MeshStandardMaterial({ color: 0x8a1c1c, roughness: 0.4 }));
        cap.position.y = 0.9;
        bottle.add(cap);

        const label = new THREE.Mesh(new THREE.CylinderGeometry(0.134, 0.134, 0.16, 18), new THREE.MeshStandardMaterial({ color: 0xf3e9d2, roughness: 0.85 }));
        label.position.y = 0.4;
        bottle.add(label);

        const foam = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), new THREE.MeshStandardMaterial({ color: 0xfdf6e3, roughness: 0.9 }));
        foam.position.y = 0.95;
        bottle.add(foam);

        bottle.position.x = x;
        bottle.position.y = 0.14;
        bottle.userData.index = i;
        inner.add(bottle);
        bottles.push(bottle);
    });

    const crate = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.16, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x5d4a32, roughness: 0.85 })
    );
    crate.position.y = 0.06;
    inner.add(crate);

    inner.add(fakeShadow(THREE, 1.8, 0.32));

    return {
        group,
        update(t) {
            inner.rotation.y = Math.sin(t * 0.5) * 0.18;
            bottles.forEach((b, i) => {
                b.position.y = 0.14 + Math.sin(t * 1.2 + i * 1.5) * 0.01;
            });
        }
    };
}