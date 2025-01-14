import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('model-container');
  if (!container) {
    console.error('Could not find model-container element');
    return;
  }

  // Set up scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Set up camera with adjusted field of view
  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, -2, 8); // Moved camera down to shift model up

  // Set up renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  let model = null;

  // Load the model
  const loader = new GLTFLoader();
  
  loader.load(
    '/bishop.glb',
    function (gltf) {
      model = gltf.scene;
      
      // Center the model first
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -center.y, -center.z);
      
      // Calculate size to fit viewport
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / Math.sin(fov / 2) / 2);
      
      // Adjust camera position to fit model
      camera.position.z = cameraZ * 1.5;
      
      // Scale model to reasonable size
      const scale = 1.0;
      model.scale.set(scale, scale, scale);
      
      scene.add(model);
      animate();
    },
    undefined,
    function (error) {
      console.error('Error loading model:', error);
    }
  );

  // Track scroll position
  let lastScrollY = window.scrollY;
  
  // Add scroll listener
  window.addEventListener('scroll', () => {
    if (model) {
      const deltaY = window.scrollY - lastScrollY;
      model.rotation.y += deltaY * 0.005; // Adjust rotation speed here
      lastScrollY = window.scrollY;
      renderer.render(scene, camera);
    }
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
}); 