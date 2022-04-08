<template>
  <canvas ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three"
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";

const scene: Scene = new THREE.Scene()

@Options({})
export default class BasicScene extends Vue{
  sizes = {
    width: 800,
    height: 600
  }
  renderer?: WebGLRenderer;
  camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height);
  $refs!: {
    webgl: HTMLCanvasElement
  }

  mounted() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const mesh = new THREE.Mesh(geometry, material)

    scene.add(mesh)

    // Camera
    this.camera.position.z = 3

    // Renderer
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.render(scene, this.camera)
  }
}
</script>
