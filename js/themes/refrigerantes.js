import { fakeShadow, makeTable } from './common.js';

export default function createRefrigerantes(THREE) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    inner.add(makeTable(THREE, 1.6, 1.2, 0xbfa98a));

    const cans = [];
    const canMat = new THREE.MeshStandardMaterial({ color: 0xd52b2b, roughness: 0.35, metalness: 0.2 });
    const lidMat = new THREE.MeshStandardMaterial({ color: 0xdfe3e6, roughness: 0.3, metalness: 0.6 });

    function addCan(x, z, rotY) {
        const can = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.42, 18), canMat);
        body.position.y = 0.21;
        can.add(body);

        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.142, 0.122, 0.14, 18), new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.5 }));
        band.position.y = 0.21;
        can.add(band);

        const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 18), lidMat);
        lid.position.y = 0.41;
        can.add(lid);

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 18), lidMat);
        base.position.y = 0.015;
        can.add(base);

        can.position.set(x, 0.5, z);
        can.rotation.y = rotY;
        inner.add(can);
        cans.push(can);
    }

    addCan(-0.28, 0.05, 0);
    addCan(0.0, 0.12, 0);
    addCan(0.28, 0.05, 0);
    addCan(-0.14, 0.55, 0.4);
    addCan(0.14, 0.55, 0.4);
    addCan(0.0, 0.95, 0.8);

    inner.add(fakeShadow(THREE, 1.3, 0.25));

    return {
        group,
        update(t) {
            inner.rotation.y = Math.sin(t * 0.5) * 0.15;
            cans.forEach((c, i) => {
                c.position.y = 0.5 + Math.sin(t * 1.4 + i * 1.1) * 0.015;
            });
        }
    };
}