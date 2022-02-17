<template>
  <div id="app" ref="app" class="bg-black" @dblclick="click">
    <canvas ref="canvas" class="h-screen w-screen" />
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { random } from 'lodash';
export default {
  name: 'App',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      length: { length: 1800 },
      scale: 10,
    };
  },
  computed: {
    sequence() {
      const array = Array.from(this.length, (x, i) => i + 1);
      return array.reduce((a, c, i) => {
        a[i] = i < 2 ? 1 : a[i - 1] + a[i - 2];
        return a;
      }, []);
    },
    coordinates() {
      const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians
      // console.log(phi);
      return this.sequence.map((v, i, a) => {
        const theta = phi * i; // golden angle increment
        const y = 1 - (i / (a.length - 1)) * 2; //from 1 to -1
        const radius = Math.sqrt(1 - y * y);
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        return { x, y, z };
      });
    },
  },
  mounted() {
    // console.log(this.sequence);
    const canvas = this.$refs.canvas;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(2, 2, 6);
    scene.add(pointLight);
    const lightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(lightHelper);

    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;

    const controls = new OrbitControls(camera, canvas);
    // const controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera = camera;
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    this.addSphere({ x: 0, y: 0, z: 0 }, 1);
    this.coordinates.forEach((coordinate) => {
      this.addSphere(coordinate);
    });
  },
  methods: {
    click() {
      // return;
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = 5;
    },
    addSphere(coordinate, size) {
      const geometry = new THREE.SphereGeometry(size ?? 0.02);
      // const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(coordinate.x, coordinate.y, coordinate.z);
      this.scene.add(sphere);
    },
  },
};
</script>
