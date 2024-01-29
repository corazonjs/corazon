import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import init from './init';

import './style.css';

const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.set(-0.3, 0.8, 2);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0,50,0);
hemiLight.intensity = 10.0;
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.54)
dirLight.position.set(5, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
dirLight.intensity = 10.0;
scene.add(dirLight);


let model;

const loader = new GLTFLoader();

loader.load(
  '/models/logo/logo.gltf',
  (gltf) => {
    console.log('success');
    console.log(gltf);

    model = gltf.scene.children[0];
    model.scale.set(20, 20, 20);

    const bbox = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    model.position.sub(center);

    scene.add(model);
  }
);

const rotationSpeed = 0.01;
scene.background = new THREE.Color(0xFFFCc2);
const tick = () => {
  if (model) {
    model.rotation.z += rotationSpeed;
  }

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();


/** Базовые обпаботчики событий длы поддержки ресайза */
window.addEventListener('resize', () => {
  // Обновляем размеры
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Обновляем соотношение сторон камеры
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Обновляем renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
