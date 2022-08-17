<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {Mesh, MeshStandardMaterial, PerspectiveCamera, Points, Scene, Texture, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";
import { tsThisType } from "@babel/types";

@Options({})
export default class ClassicParticles extends Vue {
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

  // Particles
  particleGeometry: THREE.BufferGeometry
  particleMaterial: THREE.PointsMaterial
  particles: THREE.Points

  count = 20000

  // Textures
  startTexture: Texture

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  tick() {
    const elapsedTime = this.clock.getElapsedTime()

    // Animate particles
    // this.particles.rotation.y = Math.sin(elapsedTime * 0.2)
    // this.particles.position.y = - Math.tan(elapsedTime * 0.2)
    for(let i = 0; i < this.count; i++) {
      // This is supposed to be bad idea, not good for cpu (better with custom shader)
      const x = this.particleGeometry.attributes.position.getX(i)
      this.particleGeometry.attributes.position.setY(i, Math.sin(elapsedTime + x))
    }
    
    this.particleGeometry.attributes.position.needsUpdate = true

    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()

  }

  setupLights() {

    console.log('lights')

  }

  setupMaterial() {
    console.log('materials')
  }

  setupObjects() {
    // Objects

   console.log('objects')
  }

  setupParticles() {
    console.log('particles')
    // Geometry
    this.particleGeometry = new THREE.BufferGeometry()

    const positions = new Float32Array(this.count * 3)
    const colors = new Float32Array(this.count * 3)

    for(let i = 0; i < this.count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10
        colors[i] = Math.random()
    }

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Material
    this.particleMaterial = new THREE.PointsMaterial({
      transparent: true,
      alphaMap: this.startTexture,
      // alphaTest: 0.001,
      // depthTest: false,
      depthWrite: false,
      // Blending is heavy on cpu
      blending: THREE.AdditiveBlending,
      size: 0.1,
      sizeAttenuation: true,
      color: '#ff88cc',
      vertexColors: true
    })

    // Points
    this.particles = new Points(this.particleGeometry, this.particleMaterial)
    this.scene.add(this.particles)


  }
  setupTextures() {
    const textureLoader = new THREE.TextureLoader()

    // Door
    this.startTexture = textureLoader.load('/textures/particles/2.png')

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

    // Textureloader
    this.setupTextures()

    // Lights
    this.setupLights()

    // Object
    this.setupMaterial()
    this.setupObjects()

    // Particles
    this.setupParticles()

    // Debug
    this.debug()

    //camera
    this.camera.position.z = 3
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
