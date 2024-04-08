import "./style.css"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as CANNON from 'cannon-es'
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

// import CannonDebugger from 'cannon-es-debugger'

//cannon world

// const world = new CANNON.World({
//   gravity: new CANNON.Vec3(0, 0, 0), // m/s²
// })
// console.log(world);


// world.addBody(phyBody)
const keyControls = {}
// phyBody.quaternion.setFromEuler(-Math.PI * .5, 0, 0)
window.addEventListener("keydown", (e) => {
  if (e.key === "w") {
    keyControls['w'] = true

  }
  if (e.key === 's') keyControls["s"] = true
  if (e.key === "a") keyControls["a"] = true
  if (e.key === "d") keyControls["d"] = true
  if (e.key === "q") keyControls["q"] = true
  if (e.key === "e") keyControls["e"] = true
  if (e.key === "Shift") keyControls["Shift"] = true
  console.log(e.key);

})
window.addEventListener("keyup", (e) => {
  if (e.key === "w") {
    keyControls['w'] = false

  }
  if (e.key === "s") keyControls["s"] = false
  if (e.key === "a") keyControls["a"] = false
  if (e.key === "d") keyControls["d"] = false
  if (e.key === "q") keyControls["q"] = false
  if (e.key === "e") keyControls["e"] = false
  if (e.key === "Shift") keyControls["Shift"] = false
})

// world.addBody(phyBody)


//model




/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()




//light
const ambLight = new THREE.AmbientLight(0xffffff, 4)
scene.add(ambLight)



const boxGeometry = new THREE.PlaneGeometry(20, 20)
const boxMesh = new THREE.Mesh(
  boxGeometry,
  new THREE.MeshBasicMaterial({
    visible: false
  })
)
boxMesh.rotation.x = -Math.PI * .5

//const cubic
const gridHelper = new THREE.GridHelper(20, 20)
scene.add(gridHelper)
scene.add(boxMesh)
const sphereMesh = new THREE.Mesh(
  new THREE.BoxGeometry(8, 8, 8),
  new THREE.MeshBasicMaterial()
)


// scene.add(sphereMesh)

// scene.add(boxMesh)
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight



  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 8
camera.position.y = 15


scene.add(camera)

const mousePosition = new THREE.Vector2()
const highlightMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true
  })
);

const rayCaster = new THREE.Raycaster()
let interSect = null
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);

const meshSphered = new THREE.Mesh(
  new THREE.SphereGeometry(.4, 4, 2),
  new THREE.MeshBasicMaterial({
    // wireframe: true
    color: "blue"
  })
)


window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / sizes.width) * 2 - 1
  mousePosition.y = -(e.clientY / sizes.height) * 2 + 1


  rayCaster.setFromCamera(mousePosition, camera)
  // console.log(mousePosition);
  interSect = rayCaster.intersectObject(boxMesh)
  // console.log(interSect[0]);

  if (interSect.length > 0) {

    const intersect = interSect[0];
    const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
    // highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
    // console.log(highlightPos);
    highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);


  }



})

let objects = []

window.addEventListener("mousedown", (e) => {
  const objectExit = objects.find((object) =>
    (object.position.x === highlightMesh.position.x) && (object.position.z === highlightMesh.position.z)
  )


  // console.log(objectExit);
  if (!objectExit) {
    const sphereMesh = meshSphered.clone()
    sphereMesh.position.copy(highlightMesh.position)
    sphereMesh.position.y = 2
    console.log(sphereMesh);
    scene.add(sphereMesh)
    objects.push(sphereMesh)
  }
  if (objectExit) {
    scene.remove(objectExit)
    objectExit.geometry.dispose()
    objectExit.material.dispose()
    objects = objects.filter(object => object !== objectExit)
  }
  // if (objectExit) console.log(objectExit.remove());
  highlightMesh.material.color.setHex(0xFF0000);
  // const find=objects.find(targetMesh)

})

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//debugger 

// const cannonDebugger = new CannonDebugger(scene, world)

/**
 * Animate
 */







const clock = new THREE.Clock()
const dumpingFactor = 0.98
let throttle = 0.5
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  for (const object of objects) {
    object.position.y = .6 + Math.sin(elapsedTime) * .3
  }

  // phySphere.quaternion.setFromEuler(3, 0, 0)

  //key controls
  // console.log(camera.position);

  // camera.position.copy(new CANNON.Vec3(phyPlaneBody.x, phyPlaneBody.y, phyPlaneBody.z -= 50))
  // camera.quaternion.copy(phyPlaneBody.quaternion)



  camera.updateProjectionMatrix()
  // camera.lookAt(phyPlaneBody.position)
  // camera.position.z = 5
  // camera.position.z += 2


  // 









  // 


  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()


// live code :https://6614257e5b70ad03156553ba--curious-lollipop-baac61.netlify.app/