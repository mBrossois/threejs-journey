\
<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {Group, Mesh, PerspectiveCamera, Scene, Texture, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'

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

  backgroundColor = '#262837'

  scene: Scene

  house: Group
  graves: Group

  // Objects house
  walls: Mesh
  roof: Mesh
  door: Mesh

  // Bush
  bushGeometry = new THREE.SphereGeometry(1, 16, 16)
  bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'})

  // Grave
  graveGeometry = new THREE.BoxGeometry(0.5, 1, 0.1)
  graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

  floor: Mesh

  // Textures
  // Door
  doorColorTexture: Texture
  doorAlphaTexture: Texture
  doorAmbientOcclusionTexture: Texture
  doorHeightTexture: Texture
  doorMetalnessTexture: Texture
  doorNormalTexture: Texture
  doorRoughnessTexture: Texture
  // House
  bricksAmbientOcclusionTexture: Texture
  bricksColorTexture: Texture
  bricksNormalTexture: Texture
  bricksRoughnessTexture: Texture
  // Grass
  grassAmbientOcclusionTexture: Texture
  grassColorTexture: Texture
  grassNormalTexture: Texture
  grassRoughnessTexture: Texture

  // Low cost
  ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
  // Medium cost
  moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
  doorLight = new THREE.PointLight('#ff7d46', 1, 6)

  // Fog
  fog = new THREE.Fog(this.backgroundColor, 1, 15)

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
    this.gui.add(this.doorLight, 'intensity').min(0).max(1).step(0.001)
    this.gui.add(this.doorLight, 'distance').min(0).max(10).step(0.001)

  }

  setupTextures() {
    const textureLoader = new THREE.TextureLoader()

    // Door
    this.doorColorTexture = textureLoader.load('/textures/door/color.jpg')
    this.doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
    this.doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
    this.doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
    this.doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
    this.doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
    this.doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

    // Bricks
    this.bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
    this.bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
    this.bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
    this.bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

    // Grass
    this.grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
    this.grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
    this.grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
    this.grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

    this.grassColorTexture.repeat.set(8, 8)
    this.grassNormalTexture.repeat.set(8, 8)
    this.grassRoughnessTexture.repeat.set(8, 8)
    this.grassAmbientOcclusionTexture.repeat.set(8, 8)

    this.grassColorTexture.wrapS = THREE.RepeatWrapping
    this.grassNormalTexture.wrapS = THREE.RepeatWrapping
    this.grassRoughnessTexture.wrapS = THREE.RepeatWrapping
    this.grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping

    this.grassColorTexture.wrapT = THREE.RepeatWrapping
    this.grassNormalTexture.wrapT = THREE.RepeatWrapping
    this.grassRoughnessTexture.wrapT = THREE.RepeatWrapping
    this.grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping

  }

  setupLights() {
    this.moonLight.position.set(4, 5, -2)
    this.doorLight.position.set(0, 2.2, 2.7)

    this.scene.add(this.ambientLight, this.moonLight)
  }

  setupGrave() {
    const angle = Math.random() * Math.PI * 2 // Random angle
    const radius = 3 + Math.random() * 6 // Random radius
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const grave = new THREE.Mesh(
        this.graveGeometry,
        this.graveMaterial
    )
    grave.position.x = x
    grave.position.z = z

    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5)


    this.graves.position.y = 1 / 2

    this.graves.add(grave)
  }

  setupObjects() {
    // House
    this.house = new THREE.Group()
    // Walls
    this.walls = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2.5, 4),
        new THREE.MeshStandardMaterial({
          transparent: true,
          map: this.bricksColorTexture,
          normalMap: this.bricksNormalTexture,
          roughnessMap: this.bricksRoughnessTexture,
          aoMap: this.doorAmbientOcclusionTexture
        })
    )
    this.walls.position.y = 2.5 / 2
    this.walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(this.walls.geometry.attributes.uv.array, 2))

    // Roofs
    this.roof = new THREE.Mesh(
        new THREE.ConeGeometry(3.5, 1, 4),
        new THREE.MeshStandardMaterial({color: '#b35f45'})
    )
    this.roof.rotation.y = Math.PI * 0.25
    this.roof.position.y = (this.walls.position.y * 2) + (1 / 2)

    // Door
    this.door = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
        new THREE.MeshStandardMaterial({
          transparent: true,
          map: this.doorColorTexture,
          normalMap: this.doorNormalTexture,
          alphaMap: this.doorAlphaTexture,
          aoMap: this.doorAmbientOcclusionTexture,
          displacementMap: this.doorHeightTexture,
          displacementScale: 0.1,
          metalnessMap: this.doorMetalnessTexture,
          roughnessMap: this.doorMetalnessTexture
        })
    )
    this.door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(this.door.geometry.attributes.uv.array, 2))
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
    this.house.add(this.walls, this.roof, this.door, bush1, bush2, bush3, bush4, this.doorLight)


    // Graves
    this.graves = new THREE.Group()

    for (let i = 0; i < 50; i++) {
      this.setupGrave()
    }

    this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({
          transparent: true,
          map: this.grassColorTexture,
          normalMap: this.grassNormalTexture,
          roughnessMap: this.grassRoughnessTexture,
          aoMap: this.grassAmbientOcclusionTexture
        })
    )
    this.floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(this.floor.geometry.attributes.uv.array, 2))
    this.floor.rotation.x = -Math.PI * 0.5
    this.floor.position.y = 0

    this.scene.add(this.floor, this.house, this.graves)

  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(this.backgroundColor)
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
    this.scene.fog = this.fog

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
