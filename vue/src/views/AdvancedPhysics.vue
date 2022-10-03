<template>
    <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, ConeGeometry, CubeTexture, CubeTextureLoader, DirectionalLight, Group, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshStandardMaterial, MeshToonMaterial, NearestFilter, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, Points, PointsMaterial, Scene, SphereGeometry, Texture, TorusGeometry, TorusKnotGeometry, Vector2, Vector3, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es'
import { Body, Box, Plane, SAPBroadphase, Sphere, Vec3 } from 'cannon-es'

@Options({})
export default class AdvancedPhysics extends Vue {
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

  // Lights
  directionalLight: DirectionalLight
  ambientLight: AmbientLight

  // objects
  sphere: Mesh
  floor: Mesh
  objectToUpdate: any[] = []

  // Material
  material: MeshToonMaterial
  sphereMaterial: MeshStandardMaterial
  defaultMaterial = new CANNON.Material('default')

  // Geometry
  sphereGeometry: SphereGeometry
  boxGeometry: BoxGeometry

  scene: Scene

  // Hovered?

  // Parameters
  parameters = {
  }

  // Mouse


  // Particles

  // Textures
  environmentMapTexture: CubeTexture

  // Sounds
  hitSound = new Audio('/sounds/hit.mp3')
  
  gui = new dat.GUI({width: 300})

  doc = document as FullScreenDocument

  clock = new THREE.Clock()
  oldElapsedTime = 0

  // Physics
  world: any
  sphereShape: Sphere
  sphereBody: Body

  floorBody: Body

  // Scroll

  tick() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.oldElapsedTime
    this.oldElapsedTime = elapsedTime

    // Physics world
    // this.sphereBody.applyForce(new CANNON.Vec3( - 0.5, 0, 0), this.sphereBody.position)

    this.world.step( 1 / 60, deltaTime, 3)

    for(const object of this.objectToUpdate) {
      object.mesh.position.copy(object.body.position)
      object.mesh.quaternion.copy(object.body.quaternion)
    }

    // const sphereBodyPos = this.sphereBody.position as unknown
    // this.sphere.position.copy(sphereBodyPos as Vector3)
    // this.sphere.position.x = this.sphereBody.position.x
    // this.sphere.position.y = this.sphereBody.position.y
    // this.sphere.position.z = this.sphereBody.position.z

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.close()

    const debugObject: any = {}
      
    debugObject.createSphere = () => (this.createSphere(Math.random() * 0.5, {x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() * 0.5) * 3} as Vec3 | Vector3))
    debugObject.createBox = () => (this.createBox(Math.random(), Math.random(), Math.random(), {x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() * 0.5) * 3} as Vec3 | Vector3))

    debugObject.reset = () => {
      for(const object of this.objectToUpdate) {
        // Removed
        object.body.removeEventListener('collide', this.playSound)
        this.world.removeBody(object.body)

        // console.log(object.mesh.uuid);
        // console.log(this.scene.children.find(mesh => mesh.uuid === object.mesh.uuid));
        const child = this.scene.children.find(mesh => mesh.uuid === object.mesh.uuid)

        // Remove scene
        if(child) {
          this.scene.remove(child)
          object.mesh.geometry.dispose()
          object.mesh.material.dispose()
        }
        
      }
      

      this.objectToUpdate = []

      
    }

    this.gui.add(debugObject, 'createSphere')
    this.gui.add(debugObject, 'createBox')
    this.gui.add(debugObject, 'reset')

  }

  setupLights() {
    console.log('lights')

    this.ambientLight = new AmbientLight(0xffffff, 0.7)

    this.directionalLight = new DirectionalLight(0xffffff, 0.2)
    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    this.directionalLight.shadow.camera.far = 15
    this.directionalLight.shadow.camera.left = -7
    this.directionalLight.shadow.camera.top = 7
    this.directionalLight.shadow.camera.right = 7
    this.directionalLight.shadow.camera.bottom = -7
    this.directionalLight.position.set(5, 5, 5)

    this.scene.add(this.ambientLight, this.directionalLight)

  }

  setupMaterial() {
    console.log('materials')
  }

  // Sounds
  playSound(collission: any){
    // console.log(collission.contact.getImpactVelocityAlongNormal() )
    let impactStrength = collission.contact.getImpactVelocityAlongNormal()
    if(impactStrength >= 1) {
      impactStrength = 1 - (1 / impactStrength)
    } else {
      impactStrength = 0
    }
    // if(impactStrength > 1.5) {
    if(impactStrength !== 0) {
      // this.hitSound.volume = Math.random()
      this.hitSound.volume = impactStrength
      this.hitSound.currentTime = 0
      this.hitSound.play()
    }
  }

  // utils
  createSphere(radius: number, position: THREE.Vector3 | CANNON.Vec3) {
    const mesh = new Mesh(
      this.sphereGeometry,
      this.sphereMaterial
    )

    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position as Vector3)
    this.scene.add(mesh)

    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: this.defaultMaterial
    })

    body.position.copy(position as Vec3)
    body.addEventListener('collide', this.playSound)

    this.world.addBody(body)

    // Add to array 
    this.objectToUpdate.push({
      mesh, 
      body
    })

  }

  createBox(height: number, width: number, depth: number, position: THREE.Vector3 | CANNON.Vec3) {
    const mesh = new Mesh(
      this.boxGeometry,
      this.sphereMaterial
    )

    mesh.castShadow = true
    mesh.scale.set(width, height, depth)
    mesh.position.copy(position as Vector3)
    this.scene.add(mesh)

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3,
      shape,
      material: this.defaultMaterial
    })

    body.position.copy(position as Vec3)
    body.addEventListener('collide', this.playSound)

    this.world.addBody(body)

    // Add to array
    this.objectToUpdate.push({
      mesh,
      body
    })
  }

  setupObjects() {
   console.log('objects')

   // Better for performance
   this.world.broadphase = new SAPBroadphase(this.world)
   this.world.allowSleep = true

    this.sphereGeometry = new SphereGeometry(1, 20, 20)
    this.sphereMaterial =  new MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: this.environmentMapTexture,
      })

      this.boxGeometry = new BoxGeometry(1, 1, 1)

  //  this.sphere = new Mesh(
  //   new SphereGeometry(0.5, 32, 32),
  //   new MeshStandardMaterial({
  //     metalness: 0.3,
  //     roughness: 0.4,
  //     envMap: this.environmentMapTexture,
  //     envMapIntensity: 0.5
  //   })
  //  )
  //  this.sphere.castShadow = true
  //  this.sphere.position.y = 0.5

    this.floor = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: this.environmentMapTexture,
        envMapIntensity: 0.5
      })
    )

    this.floor.receiveShadow = true
    this.floor.rotation.x = - Math.PI * 0.5

  //  this.scene.add(this.sphere, this.floor)
   this.scene.add(this.floor)

  }

  setupParticles() {
    console.log('particles')
  }


  setupTextures() {
    const cubeTextureLoader = new CubeTextureLoader

    // gradient
    this.environmentMapTexture = cubeTextureLoader.load([
      'textures/environmentMaps/0/px.png',
      'textures/environmentMaps/0/nx.png',
      'textures/environmentMaps/0/py.png',
      'textures/environmentMaps/0/ny.png',
      'textures/environmentMaps/0/pz.png',
      'textures/environmentMaps/0/nz.png',
    ])

  }

  physics() {
    console.log("physics")

    this.world = new CANNON.World()
    this.world.gravity.set(0, - 9.82, 0)

    // Materials
    // const concreteMaterial = new CANNON.Material('concrete')
    // const plasticMaterial = new CANNON.Material('plastic')
    // const defaultMaterial = new CANNON.Material('default')

    // const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    //   concreteMaterial,
    //   plasticMaterial,
    //   {
    //     friction: 0.1,
    //     restitution: 1.1
    //   }
    // )

    const defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7
      }
    )

    this.world.addContactMaterial(defaultContactMaterial)
    this.world.defaultContactMaterial = defaultContactMaterial
    
    // Sphere
    // this.sphereShape = new Sphere(0.5)
    // this.sphereBody = new Body({
    //   mass: 1,
    //   position: new Vec3(0, 3, 0),
    //   // material: defaultContactMaterial,
    //   // material: defaultMaterial,
    //   shape: this.sphereShape
    // })
    // this.sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
    // this.world.addBody(this.sphereBody)

    // Floor
    const floorShape = new Plane()
    this.floorBody = new Body()
    this.floorBody.mass = 0
    this.floorBody.addShape(floorShape)
    // this.floorBody.material = concreteMaterial
    // this.floorBody.material = defaultMaterial
    this.floorBody.quaternion.setFromAxisAngle(new Vec3(- 1, 0, 0), Math.PI * 0.5)
    this.world.addBody(this.floorBody)
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
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

  setupMouse() {
    console.log('Mouse')
  }

  setupControls() {
    console.log('Controls')
    const controls = new OrbitControls(this.camera, this.$refs.webgl)
    controls.enableDamping = true 
  }

  mounted() {
    // Initialize scene
    this.scene = new THREE.Scene()

    // Textureloader
    this.setupTextures()

    // Physics
    this.physics()

    // Lights
    this.setupLights()

    // Object
    this.setupMaterial()
    this.setupObjects()
    this.createSphere(0.5, {x: 0, y: 3, z: 0} as Vec3 | Vector3)
    
    // Particles
    this.setupParticles()

    // Debug
    this.debug()

    // Camera
    this.camera.position.set(- 3, 3, 3)
    this.scene.add(this.camera)

    // Axes helper
    // const axesHelper = new THREE.AxesHelper()
    // this.scene.add(axesHelper)

    // Renderer
    this.setupRenderer()

    // Controls
    this.setupControls()

    // Resizing
    this.resizePage()

    // Mouse
    this.setupMouse()

    // Tick
    this.tick()

    // Full screen
    // fullscreenUtil(this.$refs.webgl)

    // Scroll
  
  }

}
</script>