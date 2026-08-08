import { fakeShadow } from './common.js';

export default function createCriancas(THREE) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf0b98f, roughness: 0.7 });
    const shirtColors = [0xf1c40f, 0x2e86c1, 0x2ecc71];

    const figures = [];
    const xPositions = [-0.7, 0, 0.7];

    xPositions.forEach((x, index) => {
        const kid = new THREE.Group();
        const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColors[index], roughness: 0.7 });

        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.34, 0.2), shirtMat);
        torso.position.y = 0.44;
        kid.add(torso);

        const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.2), new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 }));
        shorts.position.y = 0.24;
        kid.add(shorts);

        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), skinMat);
        legL.position.set(-0.07, 0.1, 0);
        kid.add(legL);

        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), skinMat);
        legR.position.set(0.07, 0.1, 0);
        kid.add(legR);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 16), skinMat);
        head.position.y = 0.72;
        kid.add(head);

        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.08), shirtMat);
        armL.position.set(-0.19, 0.5, 0);
        armL.rotation.z = 0.2;
        kid.add(armL);

        const armR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.08), shirtMat);
        armR.position.set(0.19, 0.5, 0);
        armR.rotation.z = -0.2;
        kid.add(armR);

        if (index === 0) {
            for (let c = 0; c < 7; c++) {
                const curl = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), new THREE.MeshStandardMaterial({ color: 0x4b2e1c, roughness: 1 }));
                curl.position.set(
                    Math.cos((c / 7) * Math.PI * 2) * 0.1,
                    0.06 + Math.sin((c / 7) * Math.PI * 4) * 0.04,
                    Math.sin((c / 7) * Math.PI * 2) * 0.1
                );
                curl.position.y += 0.78;
                kid.add(curl);
            }
        } else if (index === 1) {
            const frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.5 });
            const lensL = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 12), frameMat);
            lensL.position.set(-0.055, 0.73, 0.12);
            kid.add(lensL);
            const lensR = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 12), frameMat);
            lensR.position.set(0.055, 0.73, 0.12);
            kid.add(lensR);
        }

        kid.position.x = x;
        kid.userData.index = index;
        kid.userData.baseX = x;
        inner.add(kid);
        figures.push(kid);
    });

    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.4 })
    );
    ball.position.set(0.45, 0.45, 0.15);
    inner.add(ball);

    inner.add(fakeShadow(THREE, 1.3, 0.3));

    return {
        group,
        update(t) {
            figures.forEach((p) => {
                const dir = p.position.x > 0 ? 1 : -1;
                p.position.x = p.userData.baseX + Math.sin(t * 1.6 + p.userData.index) * 0.1 * dir;
                p.rotation.y = Math.sin(t * 1.3 + p.userData.index) * 0.2;
            });
            ball.position.y = Math.abs(Math.sin(t * 2.5)) * 0.5 + 0.08;
            ball.rotation.x = t * 3;
            ball.rotation.z = t * 2;
        }
    };
}