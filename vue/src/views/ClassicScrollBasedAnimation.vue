<template>
    <canvas class="webgl" ref="webgl"/>

    <section class="section">
          <h1>My Portfolio</h1>
      </section>
      <section class="section">
          <h2>My projects</h2>
      </section>
      <section class="section">
          <h2>Contact me</h2>
      </section>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {BoxGeometry, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshStandardMaterial, PerspectiveCamera, Points, Scene, Texture, Vector2, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";
import { tsThisType } from "@babel/types";
import { randFloat } from "three/src/math/MathUtils";

@Options({})
export default class ClassicScrollBasedAnimation extends Vue {
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

  // objects
  cube: Mesh

  scene: Scene

  // Hovered?
  objectsIntersected: Array<Mesh> = [] as Array<Mesh>

  // Parameters
  parameters = {
    materialColor: '#ffeded'
  }

  // Mouse
  mouse:Vector2

  // Textures
  startTexture: Texture

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  tick() {
    const elapsedTime = this.clock.getElapsedTime()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()

    this.gui.addColor(this.parameters, 'materialColor')

  }

  setupLights() {

    console.log('lights')

  }

  setupMaterial() {
    console.log('materials')
  }

  setupObjects() {
   console.log('objects')

   this.cube = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: '#ff0000'})
   )

   this.scene.add(this.cube)

  }

  setupParticles() {
    console.log('particles')

  }


  setupTextures() {
    const textureLoader = new THREE.TextureLoader()

    // Door
    this.startTexture = textureLoader.load('/textures/particles/2.png')

  }

  setupMouse() {
    this.mouse = new Vector2() 

    window.addEventListener('mousemove', (_event) => {
      this.mouse.x = _event.clientX / this.sizes.width * 2 - 1
      this.mouse.y = - (_event.clientY / this.sizes.height) * 2 + 1
    })

    window.addEventListener('click', (event) => {
      if(this.objectsIntersected.length > 0) {
        console.log(this.objectsIntersected[0])
      }
    })
  }


  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl, alpha: true});
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

    // Mouse tracker
    this.setupMouse()

    //camera
    this.camera.position.z = 3
    this.scene.add(this.camera)

    // Axes helper
    // const axesHelper = new THREE.AxesHelper()
    // this.scene.add(axesHelper)

    //renderer
    this.setupRenderer()

    // Resizing
    this.resizePage()

    // Tick
    this.tick()

    // Full screen
    fullscreenUtil(this.$refs.webgl)

    const root = document.documentElement
    const rootBody = document.body
    root.style.setProperty('overflow-y', 'scroll')
    rootBody.style.setProperty('background-color', '#1e1a20')

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

.section
{
    display: flex;
    align-items: center;
    height: 100vh;
    position: relative;
    font-family: 'Cabin', sans-serif;
    color: #ffeded;
    text-transform: uppercase;
    font-size: 7vmin;
    padding-left: 10%;
    padding-right: 10%;
}

section:nth-child(even)
{
    justify-content: flex-end;
}
</style>
