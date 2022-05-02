\<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {
  AmbientLight,
  Mesh,
  MeshMatcapMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  TorusGeometry,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";

@Options({})
export default class ClassicLights extends Vue {
  $refs!: {
    webgl: FullScreenDocumentElement
  }
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  renderer: WebGLRenderer = {} as WebGLRenderer;
  // fov between 45 & 75 || only shows objects between near and far values
  camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
  controls: OrbitControls = {} as OrbitControls

  scene: Scene

  material: MeshStandardMaterial

  sphere: Mesh
  cube: Mesh
  torus: Mesh
  plane: Mesh

  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  tick() {
    const elapsedTime = this.clock.getElapsedTime()

    // Update objects
    this.sphere.rotation.y = 0.1 * elapsedTime
    this.cube.rotation.y = 0.1 * elapsedTime
    this.torus.rotation.y = 0.1 * elapsedTime

    this.sphere.rotation.x = 0.15 * elapsedTime
    this.cube.rotation.x = 0.15 * elapsedTime
    this.torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()
    this.gui.add(this.ambientLight, 'intensity').min(0).max(1).step(0.001)
  }

  setupLights() {
    this.scene.add(this.ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x00fffc,0.3)
    directionalLight.position.set(1, 0.25, 0)
    this.scene.add(directionalLight)
  }

  setupMaterial() {
    this.material = new THREE.MeshStandardMaterial()
    this.material.roughness = 0.4

  }

  setupObjects() {
  // Objects
    this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        this.material
    )
    this.sphere.position.x = - 1.5

    this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.75, 0.75),
        this.material
    )

    this.torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 32, 64),
        this.material
    )
    this.torus.position.x = 1.5

    this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        this.material
    )
    this.plane.rotation.x = - Math.PI * 0.5
    this.plane.position.y = - 0.65

    this.scene.add(this.sphere, this.cube, this.torus, this.plane)

  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.render(this.scene, this.camera)
  }

  resizePage() {
    window.addEventListener('resize', () => {
      this.sizes.height = window.innerHeight
      this.sizes.width = window.innerWidth

      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.sizes.width, this.sizes.height)

      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }

  mounted() {
    // Initialize scene
    this.scene = new THREE.Scene()

    // Lights
    this.setupLights()

    // Object
    this.setupMaterial()
    this.setupObjects()

    // Debug
    this.debug()

    //camera
    this.camera.position.set(1, 1, 2)
    this.scene.add(this.camera)

    // Axes helper
    // const axesHelper = new THREE.AxesHelper()
    // this.scene.add(axesHelper)

    //renderer
    this.setupRenderer()

    this.controls = new OrbitControls(this.camera, this.$refs.webgl);
    this.controls.enableDamping = true;

    // Resizing
    this.resizePage()

    // Tick
    this.tick()

    // Full screen
    fullscreenUtil(this.$refs.webgl)

  }

}
</script>

<style lang="scss">
.webgl {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  outline: none;

}
</style>
