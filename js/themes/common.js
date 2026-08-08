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
        new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 })
    );
    top.position.y = 0.5;
    table.add(top);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x3b2a22, roughness: 0.8 });
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
        table.add(leg);
    });
    return table;
}