<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {CubeTexture, CubeTextureLoader, Mesh, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'

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

  scene: Scene

  ambientLight = new THREE.AmbientLight(0xffffff, .5)
  pointLight = new THREE.PointLight(0xffffff, .5)

  sphere: Mesh
  plane: Mesh
  torus: Mesh

  material: any
  environmentMapTexture: CubeTexture

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  rotateMesh(mesh: Mesh, elapsedTime: number) {
    mesh.rotation.x = 0.15 * elapsedTime
    mesh.rotation.y = 0.1 * elapsedTime
  }

  tick() {
    const elapsedTime = this.clock.getElapsedTime()
    // Update objects
    this.rotateMesh(this.sphere, elapsedTime)
    this.rotateMesh(this.plane, elapsedTime)
    this.rotateMesh(this.torus, elapsedTime)

    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.add(this.material, 'wireframe')
    this.gui.add(this.material, 'metalness').min(0).max(1).step(0.0001)
    this.gui.add(this.material, 'roughness').min(0).max(1).step(0.0001)
    this.gui.add(this.material, 'aoMapIntensity').min(0).max(2).step(0.0001)
    this.gui.add(this.material, 'displacementScale').min(0).max(1).step(0.0001)
  }

  textureLoaders() {
    const textureLoader = new THREE.TextureLoader()
    const cubeTextureLoader = new THREE.CubeTextureLoader()

    const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
    const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
    const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
    const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
    const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
    const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
    const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
    const matcapsTexture = textureLoader.load('/textures/matcaps/8.png')
    const gradientsTexture = textureLoader.load('/textures/gradients/3.jpg')
    gradientsTexture.minFilter = THREE.NearestFilter
    gradientsTexture.magFilter = THREE.NearestFilter
// Can deactivate with NearestFilter
    gradientsTexture.generateMipmaps = false

    this.environmentMapTexture = cubeTextureLoader.load([
      'textures/environmentMaps/3/py.jpg',
      'textures/environmentMaps/3/nx.jpg',
      'textures/environmentMaps/3/px.jpg',
      'textures/environmentMaps/3/ny.jpg',
      'textures/environmentMaps/3/pz.jpg',
      'textures/environmentMaps/3/nz.jpg',
    ])

  }

  addObjects() {

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

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientsTexture

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5 )
// material.alphaMap = doorAlphaTexture
// material.transparent = true

    this.material = new THREE.MeshStandardMaterial()
    this.material.metalness = 0.7
    this.material.roughness = 0.2
    this.material.envMap = this.environmentMapTexture

    this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 64, 64),
        this.material
    )

    this.sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(this.sphere.geometry.attributes.uv.array, 2))

    this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1, 100, 100),
        this.material
    )

    this.plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(this.plane.geometry.attributes.uv.array, 2))

    this.torus = new THREE.Mesh(
        new THREE.TorusGeometry(.3, .2, 64, 128),
        this.material
    )

    this.torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(this.torus.geometry.attributes.uv.array, 2))
  }

  mounted() {
    // Initialize scene
    this.scene = new THREE.Scene()

    // Add loaders
    this.textureLoaders()

    // objects
    this.addObjects()
    this.sphere.position.x = -1.5
    this.torus.position.x = 1.5
    this.scene.add(this.sphere, this.plane, this.torus)

    // Light
    this.pointLight.position.x = 2
    this.pointLight.position.y = 3
    this.pointLight.position.z = 4
    this.scene.add(this.pointLight)

    this.scene.add(this.ambientLight)

    //camera
    // this.camera.position.set(2, 2, 2)
    this.camera.position.z = 2
    this.scene.add(this.camera)

    //renderer
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.render(this.scene, this.camera)

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

    // Debug
    this.debug()

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
