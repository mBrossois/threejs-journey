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
import {BoxGeometry, ConeGeometry, DirectionalLight, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshStandardMaterial, MeshToonMaterial, NearestFilter, PerspectiveCamera, Points, Scene, Texture, TorusGeometry, TorusKnotGeometry, Vector2, WebGLRenderer} from "three";
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

  // Lights
  directionalLight: DirectionalLight

  // objects
  mesh1: Mesh
  mesh2: Mesh
  mesh3: Mesh

  sectionMeshes: Mesh[]

  objectsDistance = 4

  // Material
  material: MeshToonMaterial

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
  gradientTexture: Texture

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  // Scroll
  scrollY = window.scrollY

  tick() {
    const elapsedTime = this.clock.getElapsedTime()

    // Move camera
    this.camera.position.y = - this.scrollY / this.sizes.height * this.objectsDistance

    for(const meshObject of this.sectionMeshes) {
      meshObject.rotation.x = elapsedTime * 0.1
      meshObject.rotation.y = elapsedTime * 0.12
    }

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()

    this.gui.addColor(this.parameters, 'materialColor').onChange(() => {
      this.material.color.set(this.parameters.materialColor)
    })

  }

  setupLights() {
    console.log('lights')

    this.directionalLight = new DirectionalLight('#ffffff', 0.8)
    this.directionalLight.position.set(1, 1, 0)

    this.scene.add(this.directionalLight)

  }

  setupMaterial() {
    console.log('materials')
    this.material = new MeshToonMaterial({
      color: this.parameters.materialColor,
      gradientMap: this.gradientTexture
    })
  }

  setupObjects() {
   console.log('objects')

   const mesh1 = new Mesh(
    new TorusGeometry(1, 0.4, 16, 60),
    this.material
   )
   
   const mesh2 = new Mesh(
    new ConeGeometry(1, 2, 32),
    this.material
   )
   
   const mesh3 = new Mesh(
    new TorusKnotGeometry(0.8, 0.35, 100, 16),
    this.material
   )

   mesh1.position.y = - this.objectsDistance * 0
   mesh2.position.y = - this.objectsDistance * 1
   mesh3.position.y = - this.objectsDistance * 2

  mesh1.position.x = 1
  mesh2.position.x = - 1
  mesh3.position.x = 1

   this.sectionMeshes = [mesh1, mesh2, mesh3]

   this.scene.add(mesh1, mesh2, mesh3)

  }

  setupParticles() {
    console.log('particles')

  }


  setupTextures() {
    const textureLoader = new THREE.TextureLoader()

    // gradient
    this.gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
    this.gradientTexture.magFilter = NearestFilter

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

    // Scroll
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY
    })

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
