<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Texture, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import gsap from 'gsap'

@Options({})
export default class BasicTextures extends Vue {
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
  geometry: BoxGeometry
  material: MeshBasicMaterial
  mesh: Mesh

  colorTexture: Texture

  // Debug
  gui = new dat.GUI({width: 400}).close()
  parameters: any

  doc = document as FullScreenDocument

  tick() {
    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.add(this.mesh.position, 'y')
        .min(-3)
        .max(3)
        .step(0.01)
        .name('elevation')

    this.gui.add(this.mesh, 'visible')
    this.gui.add(this.material, 'wireframe')

    this.gui.addColor(this.material, 'color')

    this.gui.add(this.parameters, 'spin')
  }

  textureLoader() {
    const loadingManager = new THREE.LoadingManager()
    loadingManager.onStart = () => {
      console.log('loading started')
    }
    loadingManager.onLoad = () => {
      console.log('loading finished')
    }
    loadingManager.onProgress = () => {
      console.log('loading in progress')
    }
    loadingManager.onError = (e: any) => {
      console.log('loading error', e)
    }

    // With tinyPNG can make img smaller, but might look worse
    const textureLoader = new THREE.TextureLoader(loadingManager)
    this.colorTexture = textureLoader.load('/textures/minecraft.png')
    const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
    const heightTexture = textureLoader.load('/textures/door/height.jpg')
    const normalTexture = textureLoader.load('/textures/door/normal.jpg')
    const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
    const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
    const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
//
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping
//
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI * .25
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

    this.colorTexture.generateMipmaps = false
    this.colorTexture.minFilter = THREE.NearestFilter
    this.colorTexture.magFilter = THREE.NearestFilter
  }

  mounted() {
    // Initialize scene
    this.scene = new THREE.Scene()

    // Load the textures
    this.textureLoader()

    // object
    this.geometry = new THREE.BoxGeometry(1, 1, 1)
    this.material = new THREE.MeshBasicMaterial({map: this.colorTexture})
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)

    //camera
    // this.camera.position.set(2, 2, 2)
    this.camera.position.z = 3
    this.camera.lookAt(this.mesh.position)
    this.scene.add(this.camera)

    //renderer
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.render(this.scene, this.camera)

    this.controls = new OrbitControls(this.camera, this.$refs.webgl);
    this.controls.enableDamping = true;

    // Debug
    this.parameters = {
      spin: () => {
        gsap.to(this.mesh.rotation, {duration: 1, y: this.mesh.rotation.y + Math.PI * 2})
      }
    }

    // Resizing
    window.addEventListener('resize', () => {
      this.sizes.height = window.innerHeight
      this.sizes.width = window.innerWidth

      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.sizes.width, this.sizes.height)

      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // Full screen
    fullscreenUtil(this.$refs.webgl)

    //animations
    this.tick()

    // Debug
    this.debug()

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
