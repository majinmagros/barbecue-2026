import { fakeShadow } from './common.js';

export default function createHomens(THREE) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd99a6c, roughness: 0.7 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x2f4b63, roughness: 0.8 });
    const shirtColors = [0x2d6fb0, 0xc0392b, 0x27ae60];

    const figures = [];
    const xPositions = [-0.95, 0, 0.95];

    xPositions.forEach((x, index) => {
        const person = new THREE.Group();
        const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColors[index], roughness: 0.75 });

        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.28), shirtMat);
        torso.position.y = 0.78;
        person.add(torso);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), skinMat);
        head.position.y = 1.16;
        person.add(head);

        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.42, 0.12), shirtMat);
        armL.position.set(-0.28, 0.78, 0);
        armL.rotation.z = 0.12;
        person.add(armL);

        const armR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.42, 0.12), shirtMat);
        armR.position.set(0.28, 0.78, 0);
        armR.rotation.z = -0.12;
        person.add(armR);

        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.48, 0.18), pantsMat);
        legL.position.set(-0.1, 0.28, 0);
        person.add(legL);

        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.48, 0.18), pantsMat);
        legR.position.set(0.1, 0.28, 0);
        person.add(legR);

        person.position.x = x;
        person.userData.index = index;
        inner.add(person);
        figures.push(person);
    });

    inner.add(fakeShadow(THREE, 1.5, 0.3));

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