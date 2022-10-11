<template>
    <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {AmbientLight, AnimationMixer, BoxGeometry, BufferAttribute, BufferGeometry, ConeGeometry, CubeTexture, CubeTextureLoader, DirectionalLight, Group, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshStandardMaterial, MeshToonMaterial, NearestFilter, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, Points, PointsMaterial, Scene, SphereGeometry, Texture, TorusGeometry, TorusKnotGeometry, Vector2, Vector3, WebGLRenderer} from "three";
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
export default class AdvancedCustomModels extends Vue {
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
  ambientLight: AmbientLight
  directionalLight: DirectionalLight

  // objects
  floor: Mesh

  // Material

  // Geometry

  scene: Scene

  // Hovered?

  // Parameters
  parameters = {
  }

  // Mouse


  // Particles

  // Textures
  environmentMapTexture: CubeTexture

  // Sounds
  hitSound = new Audio('/sounds/hit.mp3')
  
  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock()
  oldElapsedTime = 0

  // Physics

  // Mixer
  mixer: AnimationMixer

  // Scroll

  tick() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.oldElapsedTime
    this.oldElapsedTime = elapsedTime

    // Update mixer
    if(this.mixer) {
      this.mixer.update(deltaTime)
    }

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()
  }

  setupModels() {
    console.log('Models')

    const gltfLoader = new GLTFLoader()

    gltfLoader.load(
      '/models/hamburger.glb',
      (gltf) => {
        console.log(gltf)
        this.scene.add(gltf.scene)
      }
    )
  }

  setupLights() {
    console.log('lights')

    this.ambientLight = new AmbientLight(0xffffff, 0.8)

    this.directionalLight = new DirectionalLight(0xffffff, 0.6)
    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    this.directionalLight.shadow.camera.far = 15
    this.directionalLight.shadow.camera.left = -7
    this.directionalLight.shadow.camera.top = 7
    this.directionalLight.shadow.camera.right = 7
    this.directionalLight.shadow.camera.bottom = -7
    this.directionalLight.position.set(5, 5, 5)

    this.scene.add(this.ambientLight, this.directionalLight)

  }

  setupMaterial() {
    console.log('materials')
  }

  setupObjects() {
   console.log('objects')

    this.floor = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5,
      })
    )

    this.floor.receiveShadow = true
    this.floor.rotation.x = - Math.PI * 0.5

  //  this.scene.add(this.sphere, this.floor)
   this.scene.add(this.floor)

  }

  setupParticles() {
    console.log('particles')
  }


  setupTextures() {
    console.log('textures')

    // gradient

  }

  physics() {
    console.log("physics")
 }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
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
    this.camera.position.set(2, 2, 2)
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