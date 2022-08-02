\
<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, Points, Scene, Texture, Vector2, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";
import { tsThisType } from "@babel/types";
import { randFloat } from "three/src/math/MathUtils";

@Options({})
export default class ClassicRaycaster extends Vue {
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

  // objects
  raycaster: THREE.Raycaster;

  geometry: THREE.SphereGeometry;

  object1: Mesh;
  object2: Mesh;
  object3: Mesh;

  scene: Scene

  // Hovered?
  objectsIntersected: Array<Mesh> = [] as Array<Mesh>

  // Mouse
  mouse:Vector2

  // Textures
  startTexture: Texture

  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock();

  tick() {
    const elapsedTime = this.clock.getElapsedTime()

    this.object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    this.object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    this.object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera)
    // const raycasterOrigin = new THREE.Vector3(-3, 0 ,0)
    // const raycasterDirection = new THREE.Vector3(10, 0 ,0)
    // raycasterDirection.normalize()

    // this.raycaster.set(raycasterOrigin, raycasterDirection)

    const objectsToTest = [this.object1, this.object2, this.object3]
    const intersectsObjects = this.raycaster.intersectObjects(objectsToTest)

    for(const object of objectsToTest) {
      const material = object.material as MeshBasicMaterial
      material.color.set('#ff0000')
    }

    for(const intersect of intersectsObjects){
      const object = intersect.object as Mesh
      const material = object.material as MeshBasicMaterial
      material.color.set('#0000ff')
    }

    if(intersectsObjects.length) {
      if(this.objectsIntersected.length === 0) {
        this.objectsIntersected.push(intersectsObjects[0].object as Mesh)
      }
    } else {
      if(this.objectsIntersected.length > 0) {
        this.objectsIntersected = [];
      }
    }

    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()

  }

  setupLights() {

    console.log('lights')

  }

  setupMaterial() {
    console.log('materials')
  }

  setupObjects() {
   console.log('objects')

   this.geometry = new THREE.SphereGeometry(0.5, 16, 16)

   this.object1 = new THREE.Mesh(
    this.geometry,
    new THREE.MeshBasicMaterial({color: '#ff0000'})
   )
    this.object1.position.x = -2

   this.object2 = new THREE.Mesh(
    this.geometry,
    new THREE.MeshBasicMaterial({color: '#ff0000'})
   )


   this.object3 = new THREE.Mesh(
    this.geometry,
    new THREE.MeshBasicMaterial({color: '#ff0000'})
   )
    this.object3.position.x = 2
   this.scene.add(this.object1, this.object2, this.object3)

    // Raycaster
   this.raycaster = new THREE.Raycaster()

  }

  setupParticles() {
    console.log('particles')

  }


  setupTextures() {
    const textureLoader = new THREE.TextureLoader()

    // Door
    this.startTexture = textureLoader.load('/textures/particles/2.png')

  }

  setupMouse() {
    this.mouse = new Vector2() 

    window.addEventListener('mousemove', (_event) => {
      this.mouse.x = _event.clientX / this.sizes.width * 2 - 1
      this.mouse.y = - (_event.clientY / this.sizes.height) * 2 + 1
    })

    window.addEventListener('click', (event) => {
      if(this.objectsIntersected.length > 0) {
        console.log(this.objectsIntersected[0])
      }
    })
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

    // Mouse tracker
    this.setupMouse()

    //camera
    this.camera.position.z = 3
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
