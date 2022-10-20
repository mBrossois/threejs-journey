<template>
    <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {CubeTexture, CubeTextureLoader, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, SphereGeometry, Texture, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es'
import { Body, Box, Plane, SAPBroadphase, Sphere, Vec3 } from 'cannon-es'
import { gl } from 'date-fns/locale';

@Options({})
export default class AdvancedRealisticRender extends Vue {
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

  // Models

  // Lights
  directionalLight: DirectionalLight

  // objects
  testSphere: Mesh


  // Material

  // Geometry

  scene: Scene

  // Hovered?

  // Parameters
  parameters = {envMapIntensity: 5} 

  // Mouse


  // Particles

  // Textures
  environmentMapTexture: CubeTexture
  environmentMap: Texture

  // Sounds
  
  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock()
  oldElapsedTime = 0

  // Physics

  // Mixer

  // Scroll

  tick() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.oldElapsedTime
    this.oldElapsedTime = elapsedTime

    // Update mixer

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()

    this.gui.add(this.directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
    this.gui.add(this.directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
    this.gui.add(this.directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
    this.gui.add(this.directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')
    this.gui.add(this.parameters, 'envMapIntensity').min(0).max(10).step(0.001)
      .onChange(this.updateAllMaterials)
  }

  setupModels() {
    console.log('Models')

    const gltfLoader = new GLTFLoader()

    gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
     
      gltf.scene.scale.set(10, 10, 10)
      gltf.scene.position.set(0, -4, 0)
      gltf.scene.rotation.y = Math.PI * 0.5
      this.scene.add(gltf.scene)

      this.gui.add(gltf.scene.rotation, 'y')
        .min(- Math.PI)
        .max(Math.PI)
        .step(0.001)
        .name('rotation')

        this.updateAllMaterials()
    })

  }

  setupLights() {
    console.log('lights')

    this.directionalLight = new DirectionalLight('#ffffff', 3)
    this.directionalLight.position.set(0.25, 3, -2.25)
    this.scene.add(this.directionalLight)
  }

  setupMaterial() {
    console.log('materials')
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if(child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.envMap = this.environmentMap
        child.material.envMapIntensity = this.parameters.envMapIntensity

      }
    })
  }

  setupObjects() {
   console.log('objects')

  //  this.testSphere = new Mesh(
  //   new SphereGeometry(1, 32, 32),
  //   new MeshStandardMaterial()
  //  )

  //  this.scene.add(this.testSphere)

  }

  setupParticles() {
    console.log('particles')
  }


  setupTextures() {
    console.log('textures')

    const cubeTextureLoader = new CubeTextureLoader()
    this.environmentMap = cubeTextureLoader.load([
      '/textures/environmentMaps/0/px.jpg',
      '/textures/environmentMaps/0/nx.jpg',
      '/textures/environmentMaps/0/py.jpg',
      '/textures/environmentMaps/0/ny.jpg',
      '/textures/environmentMaps/0/pz.jpg',
      '/textures/environmentMaps/0/nz.jpg'
    ])

    this.scene.background = this.environmentMap
    // this.scene.environment = this.environmentMap
  }

  physics() {
    console.log("physics")
 }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Make it according to real life light
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
    console.log('Mouse')
  }

  setupControls() {
    console.log('Controls')
    const controls = new OrbitControls(this.camera, this.$refs.webgl)
    controls.enableDamping = true 
  }

  mounted() {
    // Initialize scene
    this.scene = new THREE.Scene()

    // Textureloader
    this.setupTextures()

    // Models
    this.setupModels()

    // Physics
    this.physics()

    // Lights
    this.setupLights()

    // Object
    this.setupMaterial()
    this.setupObjects()
    
    // Particles
    this.setupParticles()

    // Debug
    this.debug()

    // Camera
    this.camera.position.set(4, 1, -4)
    this.scene.add(this.camera)

    // Axes helper
    // const axesHelper = new THREE.AxesHelper()
    // this.scene.add(axesHelper)

    // Renderer
    this.setupRenderer()

    // Controls
    this.setupControls()

    // Resizing
    this.resizePage()

    // Mouse
    this.setupMouse()

    // Tick
    this.tick()

    // Full screen
    fullscreenUtil(this.$refs.webgl)

    // Scroll
  
  }

}
</script>