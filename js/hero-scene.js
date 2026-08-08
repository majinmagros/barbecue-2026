import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(null, null);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.6, 0.4, 0.85);
    bloomPass.threshold = 0.8;
    bloomPass.strength = 0.7;
    bloomPass.radius = 0.6;
    composer.addPass(bloomPass);

    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.set(1 / width, 1 / height);
    composer.addPass(fxaaPass);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 2.1, 5.4);
    camera.lookAt(0, 1.15, 0);

    renderPass.scene = scene;
    renderPass.camera = camera;

    scene.add(new THREE.AmbientLight(0xffd9b0, 0.4));

    const keyLight = new THREE.DirectionalLight(0xffb56b, 1.6);
    keyLight.position.set(2, 5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const emberGlow = new THREE.PointLight(0xff6a00, 8, 8, 1.8);
    emberGlow.position.set(0, 1.05, 0);
    emberGlow.castShadow = true;
    scene.add(emberGlow);

    const sparkLight = new THREE.PointLight(0xffaa33, 2, 5, 1.8);
    sparkLight.position.set(0.4, 1.6, 0.3);
    scene.add(sparkLight);

    const rimLight = new THREE.DirectionalLight(0xff8844, 0.8);
    rimLight.position.set(-3, 4, -2);
    scene.add(rimLight);

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
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x3b2a22, roughness: 0.8, metalness: 0.4 });
    const bodyMesh = new THREE.Mesh(mergeGeometries(bodyGeos), ironMat);
    bodyMesh.position.y = 0.35;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);

    const ashMat = new THREE.MeshStandardMaterial({ color: 0x1c130e, roughness: 1, metalness: 0 });
    const ash = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.18, 1.5), ashMat);
    ash.position.y = 1.05;
    ash.receiveShadow = true;
    group.add(ash);

    const barGeos = [];
    for (let i = 0; i < 12; i++) {
        const bar = new THREE.BoxGeometry(3.0, 0.05, 0.05);
        bar.translate(0, 0, -0.7 + i * 0.13);
        barGeos.push(bar);
    }
    const grillMat = new THREE.MeshStandardMaterial({ color: 0x88807a, roughness: 0.4, metalness: 0.8 });
    const grill = new THREE.Mesh(mergeGeometries(barGeos), grillMat);
    grill.position.y = 1.45;
    grill.castShadow = true;
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

    const meatMat = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.4, metalness: 0.1, emissive: 0x331100, emissiveIntensity: 0.3 });
    const meat = new THREE.Mesh(meatGeo, meatMat);
    meat.position.y = 1.62;
    meat.castShadow = true;
    group.add(meat);

    const fatMat = new THREE.MeshStandardMaterial({ color: 0xf5e3c8, roughness: 0.5, clearcoat: 0.5 });
    const fatCap = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 8), fatMat);
    fatCap.scale.set(1.3, 0.35, 1.0);
    fatCap.position.y = 1.95;
    group.add(fatCap);

    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false });
    const fakeShadow = new THREE.Mesh(new THREE.CircleGeometry(2.4, 24), shadowMat);
    fakeShadow.rotation.x = -Math.PI / 2;
    fakeShadow.position.y = 0.02;
    group.add(fakeShadow);

    const particleTexture = makeParticleTexture();

    const SPARK_COUNT = 500;
    const sparkPos = new Float32Array(SPARK_COUNT * 3);
    const sparkCol = new Float32Array(SPARK_COUNT * 3);
    const sparkColor = new THREE.Color();
    for (let i = 0; i < SPARK_COUNT; i++) {
        sparkPos[i * 3] = (Math.random() - 0.5) * 2.6;
        sparkPos[i * 3 + 1] = Math.random() * 1.1;
        sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        sparkColor.setHSL(0.06 + Math.random() * 0.05, 1, 0.55 + Math.random() * 0.4);
        sparkCol[i * 3] = sparkColor.r;
        sparkCol[i * 3 + 1] = sparkColor.g;
        sparkCol[i * 3 + 2] = sparkColor.b;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkCol, 3));
    const sparkMat = new THREE.PointsMaterial({
        size: 0.12,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.95,
        sizeAttenuation: true
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    sparks.position.y = 1.15;
    group.add(sparks);

    const SMOKE_COUNT = 120;
    const smokePos = new Float32Array(SMOKE_COUNT * 3);
    for (let i = 0; i < SMOKE_COUNT; i++) {
        smokePos[i * 3] = (Math.random() - 0.5) * 1.4;
        smokePos[i * 3 + 1] = 1.4 + Math.random() * 2.2;
        smokePos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
    }
    const smokeGeo = new THREE.BufferGeometry();
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
        size: 0.6,
        map: particleTexture,
        color: 0x9a8b80,
        transparent: true,
        opacity: 0.28,
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
        composer.setSize(width, height);
        fxaaPass.material.uniforms['resolution'].value.set(1 / width, 1 / height);
        bloomPass.resolution.set(width, height);
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

        group.rotation.y = t * 0.22;
        group.position.y = Math.sin(t * 0.7) * 0.04;

        meat.position.y = 1.62 + Math.sin(t * 1.1) * 0.02;
        meat.rotation.y = t * 0.5;

        emberGlow.intensity = 8 + Math.sin(t * 2.2) * 2;
        sparkLight.intensity = 1.5 + Math.random() * 1;
        sparks.material.opacity = 0.85 + Math.random() * 0.25;

        const sparkArr = sparkGeo.attributes.position.array;
        for (let i = 0; i < SPARK_COUNT; i++) {
            sparkArr[i * 3 + 1] += dt * (0.18 + Math.random() * 0.25);
            if (sparkArr[i * 3 + 1] > 1.4) {
                sparkArr[i * 3] = (Math.random() - 0.5) * 2.6;
                sparkArr[i * 3 + 1] = 0;
                sparkArr[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
            }
        }
        sparkGeo.attributes.position.needsUpdate = true;

        const smokeArr = smokeGeo.attributes.position.array;
        for (let i = 0; i < SMOKE_COUNT; i++) {
            smokeArr[i * 3] += Math.sin(t + i) * dt * 0.12;
            smokeArr[i * 3 + 1] += dt * 0.4;
            if (smokeArr[i * 3 + 1] > 4.0) {
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
            composer.render();
        }
    }

    raf = requestAnimationFrame(loop);

    return {
        renderer,
        scene,
        camera,
        composer,
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
            renderPass.dispose();
            bloomPass.dispose();
            fxaaPass.dispose();
            composer.dispose();
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