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
import {BoxGeometry, BufferAttribute, BufferGeometry, ConeGeometry, DirectionalLight, Group, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshStandardMaterial, MeshToonMaterial, NearestFilter, PerspectiveCamera, Points, PointsMaterial, Scene, Texture, TorusGeometry, TorusKnotGeometry, Vector2, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import gsap from 'gsap';
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
  cameraGroup: Group

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
    materialColor: '#f0e13d'
  }

  // Mouse
  mouse:Vector2
  cursor: {x: number, y: number}

  // Particles
  particleGeometry: BufferGeometry
  particleMaterial: PointsMaterial
  particles: Points

  particleCount: number

  // Textures
  gradientTexture: Texture
  particleTexture: Texture
  
  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock()

  previousTime = 0

  // Scroll
  scrollY = window.scrollY
  currentSection = 0

  tick() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.previousTime
    this.previousTime = elapsedTime

    // Move camera
    this.camera.position.y = - this.scrollY / this.sizes.height * this.objectsDistance

    const parallexX = this.cursor.x * 0.5
    const parallexY = - this.cursor.y * 0.5

    this.cameraGroup.position.x += (parallexX - this.cameraGroup.position.x) * 5 * deltaTime
    this.cameraGroup.position.y += (parallexY - this.cameraGroup.position.y) * 5 * deltaTime

    for(const meshObject of this.sectionMeshes) {
      meshObject.rotation.x += deltaTime * 0.1
      meshObject.rotation.y += deltaTime * 0.12
    }

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()

    this.gui.addColor(this.parameters, 'materialColor').onChange(() => {
      this.material.color.set(this.parameters.materialColor)
      this.particleMaterial.color.set(this.parameters.materialColor)
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
    this.particleCount = 200

    this.particleGeometry = new BufferGeometry()

    const positions = new Float32Array(this.particleCount * 3)

    for(let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = this.objectsDistance * 0.5 - Math.random() * this.objectsDistance * this.sectionMeshes.length
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    this.particleGeometry.setAttribute('position', new BufferAttribute(positions, 3))

    this.particleMaterial = new PointsMaterial({
      alphaMap: this.particleTexture,
      transparent: true, 
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: this.parameters.materialColor,
      sizeAttenuation: true,
      size: 0.03,
    })

    this.particles = new Points(this.particleGeometry, this.particleMaterial)

    this.scene.add(this.particles)

  }


  setupTextures() {
    const textureLoader = new THREE.TextureLoader()

    // gradient
    this.gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
    this.gradientTexture.magFilter = NearestFilter

    this.particleTexture = textureLoader.load('/textures/particles/3.png')

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

  setupMouse() {
    this.cursor = {x: 0, y: 0}

    window.addEventListener('mousemove', (e) => {
      this.cursor.x = e.clientX / this.sizes.width - 0.5
      this.cursor.y = e.clientY / this.sizes.height - 0.5
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
    this.cameraGroup = new Group()
    this.scene.add(this.cameraGroup)

    this.camera.position.z = 3
    this.cameraGroup.add(this.camera)

    // Axes helper
    // const axesHelper = new THREE.AxesHelper()
    // this.scene.add(axesHelper)

    //renderer
    this.setupRenderer()

    // Resizing
    this.resizePage()

    // Mouse
    this.setupMouse()

    // Tick
    this.tick()

    // Full screen
    fullscreenUtil(this.$refs.webgl)

    // Scroll
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY

      const newSection = Math.round(this.scrollY / this.sizes.height)


      if(newSection != this.currentSection) {
        this.currentSection = newSection


        gsap.to(
          this.sectionMeshes[this.currentSection].rotation,
          {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=1.5'
          }
        )

        gsap.to(
          this.sectionMeshes[this.currentSection].position,
        {
          y: - this.objectsDistance * (this.currentSection + 1),
          duration: 0.5,
          delay: 0.4
        })

        gsap.to(
          this.sectionMeshes[this.currentSection].position,
        {
          y: - this.objectsDistance * this.currentSection,
          duration: 0.5,
          delay: 1
        })
      }
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
