<template>
  <canvas ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import * as THREE from "three";

const scene: Scene = new THREE.Scene()

@Options({})
export default class BasicsTransformObjects extends Vue{
  sizes = {
    width: 800,
    height: 600
  }
  renderer?: WebGLRenderer;
  camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height);
  $refs!: {
    webgl: HTMLCanvasElement
  }
  explanation() {
    console.log('explanation')
    // const geometry = new THREE.BoxGeometry(1, 1, 1)
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    // const mesh = new THREE.Mesh(geometry, material)
    // // mesh.position.x = -1.8
    // // mesh.position.y = 2.2
    // // mesh.position.z = -1
    // mesh.position.set(1.1, 2, -2.2)
    // mesh.scale.set(0.5, 1, 3)
    //
    // mesh.rotation.reorder('YXZ')
    // //Half rotation uses pi 3.14 or Math.PI
    // mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.3, 0)
    // scene.add(mesh)
    //
    // //Sets length to 1
    // // console.log('normalize', mesh.position.normalize())
    // // mesh.position.normalize()
    //
    // console.log('positionLength', mesh.position.length() )
    // console.log('distanceToCamera', mesh.position.distanceTo(this.camera.position) )
    // this.camera.lookAt(mesh.position)
  }
  mounted() {

    const group = new THREE.Group()
    group.position.set(1, 1, -1)
    group.rotation.set(0, Math.PI * 0.25, 0)
    scene.add(group)

    const cube1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({color: 0xff0000}) )
    cube1.rotation.set(Math.PI * 0.25, 0, 0)
    group.add(cube1)
    const cube2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({color: 0x00ff00})
     )
    cube2.position.x = -2

    group.add(cube2)

    const cube3 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({color: 0x0000ff})
     )
    cube3.position.x = 2

    group.add(cube3)
    //axes helper
    const axesHelper = new THREE.AxesHelper(2)
    scene.add(axesHelper)

    // Camera
    this.camera.position.z = 3
    // this.camera.position.set(1, 1, 3 )


    // Renderer
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.render(scene, this.camera)
  }
}
</script>
