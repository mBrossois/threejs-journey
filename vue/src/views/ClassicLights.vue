\
<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";

@Options({})
export default class ClassicLights extends Vue {
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

  material: MeshStandardMaterial

  sphere: Mesh
  cube: Mesh
  torus: Mesh
  plane: Mesh

  // Low cost
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
  // Medium cost
  directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
  pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
  // High cost
  rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
  spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  tick() {
    const elapsedTime = this.clock.getElapsedTime()

    // Update objects
    this.sphere.rotation.y = 0.1 * elapsedTime
    this.cube.rotation.y = 0.1 * elapsedTime
    this.torus.rotation.y = 0.1 * elapsedTime

    this.sphere.rotation.x = 0.15 * elapsedTime
    this.cube.rotation.x = 0.15 * elapsedTime
    this.torus.rotation.x = 0.15 * elapsedTime

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
    this.gui.add(this.hemisphereLight, 'intensity').min(0).max(1).step(0.001)
    this.gui.add(this.pointLight, 'intensity').name('ptIntensity').min(0).max(1).step(0.001)
    this.gui.add(this.pointLight, 'distance').name('ptDistance').min(0).max(15).step(0.01)
    this.gui.add(this.pointLight, 'decay').name('ptDecay').min(0).max(3).step(0.005)
    this.gui.add(this.rectAreaLight, 'intensity').min(0).max(3).step(0.001)
    this.gui.add(this.rectAreaLight, 'width').min(0).max(3).step(0.001)
    this.gui.add(this.rectAreaLight, 'height').min(0).max(3).step(0.001)
    this.gui.add(this.spotLight, 'intensity').min(0).max(1).step(0.001)
    this.gui.add(this.spotLight.target.position, 'x').min(-5).max(5).step(0.001)

  }

  setupLights() {
    this.directionalLight.position.set(1, 0.25, 0)
    this.pointLight.position.set(1, -0.5, 1)
    this.rectAreaLight.position.set(-1.5, 0, 1.5)
    this.rectAreaLight.lookAt(new THREE.Vector3())
    this.spotLight.position.set(0, 2, 3)
    this.spotLight.target.position.x = -.75

    this.scene.add(this.ambientLight, this.hemisphereLight, this.directionalLight, this.pointLight, this.rectAreaLight, this.spotLight, this.spotLight.target)

    // Helpers
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(this.hemisphereLight, 0.2)
    const directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 0.2)
    const pointLightHelper = new THREE.PointLightHelper(this.pointLight, 0.2)
    const spotLightHelper = new THREE.SpotLightHelper(this.spotLight)
    const rectAreaLightHelper = new RectAreaLightHelper(this.rectAreaLight)

    this.scene.add(hemisphereLightHelper, directionalLightHelper, pointLightHelper, spotLightHelper, rectAreaLightHelper)

    window.requestAnimationFrame(() => {
      spotLightHelper.update()
    })

  }

  setupMaterial() {
    this.material = new THREE.MeshStandardMaterial()
    this.material.roughness = 0.4

  }

  setupObjects() {
    // Objects
    this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        this.material
    )
    this.sphere.position.x = -1.5

    this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.75, 0.75),
        this.material
    )

    this.torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 32, 64),
        this.material
    )
    this.torus.position.x = 1.5

    this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        this.material
    )
    this.plane.rotation.x = -Math.PI * 0.5
    this.plane.position.y = -0.65

    this.scene.add(this.sphere, this.cube, this.torus, this.plane)

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
