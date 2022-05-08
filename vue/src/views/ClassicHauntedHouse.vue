\
<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {
  Group,
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
export default class ClassicHauntedHouse extends Vue {
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

  // Objects house
  house: Group
  walls: Mesh
  roof: Mesh
  door: Mesh

  // Bush
  bushGeometry = new THREE.SphereGeometry(1, 16, 16)
  bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'})

  // Textures
  floor: Mesh


  // Low cost
  ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
  // Medium cost
  moonLight = new THREE.DirectionalLight('#ffffff', 0.5)

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

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
    this.gui.add(this.ambientLight, 'intensity').min(0).max(1).step(0.001)
    this.gui.add(this.moonLight, 'intensity').min(0).max(1).step(0.001)
    this.gui.add(this.moonLight.position, 'x').min(-5).max(5).step(0.001)
    this.gui.add(this.moonLight.position, 'y').min(-5).max(5).step(0.001)
    this.gui.add(this.moonLight.position, 'z').min(-5).max(5).step(0.001)


  }

  setupTextures() {
    const textureLoader = new THREE.TextureLoader()

  }

  setupLights() {
    this.moonLight.position.set(4, 5, -2)


    this.scene.add(this.ambientLight, this.moonLight)
  }

  setupObjects() {
    // House
    this.house = new THREE.Group()
    // Walls
    this.walls = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2.5, 4),
        new THREE.MeshStandardMaterial({color: '#ac8e82'})
    )
    this.walls.position.y = 2.5 / 2

    // Roofs
    this.roof = new THREE.Mesh(
        new THREE.ConeGeometry(3.5, 1, 4),
        new THREE.MeshStandardMaterial({color: '#b35f45'})
    )
    this.roof.rotation.y = Math.PI * 0.25
    this.roof.position.y = (this.walls.position.y * 2) + (1 / 2)

    // Door
    this.door = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.MeshStandardMaterial({color: '#b34f45'})
    )
    this.door.position.y = 2 / 2
    this.door.position.z = 2 + 0.01

    // Bushes
    const bush1 = new THREE.Mesh(
        this.bushGeometry,
        this.bushMaterial
    )
    bush1.scale.set(0.5, 0.5, 0.5)
    bush1.position.set(0.8, 0.2, 2.2)

    const bush2 = new THREE.Mesh(
        this.bushGeometry,
        this.bushMaterial
    )
    bush2.scale.set(0.25, 0.25, 0.25)
    bush2.position.set(1.4, 0.1, 2.1)

    const bush3 = new THREE.Mesh(
        this.bushGeometry,
        this.bushMaterial
    )
    bush3.scale.set(0.4, 0.4, 0.4)
    bush3.position.set(-0.8, 0.1, 2.2)

    const bush4 = new THREE.Mesh(
        this.bushGeometry,
        this.bushMaterial
    )
    bush4.scale.set(0.15, 0.15, 0.15)
    bush4.position.set(-1, 0.05, 2.6)

    // Everything is a house!
    this.house.add(this.walls, this.roof, this.door, bush1, bush2, bush3, bush4)


    this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({color: '#a9c388'})

    )
    this.floor.rotation.x = -Math.PI * 0.5
    this.floor.position.y = 0

    this.scene.add(this.floor, this.house )

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
    this.setupObjects()

    // Debug
    this.debug()

    //camera
    this.camera.position.set(4, 2, 5)
    this.scene.add(this.camera)

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
