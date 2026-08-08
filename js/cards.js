import * as THREE from 'three';
import { PMREMGenerator } from 'three/addons/extras/PMREMGenerator.js';
import homens from './themes/homens.js';
import mulheres from './themes/mulheres.js';
import criancas from './themes/criancas.js';
import carnes from './themes/carnes.js';
import cervejas from './themes/cervejas.js';
import acompanhamentos from './themes/acompanhamentos.js';
import refrigerantes from './themes/refrigerantes.js';
import sucos from './themes/sucos.js';
import clube from './themes/clube.js';

const creators = {
    homens,
    mulheres,
    criancas,
    carnes,
    cervejas,
    acompanhamentos,
    refrigerantes,
    sucos,
    clube
};

let sharedEnvMap = null;
let sharedPmremGenerator = null;

function getSharedEnvMap(renderer) {
    if (sharedEnvMap) return sharedEnvMap;

    sharedPmremGenerator = new PMREMGenerator(renderer);
    sharedPmremGenerator.compileEquirectangularShader();

    const size = 256;
    const data = new Uint8Array(3 * size * size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const u = x / (size - 1);
            const v = y / (size - 1);
            const theta = u * Math.PI * 2;
            const phi = v * Math.PI;
            const h = 0.08 + 0.02 * Math.sin(theta * 3);
            const s = 0.4;
            const l = 0.25 + 0.5 * Math.sin(phi);
            const [r, g, b] = hslToRgb(h, s, l);
            const idx = 3 * (y * size + x);
            data[idx] = Math.round(r * 255);
            data[idx + 1] = Math.round(g * 255);
            data[idx + 2] = Math.round(b * 255);
        }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const renderTarget = sharedPmremGenerator.fromEquirectangular(texture);
    sharedEnvMap = renderTarget.texture;
    texture.dispose();
    return sharedEnvMap;
}

function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r, g, b];
}

function disposeGroup(group) {
    group.traverse((obj) => {
        if (obj.geometry) {
            obj.geometry.dispose();
        }
        if (obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => m.dispose());
        }
    });
}

function createCard(el) {
    const themeName = el.dataset.theme;
    const creator = creators[themeName] || homens;

    const width = el.clientWidth || 300;
    const height = el.clientHeight || 210;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.environment = getSharedEnvMap(renderer);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.15, 4.3);
    camera.lookAt(0, 0.7, 0);

    const ambient = new THREE.AmbientLight(0xfff2e0, 0.6);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffe2b0, 1.8);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 20;
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.02;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(-3, 2, 3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x8fd0ff, 0.5);
    rim.position.set(-4, 3, -4);
    scene.add(rim);

    const built = creator(THREE, { envMap: sharedEnvMap });
    scene.add(built.group);

    const pointer = { x: 0, y: 0, active: false };
    const onPointerMove = (e) => {
        const rect = el.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        pointer.active = true;
    };
    const onPointerLeave = () => {
        pointer.active = false;
    };
    el.addEventListener('pointermove', onPointerMove, { passive: true });
    el.addEventListener('pointerleave', onPointerLeave, { passive: true });

    let visible = true;
    const onVisibility = () => {
        visible = !document.hidden;
        applyLoop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    let inView = true;
    const io = new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        applyLoop();
    }, { threshold: 0.08 });
    io.observe(el);

    const ro = new ResizeObserver(() => {
        const w = el.clientWidth || width;
        const h = el.clientHeight || height;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
    ro.observe(el);

    const timer = new THREE.Timer();
    timer.connect(document);

    let running = false;

    function loop(ts) {
        timer.update(ts);
        const dt = Math.min(timer.getDelta(), 0.05);
        const t = timer.getElapsed();

        const targetX = pointer.active ? pointer.y * 0.18 : 0;
        const targetY = pointer.active ? pointer.x * 0.28 : 0;
        built.group.rotation.x += (targetX - built.group.rotation.x) * 0.08;
        built.group.rotation.y += (targetY - built.group.rotation.y) * 0.08;

        built.update(t, dt);
        renderer.render(scene, camera);
    }

    function applyLoop() {
        const shouldRun = inView && visible;
        if (shouldRun && !running) {
            running = true;
            renderer.setAnimationLoop(loop);
        } else if (!shouldRun && running) {
            running = false;
            renderer.setAnimationLoop(null);
        }
    }

    applyLoop();

    return {
        dispose() {
            running = false;
            renderer.setAnimationLoop(null);
            io.disconnect();
            ro.disconnect();
            timer.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            el.removeEventListener('pointermove', onPointerMove);
            el.removeEventListener('pointerleave', onPointerLeave);
            if (built.dispose) {
                built.dispose();
            }
            disposeGroup(built.group);
            renderer.dispose();
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

const cards = [];
document.querySelectorAll('.card-3d').forEach((el) => {
    cards.push(createCard(el));
});