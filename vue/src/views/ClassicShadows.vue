\
<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {
  Mesh, MeshBasicMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Texture,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";

@Options({})
export default class ClassicShadows extends Vue {
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

  material= new THREE.MeshStandardMaterial()

  // Textures
  bakedShadow: Texture
  simpleShadow: Texture

  sphere: Mesh
  plane: Mesh
  sphereShadow: Mesh<PlaneGeometry, MeshBasicMaterial>

  // Low cost
  ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  // Medium cost
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
  pointLight = new THREE.PointLight(0xffffff, 0.3)
  // High cost
  spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  tick() {
    const elapsedTime = this.clock.getElapsedTime()

    // Move object
    this.sphere.position.x = Math.cos(elapsedTime) * 1.5
    this.sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
    this.sphere.position.z = Math.sin(elapsedTime) * 1.5

    // Update shadow
    this.sphereShadow.position.x = this.sphere.position.x
    this.sphereShadow.position.z = this.sphere.position.z
    this.sphereShadow.material.opacity = (1 - this.sphere.position.y) * 0.3


        // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()
    this.gui.add(this.ambientLight, 'intensity').min(0).max(1).step(0.001)
    this.gui.add(this.directionalLight, 'intensity').min(0).max(1).step(0.001)
    this.gui.add(this.directionalLight.position, 'x').min(-5).max(5).step(0.01)
    this.gui.add(this.directionalLight.position, 'y').min(-5).max(5).step(0.01)
    this.gui.add(this.directionalLight.position, 'z').min(-5).max(5).step(0.01)
    this.gui.add(this.material, 'metalness').min(0).max(1).step(0.001)
    this.gui.add(this.material, 'roughness').min(0).max(1).step(0.001)

  }

  setupTextures() {
    const textureLoader = new THREE.TextureLoader()
    this.bakedShadow = textureLoader.load('/textures/shadows/bakedShadow.jpg')
    this.simpleShadow = textureLoader.load('/textures/shadows/simpleShadow.jpg')
  }

  setupLights() {
    this.directionalLight.position.set(2, 2, -1)
    this.spotLight.position.set(0, 2, 2)
    this.pointLight.position.set(-1, 1, 0)

    this.scene.add(this.ambientLight, this.directionalLight, this.spotLight, this.spotLight.target, this.pointLight)
  }

  setupMaterial() {
    this.material.roughness = 0.7
  }

  setupObjects() {
    // Objects
    this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        this.material
    )

    this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        // Map for static scenes/objects
        // new THREE.MeshBasicMaterial({map: this.bakedShadow})
        this.material
    )
    this.plane.rotation.x = -Math.PI * 0.5
    this.plane.position.y = -0.5

    // Shadow of sphere on the plane
    this.sphereShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 1.5),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          alphaMap: this.simpleShadow
        })
    )
    this.sphereShadow.rotation.x = - Math.PI * 0.5
    this.sphereShadow.position.y = this.plane.position.y + 0.01

    this.scene.add(this.sphere, this.sphereShadow, this.plane)

  }

  setupShadow() {
    // To cast shadows
    this.renderer.shadowMap.enabled = false
    this.sphere.castShadow = true
    this.directionalLight.castShadow = true
    this.spotLight.castShadow = true
    this.pointLight.castShadow = true

    // To receive shadows
    this.plane.receiveShadow = true

    // Shadow camera settings
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    // Camera is orthogrophic camera
    this.directionalLight.shadow.camera.near = 1
    this.directionalLight.shadow.camera.far = 6
    this.directionalLight.shadow.camera.left = -2
    this.directionalLight.shadow.camera.right = 2
    this.directionalLight.shadow.camera.top = 2
    this.directionalLight.shadow.camera.bottom = -2
    // this.directionalLight.shadow.radius = 10
    this.spotLight.shadow.mapSize.set(1024, 1024)
    this.spotLight.shadow.camera.fov = 30
    this.spotLight.shadow.camera.near = 1
    this.spotLight.shadow.camera.far = 6
    // Point light
    this.pointLight.shadow.mapSize.set(1024, 1024)
    this.pointLight.shadow.camera.near = 0.1
    this.pointLight.shadow.camera.far = 5

    // Camera helpers
    const directionalLightCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera)
    directionalLightCameraHelper.visible = false
    const spotlightCameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera)
    spotlightCameraHelper.visible = false
    const pointLightCameraHelper = new THREE.CameraHelper(this.pointLight.shadow.camera)
    pointLightCameraHelper.visible = false
    this.scene.add(directionalLightCameraHelper, spotlightCameraHelper, pointLightCameraHelper)

    // Shadow type
    this.renderer.shadowMap.type = PCFSoftShadowMap
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

    // Load texture
    this.setupTextures()

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

    //renderer
    this.setupRenderer()

    // Shadows
    this.setupShadow()

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
