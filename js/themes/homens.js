import { materials, fakeShadow } from './common.js';

export default function createHomens(THREE, { envMap }) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    const xPositions = [-0.95, 0, 0.95];
    const shirtColors = [0x2d6fb0, 0xc0392b, 0x27ae60];

    const figures = [];
    xPositions.forEach((x, index) => {
        const person = new THREE.Group();
        const shirtMat = materials.shirt(shirtColors[index]);

        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.28), shirtMat);
        torso.position.y = 0.78;
        torso.castShadow = true;
        person.add(torso);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), materials.skin);
        head.position.y = 1.16;
        head.castShadow = true;
        person.add(head);

        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.42, 0.12), shirtMat);
        armL.position.set(-0.28, 0.78, 0);
        armL.rotation.z = 0.12;
        armL.castShadow = true;
        person.add(armL);

        const armR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.42, 0.12), shirtMat);
        armR.position.set(0.28, 0.78, 0);
        armR.rotation.z = -0.12;
        armR.castShadow = true;
        person.add(armR);

        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.48, 0.18), materials.pants);
        legL.position.set(-0.1, 0.28, 0);
        legL.castShadow = true;
        person.add(legL);

        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.48, 0.18), materials.pants);
        legR.position.set(0.1, 0.28, 0);
        legR.castShadow = true;
        person.add(legR);

        person.position.x = x;
        person.userData.index = index;
        inner.add(person);
        figures.push(person);
    });

    inner.add(fakeShadow(THREE, 1.5, 0.28));

    return {
        group,
        update(t) {
            inner.rotation.y = Math.sin(t * 0.5) * 0.15;
            figures.forEach((p, i) => {
                p.position.y = Math.sin(t * 1.4 + i * 1.8) * 0.04;
                p.rotation.z = Math.sin(t * 1.1 + i * 2.2) * 0.02;
            });
        }
    };
}