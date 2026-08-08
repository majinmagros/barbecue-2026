import * as THREE from 'three';
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
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.15, 4.3);
    camera.lookAt(0, 0.7, 0);

    scene.add(new THREE.AmbientLight(0xfff2e0, 0.9));
    const key = new THREE.DirectionalLight(0xffe2b0, 1.35);
    key.position.set(2.5, 3.5, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-2.5, 1.5, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x8fd0ff, 0.55);
    rim.position.set(-3, 2, -3);
    scene.add(rim);

    const built = creator(THREE);
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
