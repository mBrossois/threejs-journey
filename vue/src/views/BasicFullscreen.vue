<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {Clock, Mesh, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import * as THREE from "three";
import gsap from "gsap";
import {offset} from "@popperjs/core";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene: Scene = new THREE.Scene()

// Object
const cube: Mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xff0000}) )

// Clock
const clock: Clock = new THREE.Clock()

@Options({})
export default class BasicFullscreen extends Vue {
  $refs!: {
    webgl: HTMLCanvasElement
  }
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  cursor = {
    x: 0,
    y: 0
  }
  renderer: WebGLRenderer = {} as WebGLRenderer;
  // fov between 45 & 75 || only shows objects between near and far values
  camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
  controls: OrbitControls = {} as OrbitControls

  tick() {
    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  mounted() {
    // object
    scene.add(cube)

    //camera
    // this.camera.position.set(2, 2, 2)
    this.camera.position.z = 3
    this.camera.lookAt(cube.position)
    scene.add(this.camera)

    //renderer
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.render(scene, this.camera)

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

    // Double click to full screen
    window.addEventListener('dblclick', () =>
    {
      //Todo check for support for safari
      if(document.fullscreenElement)
      {
        document.exitFullscreen()
      }
      else
      {
        this.$refs.webgl.requestFullscreen()
      }
    })

    //animations
    this.tick()
  }

}
</script>

<style lang="scss">
.webgl {
  position: fixed;
  top:0;
  left: 0;
  z-index: 0;
  outline: none;

}
</style>