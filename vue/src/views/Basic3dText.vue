<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {Mesh, MeshMatcapMaterial, PerspectiveCamera, Scene, TorusGeometry, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";

@Options({})
export default class Basic3dText extends Vue {
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

  material: MeshMatcapMaterial

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  tick() {
    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()
    this.gui.add(this.material, 'flatShading')
    this.gui.addColor(this.material, 'color')
    this.gui.add(this.material, 'visible')
  }

  addRandomDonuts(donutGeometry: TorusGeometry) {
    // Add random objects
    for (let i = 0; i < 100; i++) {
      const donut = new Mesh(donutGeometry, this.material)
      donut.position.x = (Math.random() - .5) * 10
      donut.position.y = (Math.random() - .5) * 10
      donut.position.z = (Math.random() - .5) * 10

      donut.rotation.x = Math.random() * Math.PI
      donut.rotation.y = Math.random() * Math.PI

      const scale = Math.random()
      donut.scale.set(scale, scale, scale)
      this.scene.add(donut)
    }
  }

  setupRandomScene() {

// Textures
    const textureLoader = new THREE.TextureLoader()

    const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

// Fonts
    const fontLoader = new FontLoader()

    fontLoader.load(
        '/fonts/helvetiker_regular.typeface.json ',
        (font) => {
          const textGeometry = new TextGeometry(
              'Mark Brossois',
              {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
              }
          )
          this.material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
          // textMaterial.wireframe = true

          // Center text
          // textGeometry.computeBoundingBox()
          // textGeometry.translate(
          //     - (textGeometry.boundingBox?.max.x - 0.02) * 0.5, // Subtract bevelSize
          //     - (textGeometry.boundingBox?.max.y - 0.02) * .5, // Subtract bevelSize
          //     - (textGeometry.boundingBox?.max.z -0.03) * .5 // Subtract bevelThickness
          // )
          textGeometry.center()

          const text = new THREE.Mesh(textGeometry, this.material)
          this.scene.add(text)

          const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
          this.addRandomDonuts(donutGeometry)

          // Debug
          this.debug()

        }
    )
  }

  mounted() {
    // Initialize scene
    this.scene = new THREE.Scene()

    // Object
    this.setupRandomScene()

    //camera
    this.camera.position.set(1, 1, 1)
    // this.camera.position.z = 2
    this.scene.add(this.camera)

    // Axes helper
    const axesHelper = new THREE.AxesHelper()
    this.scene.add(axesHelper)

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
