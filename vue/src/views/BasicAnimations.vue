<template>
  <canvas ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {Clock, Mesh, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import * as THREE from "three";
import gsap from "gsap";

const scene: Scene = new THREE.Scene()

// Object
const cube: Mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xff0000}) )

// Clock
const clock: Clock = new THREE.Clock()

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

  tick() {
    // Clock
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    cube.rotation.z = Math.tan(elapsedTime)
    // cube.rotation.z = Math.tan(elapsedTime * Math.PI)
    cube.position.y = Math.sin(elapsedTime)
    cube.position.x = Math.cos(elapsedTime)

    //renderer
    this.renderer.render(scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  mounted() {
    // object
    scene.add(cube)

    //camera
    this.camera.position.z = 3
    scene.add(this.camera)

    //renderer
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.render(scene, this.camera)

    // gsap.to(cube.position, {duration: 1, delay: 1, x: 2})

    //animations
    this.tick()

  }

}
</script>
