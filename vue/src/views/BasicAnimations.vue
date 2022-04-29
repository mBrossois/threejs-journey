<template>
  <canvas ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {Clock, Mesh, PerspectiveCamera, Scene, WebGLRenderer} from "three";

@Options({})
export default class BasicAnimations extends Vue {
  $refs!: {
    webgl: HTMLCanvasElement
  }
  sizes = {
    width: 800,
    height: 600
  }
  renderer: WebGLRenderer = {} as WebGLRenderer;
  camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height);

  cube: Mesh
  scene: Scene

  clock: Clock = new THREE.Clock()

  tick() {
    // Clock
    const elapsedTime = this.clock.getElapsedTime()

    // Update objects
    this.cube.rotation.z = Math.tan(elapsedTime)
    // cube.rotation.z = Math.tan(elapsedTime * Math.PI)
    this.cube.position.y = Math.sin(elapsedTime)
    this.cube.position.x = Math.cos(elapsedTime)

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)

  }

  mounted() {
    // Scene
    this.scene = new THREE.Scene()

    // Object
    this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({color: 0xff0000}))

    // object
    this.scene.add(this.cube)

    //camera
    this.camera.position.z = 3
    this.scene.add(this.camera)

    //renderer
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.render(this.scene, this.camera)

    // gsap.to(cube.position, {duration: 1, delay: 1, x: 2})

    //animations
    this.tick()

  }

}
</script>
