import { fakeShadow } from './common.js';

export default function createMulheres(THREE) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe2a87c, roughness: 0.7 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x3c241a, roughness: 0.9 });
    const dressColors = [0xd81b60, 0x8e44ad, 0x16a085, 0xe67e22];

    const figures = [];
    const xPositions = [-0.9, -0.3, 0.3, 0.9];

    xPositions.forEach((x, index) => {
        const person = new THREE.Group();
        const dressMat = new THREE.MeshStandardMaterial({ color: dressColors[index], roughness: 0.6 });

        const dress = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.55, 20), dressMat);
        dress.position.y = 0.52;
        person.add(dress);

        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.22), dressMat);
        torso.position.y = 0.85;
        person.add(torso);

        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12), skinMat);
        neck.position.y = 1.03;
        person.add(neck);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 16), skinMat);
        head.position.y = 1.18;
        person.add(head);

        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), hairMat);
        hair.position.y = 1.25;
        hair.scale.set(1, 0.8, 1);
        person.add(hair);

        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.34, 0.1), skinMat);
        armL.position.set(-0.2, 0.82, 0);
        armL.rotation.z = 0.3;
        person.add(armL);

        const armR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.34, 0.1), skinMat);
        armR.position.set(0.2, 0.82, 0);
        armR.rotation.z = -0.3;
        person.add(armR);

        person.position.x = x;
        person.userData.index = index;
        inner.add(person);
        figures.push(person);
    });

    inner.add(fakeShadow(THREE, 1.7, 0.3));

    return {
        group,
        update(t) {
            figures.forEach((p, i) => {
                const phase = i * 1.3;
                p.position.y = Math.sin(t * 1.8 + phase) * 0.06;
                p.rotation.z = Math.sin(t * 1.5 + phase) * 0.14;
                p.rotation.x = Math.sin(t * 1.2 + phase) * 0.06;
            });
        }
    };
}