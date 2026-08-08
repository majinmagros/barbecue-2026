import { materials, fakeShadow, makeTable } from './common.js';

export default function createAcompanhamentos(THREE, { envMap }) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);

    inner.add(makeTable(THREE, 2.1, 1.4, 0xd8c4a2));

    const dishes = [];
    const data = [
        { x: -0.55, z: 0.1, color: 0x7cb342 },   // salada
        { x: 0.0, z: 0.2, color: 0xd4a017 },     // farofa
        { x: 0.55, z: 0.1, color: 0xf39c12 }     // legumes
    ];

    data.forEach((d, index) => {
        const dish = new THREE.Group();
        const plate = new THREE.Mesh(
            new THREE.CylinderGeometry(0.26, 0.3, 0.08, 20),
            materials.plastic(0xf5f0e6)
        );
        plate.position.y = 0.53;
        plate.castShadow = true;
        plate.receiveShadow = true;
        dish.add(plate);

        const food = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 18, 14),
            materials.liquid(d.color)
        );
        food.scale.set(1, 0.7, 1);
        food.position.y = 0.6;
        food.castShadow = true;
        dish.add(food);

        if (index === 2) {
            for (let i = 0; i < 4; i++) {
                const veg = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), materials.liquid(i % 2 ? 0xe67e22 : 0x2e7d32));
                veg.position.set(Math.cos((i / 4) * Math.PI * 2) * 0.12, 0.68, Math.sin((i / 4) * Math.PI * 2) * 0.12);
                veg.castShadow = true;
                dish.add(veg);
            }
        }

        dish.position.set(d.x, 0, d.z);
        dish.userData.index = index;
        inner.add(dish);
        dishes.push(dish);
    });

    inner.add(fakeShadow(THREE, 1.5, 0.2));

    return {
        group,
        update(t) {
            dishes.forEach((d, i) => {
                d.rotation.y = Math.sin(t * 0.7 + i * 1.7) * 0.2;
            });
        }
    };
}