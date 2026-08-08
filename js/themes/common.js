export function makePhysicalMat(params = {}) {
    return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0.1,
        clearcoat: 0,
        clearcoatRoughness: 0.2,
        transmission: 0,
        iridescence: 0,
        iridescenceIOR: 1.3,
        envMapIntensity: 1,
        ...params
    });
}

export const materials = {
    skin: makePhysicalMat({ color: 0xd99a6c, roughness: 0.7, metalness: 0 }),
    pants: makePhysicalMat({ color: 0x2f4b63, roughness: 0.8, metalness: 0 }),
    shirt: (color) => makePhysicalMat({ color, roughness: 0.65, metalness: 0.05, clearcoat: 0.15 }),
    dress: (color) => makePhysicalMat({ color, roughness: 0.6, metalness: 0.05, clearcoat: 0.1 }),
    hair: makePhysicalMat({ color: 0x3c241a, roughness: 0.9, metalness: 0 }),
    glass: makePhysicalMat({
        color: 0xe6f7ff,
        roughness: 0.05,
        metalness: 0,
        transmission: 0.98,
        thickness: 0.5,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.05
    }),
    liquid: (color) => makePhysicalMat({ color, roughness: 0.2, metalness: 0, transmission: 0.9, ior: 1.33 }),
    metal: (color) => makePhysicalMat({ color, roughness: 0.3, metalness: 0.9, clearcoat: 0.3 }),
    wood: makePhysicalMat({ color: 0x9c6b3a, roughness: 0.85, metalness: 0 }),
    charcoal: makePhysicalMat({ color: 0x1c130e, roughness: 1, metalness: 0 }),
    meat: (color) => makePhysicalMat({ color, roughness: 0.45, metalness: 0.05, clearcoat: 0.2 }),
    fat: makePhysicalMat({ color: 0xf5e3c8, roughness: 0.55, clearcoat: 0.4 }),
    grass: makePhysicalMat({ color: 0x8ec06c, roughness: 1, metalness: 0 }),
    water: makePhysicalMat({
        color: 0x1f6feb,
        roughness: 0.1,
        metalness: 0.05,
        transmission: 0.85,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        ior: 1.33
    }),
    plastic: (color) => makePhysicalMat({ color, roughness: 0.35, metalness: 0.05, clearcoat: 0.25 }),
    paintedMetal: (color) => makePhysicalMat({ color, roughness: 0.4, metalness: 0.7, clearcoat: 0.4 }),
    label: makePhysicalMat({ color: 0xf3e9d2, roughness: 0.85, metalness: 0 }),
    foam: makePhysicalMat({ color: 0xfdf6e3, roughness: 0.9, metalness: 0, transmission: 0.3 }),
    silver: makePhysicalMat({ color: 0xdfe3e6, roughness: 0.25, metalness: 0.8, clearcoat: 0.5 }),
    redCoke: makePhysicalMat({ color: 0xd52b2b, roughness: 0.3, metalness: 0.15, clearcoat: 0.35 }),
    umbrellaFabric: (color) => makePhysicalMat({ color, roughness: 0.7, metalness: 0.02, clearcoat: 0.1 }),
    pole: makePhysicalMat({ color: 0x7f8c8d, roughness: 0.5, metalness: 0.6 }),
    lounge: makePhysicalMat({ color: 0xd9c9b5, roughness: 0.75, metalness: 0.05, clearcoat: 0.1 })
};

export function fakeShadow(THREE, radius, opacity) {
    const mesh = new THREE.Mesh(
        new THREE.CircleGeometry(radius, 32),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: opacity, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.001;
    return mesh;
}

export function sphereNoise(THREE, radius, amp) {
    const geo = new THREE.SphereGeometry(radius, 24, 16);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const px = pos.getX(i);
        const py = pos.getY(i);
        const pz = pos.getZ(i);
        const n = 1 + amp * Math.sin(px * 8) * Math.cos(pz * 8) * Math.sin(py * 10);
        pos.setXYZ(i, px * n, py * n, pz * n);
    }
    geo.computeVertexNormals();
    return geo;
}

export function makeTable(THREE, w, d, color) {
    const table = new THREE.Group();
    const top = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.06, d),
        materials.wood
    );
    top.position.y = 0.5;
    top.castShadow = true;
    top.receiveShadow = true;
    table.add(top);
    const legMat = materials.pole;
    const legGeo = new THREE.BoxGeometry(0.08, 0.5, 0.08);
    const legs = [
        [-w / 2 + 0.1, d / 2 - 0.1],
        [w / 2 - 0.1, d / 2 - 0.1],
        [-w / 2 + 0.1, -d / 2 + 0.1],
        [w / 2 - 0.1, -d / 2 + 0.1]
    ];
    legs.forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(lx, 0.25, lz);
        leg.castShadow = true;
        table.add(leg);
    });
    return table;
}