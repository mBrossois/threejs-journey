\
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
export default class ClassicGalaxyGenerator extends Vue {
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

  // Particles
  galaxyGeometry: THREE.BufferGeometry;
  galaxyMaterial: THREE.PointsMaterial;
  galaxyPoints: THREE.Points;

  scene: Scene

  // Textures
  startTexture: Texture

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  parameters = {
    count: 100000,
    size: 0.01
    }

  tick() {
    const elapsedTime = this.clock.getElapsedTime()

    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()

    this.gui.add(this.parameters, 'count').min(100).max(1000000).step(100).onFinishChange(this.generateGalaxy)
    this.gui.add(this.parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(this.generateGalaxy)
  }

  setupLights() {

    console.log('lights')

  }

  setupMaterial() {
    console.log('materials')
  }

  setupObjects() {
   console.log('objects')
  }

  setupParticles() {
    console.log('particles')

    this.generateGalaxy()

  }


  generateGalaxy() {

    if(this.galaxyPoints !== undefined) {
      this.galaxyGeometry.dispose()
      this.galaxyMaterial.dispose()
      this.scene.remove(this.galaxyPoints)
    }

    // Geometry
    this.galaxyGeometry = new THREE.BufferGeometry();

    const galaxyPoints = new Float32Array(this.parameters.count * 3)
    for(let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3
      galaxyPoints[i3] = (Math.random() - 0.5) * 3
      galaxyPoints[i3 + 1] = (Math.random() - 0.5) * 3
      galaxyPoints[i3 + 2] = (Math.random() - 0.5) * 3
    }

    this.galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPoints, 3))
    
    // Material
    this.galaxyMaterial = new THREE.PointsMaterial({
      size: this.parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    // Points
    this.galaxyPoints = new THREE.Points(this.galaxyGeometry, this.galaxyMaterial)

    this.scene.add(this.galaxyPoints)
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
    this.camera.position.x = 3
    this.camera.position.y = 3
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
