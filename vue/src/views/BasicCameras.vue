<template>
  <canvas ref="webgl"/>
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
export default class BasicCameras extends Vue {
  $refs!: {
    webgl: HTMLCanvasElement
  }
  sizes = {
    width: 800,
    height: 600
  }
  cursor = {
    x: 0,
    y: 0
  }
  renderer: WebGLRenderer = {} as WebGLRenderer;
  // fov between 45 & 75 || only shows objects between near and far values
  camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
  // aspectRatio = this.sizes.width / this.sizes.height;
  // camera: OrthographicCamera = new THREE.OrthographicCamera(-1 * this.aspectRatio, 1 * this.aspectRatio, 1, -1, 0.1, 100)
  controls: OrbitControls = {} as OrbitControls

  tick() {
    // Clock
    // const elapsedTime = clock.getElapsedTime()

    // Update objects
    // cube.rotation.y = elapsedTime
    // cube.position.y = Math.sin(elapsedTime)

    // this.camera.position.x = Math.sin( this.cursor.x * Math.PI * 2) * 2
    // this.camera.position.z = Math.cos( this.cursor.x * Math.PI * 2) * 2
    // this.camera.position.y = this.cursor.y * 3
    // this.camera.lookAt(cube.position)

    // Update controls
    this.controls.update()

    // cube.position.x = this.cursor.x
    // cube.position.y = this.cursor.y

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

    // gsap.to(cube.position, {duration: 1, delay: 1, x: 2})

    this.controls = new OrbitControls(this.camera, this.$refs.webgl);
    this.controls.enableDamping = true;
    // controls.target.y = 2

    //animations
    this.tick()

    // Custom controls
    // this.$refs.webgl.addEventListener('mousemove', (event) => {
    //   this.cursor.x = - (event.offsetX /this.sizes.width - 0.5)
    //   this.cursor.y = event.offsetY /this.sizes.height - 0.5
    // })

  }

}
</script>
