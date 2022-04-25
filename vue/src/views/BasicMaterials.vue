<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {BoxGeometry, PerspectiveCamera, Scene, TextureLoader, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import gsap from 'gsap'

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const gradients3Texture = textureLoader.load('/textures/gradients/3.jpg')
const matcapsTexture = textureLoader.load('/textures/matcaps/8.png')

// Scene
const scene: Scene = new THREE.Scene()

// Objects
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color(0x00ff00)
// material.wireframe = true
// material.transparent = true
// material.opacity = .5
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapsTexture

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

const material = new THREE.MeshPhongMaterial()
material.shininess = 100
material.specular = new THREE.Color(0x1188ff)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(.3, .2, 16, 32),
    material
)

@Options({})
export default class BasicMaterials extends Vue {
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

  ambientLight = new THREE.AmbientLight(0xffffff, .5)
  pointLight = new THREE.PointLight(0xffffff, .5)

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  tick() {
    const elapsedTime = this.clock.getElapsedTime()
    // Update objects
    sphere.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime

    sphere.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime

    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  mounted() {
    // objects
    sphere.position.x = -1.5
    torus.position.x = 1.5
    scene.add(sphere, plane, torus)

    // Light
    this.pointLight.position.x = 2
    this.pointLight.position.y = 3
    this.pointLight.position.z = 4
    scene.add(this.pointLight)

    scene.add(this.ambientLight)

    //camera
    // this.camera.position.set(2, 2, 2)
    this.camera.position.z = 2
    scene.add(this.camera)

    //renderer
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.render(scene, this.camera)

    this.controls = new OrbitControls(this.camera, this.$refs.webgl);
    this.controls.enableDamping = true;

    // Resizing
    window.addEventListener('resize', () => {
      this.sizes.height = window.innerHeight
      this.sizes.width = window.innerWidth

      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.sizes.width, this.sizes.height)

      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

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