import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

function makeParticleTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
}

export function initHeroScene(container) {
    let width = container.clientWidth || 1;
    let height = container.clientHeight || 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 2.1, 5.4);
    camera.lookAt(0, 1.15, 0);

    scene.add(new THREE.AmbientLight(0xffd9b0, 0.55));

    const rim = new THREE.DirectionalLight(0xffb56b, 1.4);
    rim.position.set(0, 3.5, 2);
    scene.add(rim);

    const emberGlow = new THREE.PointLight(0xff6a00, 6, 6, 1.6);
    emberGlow.position.set(0, 1.05, 0);
    scene.add(emberGlow);

    const sparkLight = new THREE.PointLight(0xffaa33, 1.2, 4, 1.6);
    sparkLight.position.set(0.4, 1.6, 0.3);
    scene.add(sparkLight);

    const group = new THREE.Group();
    scene.add(group);

    const bodyGeo = new THREE.BoxGeometry(3.2, 1.0, 1.9);
    bodyGeo.translate(0, 0.5, 0);
    const legGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2).translate(1.45, -0.1, 0.8);
    const bodyGeos = [
        bodyGeo,
        legGeo,
        legGeo.clone().translate(0, 0, -1.6),
        legGeo.clone().translate(-2.9, 0, 0),
        legGeo.clone().translate(-2.9, 0, -1.6)
    ];
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x3b2a22, roughness: 0.85, metalness: 0.35 });
    const bodyMesh = new THREE.Mesh(mergeGeometries(bodyGeos), ironMat);
    bodyMesh.position.y = 0.35;
    group.add(bodyMesh);

    const ashMat = new THREE.MeshStandardMaterial({ color: 0x1c130e, roughness: 1, metalness: 0 });
    const ash = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.18, 1.5), ashMat);
    ash.position.y = 1.05;
    group.add(ash);

    const barGeos = [];
    for (let i = 0; i < 12; i++) {
        const bar = new THREE.BoxGeometry(3.0, 0.05, 0.05);
        bar.translate(0, 0, -0.7 + i * 0.13);
        barGeos.push(bar);
    }
    const grillMat = new THREE.MeshStandardMaterial({ color: 0x88807a, roughness: 0.5, metalness: 0.7 });
    const grill = new THREE.Mesh(mergeGeometries(barGeos), grillMat);
    grill.position.y = 1.45;
    group.add(grill);

    const meatGeo = new THREE.SphereGeometry(0.62, 24, 18);
    const meatPos = meatGeo.attributes.position;
    for (let i = 0; i < meatPos.count; i++) {
        const x = meatPos.getX(i);
        const y = meatPos.getY(i);
        const z = meatPos.getZ(i);
        const noise = 1 + 0.06 * Math.sin(x * 9) * Math.cos(z * 9) * Math.sin(y * 11);
        meatPos.setXYZ(i, x * 1.15 * noise, Math.abs(y) * 0.55, z * 0.9 * noise);
    }
    meatGeo.computeVertexNormals();

    const meatMat = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.45, metalness: 0.05 });
    const meat = new THREE.Mesh(meatGeo, meatMat);
    meat.position.y = 1.62;
    group.add(meat);

    const fatMat = new THREE.MeshStandardMaterial({ color: 0xf5e3c8, roughness: 0.6 });
    const fatCap = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 8), fatMat);
    fatCap.scale.set(1.3, 0.35, 1.0);
    fatCap.position.y = 1.95;
    group.add(fatCap);

    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32, depthWrite: false });
    const fakeShadow = new THREE.Mesh(new THREE.CircleGeometry(2.4, 24), shadowMat);
    fakeShadow.rotation.x = -Math.PI / 2;
    fakeShadow.position.y = 0.02;
    group.add(fakeShadow);

    const particleTexture = makeParticleTexture();

    const SPARK_COUNT = 420;
    const sparkPos = new Float32Array(SPARK_COUNT * 3);
    const sparkCol = new Float32Array(SPARK_COUNT * 3);
    const sparkColor = new THREE.Color();
    for (let i = 0; i < SPARK_COUNT; i++) {
        sparkPos[i * 3] = (Math.random() - 0.5) * 2.6;
        sparkPos[i * 3 + 1] = Math.random() * 1.1;
        sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        sparkColor.setHSL(0.06 + Math.random() * 0.05, 1, 0.5 + Math.random() * 0.4);
        sparkCol[i * 3] = sparkColor.r;
        sparkCol[i * 3 + 1] = sparkColor.g;
        sparkCol[i * 3 + 2] = sparkColor.b;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkCol, 3));
    const sparkMat = new THREE.PointsMaterial({
        size: 0.14,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.9
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    sparks.position.y = 1.15;
    group.add(sparks);

    const SMOKE_COUNT = 90;
    const smokePos = new Float32Array(SMOKE_COUNT * 3);
    for (let i = 0; i < SMOKE_COUNT; i++) {
        smokePos[i * 3] = (Math.random() - 0.5) * 1.4;
        smokePos[i * 3 + 1] = 1.4 + Math.random() * 2.2;
        smokePos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
    }
    const smokeGeo = new THREE.BufferGeometry();
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
        size: 0.65,
        map: particleTexture,
        color: 0x9a8b80,
        transparent: true,
        opacity: 0.32,
        depthWrite: false
    });
    const smoke = new THREE.Points(smokeGeo, smokeMat);
    group.add(smoke);

    let visible = true;
    let raf = 0;
    let disposed = false;
    const pointer = { x: 0, y: 0 };
    const timer = new THREE.Timer();
    timer.connect(document);

    const onPointerMove = (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onVisibility = () => {
        visible = !document.hidden;
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting && !document.hidden;
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);

    const onResize = () => {
        width = container.clientWidth || 1;
        height = container.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    function loop(timestamp) {
        if (disposed) return;
        raf = requestAnimationFrame(loop);

        timer.update(timestamp);
        const dt = Math.min(timer.getDelta(), 0.05);
        const t = timer.getElapsed();

        group.rotation.y = t * 0.25;
        group.position.y = Math.sin(t * 0.8) * 0.05;

        meat.position.y = 1.62 + Math.sin(t * 1.2) * 0.02;
        meat.rotation.y = t * 0.6;

        emberGlow.intensity = 6 + Math.sin(t * 2.4) * 1.5;
        sparkLight.intensity = 1.0 + Math.random() * 0.8;
        sparks.material.opacity = 0.8 + Math.random() * 0.3;

        const sparkArr = sparkGeo.attributes.position.array;
        for (let i = 0; i < SPARK_COUNT; i++) {
            sparkArr[i * 3 + 1] += dt * (0.15 + Math.random() * 0.2);
            if (sparkArr[i * 3 + 1] > 1.3) {
                sparkArr[i * 3] = (Math.random() - 0.5) * 2.6;
                sparkArr[i * 3 + 1] = 0;
                sparkArr[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
            }
        }
        sparkGeo.attributes.position.needsUpdate = true;

        const smokeArr = smokeGeo.attributes.position.array;
        for (let i = 0; i < SMOKE_COUNT; i++) {
            smokeArr[i * 3] += Math.sin(t + i) * dt * 0.1;
            smokeArr[i * 3 + 1] += dt * 0.35;
            if (smokeArr[i * 3 + 1] > 3.8) {
                smokeArr[i * 3] = (Math.random() - 0.5) * 1.4;
                smokeArr[i * 3 + 1] = 1.4;
                smokeArr[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
            }
        }
        smokeGeo.attributes.position.needsUpdate = true;

        camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.05;
        camera.position.y += (2.1 - pointer.y * 0.25 - camera.position.y) * 0.05;
        camera.lookAt(0, 1.15, 0);

        if (visible) {
            renderer.render(scene, camera);
        }
    }

    raf = requestAnimationFrame(loop);

    return {
        renderer,
        scene,
        camera,
        dispose() {
            disposed = true;
            cancelAnimationFrame(raf);
            intersectionObserver.disconnect();
            resizeObserver.disconnect();
            timer.disconnect();
            window.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('visibilitychange', onVisibility);
            meatGeo.dispose();
            meatMat.dispose();
            fatMat.dispose();
            ironMat.dispose();
            ashMat.dispose();
            grillMat.dispose();
            shadowMat.dispose();
            sparkMat.dispose();
            smokeMat.dispose();
            particleTexture.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

const heroElement = document.getElementById('hero-canvas');
if (heroElement) {
    initHeroScene(heroElement);
}