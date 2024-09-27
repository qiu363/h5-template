<template>
  <section class="three-wrap">
    <div id="J_three" class="three-box"></div>
  </section>
</template>

<script lang="ts" name="Three" setup>
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  // import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
  import carModelConfig from '@/utils/dygl.config'
  import useCurrentInstance from '@/hooks/useCurrentInstance'

  const { global } = useCurrentInstance()

  let camera, scene, renderer, light

  const init = () => {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(1.5, 5.5, 13)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x8cc7de)

    // 添加光源
    light = new THREE[carModelConfig.lights[0].type](carModelConfig.lights[0])
    scene.add(light)

    let textureLoader = new THREE.TextureLoader()
    let texture = textureLoader.load('dm.jpg')
    // THREE.RepeatWrapping：平铺重复。
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    // 设置重复次数
    texture.repeat.set(100, 100)

    let geometry = new THREE.PlaneGeometry(15, 15, 16)
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide, // 两面都渲染
    })
    let plane = new THREE.Mesh(geometry, material)
    plane.rotateX(Math.PI / 2)
    scene.add(plane)

    // 环境
    // new RGBELoader().load(
    //   'https://mmk-sh.oss-cn-beijing.aliyuncs.com/guide/studio_001.hdr',
    //   function (hdr) {
    //     hdr.mapping = THREE.EquirectangularReflectionMapping

    //     scene.background = hdr
    //     scene.environment = hdr

    //     render()
    //   },
    // )

    new THREE.TextureLoader().load(
      './bg.jpg',
      function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture

        render()
      },
      function () {},
      function (error) {
        console.log(error)
      },
    )

    // 模型
    const loader = new GLTFLoader()
    loader.load(carModelConfig.models[0].name, function (gltf) {
      gltf.scene.scale.set(0.2, 0.2, 0.2)
      gltf.scene.position.set(0, 1, 0)

      scene.add(gltf.scene)

      render()
    })

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true
    document.querySelector('#J_three')?.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', render) // use if there is no animation loop
    // controls.minDistance = 5
    // controls.maxDistance = 6
    controls.target.set(0, 0.5, 0)

    // 上下旋转范围
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI * (85 / 180)
    controls.update()

    window.addEventListener('resize', onWindowResize)

    function onWindowResize() {
      if (window.innerWidth < window.innerHeight) {
        camera.aspect = window.innerHeight / window.innerWidth
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerHeight, window.innerWidth)
      } else {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      render()
    }
    onWindowResize()

    function render() {
      console.log(camera.position)
      renderer.render(scene, camera)
    }
  }

  const plusInit = () => {
    plus.navigator.setFullscreen(true)
  }

  onMounted(() => {
    init()

    global.$eventBus.on('plusReady', plusInit)
  })
</script>

<style lang="less" scoped>
  .three-wrap {
    width: 100vw;
    height: 100vh;
  }
  .three-box {
    height: 100vh;
    width: 100vw;
  }
  @media screen and (orientation: portrait) and (max-height: 672px),
    screen and (orientation: portrait) and (max-width: 672px) {
    .three-box {
      position: relative;
      left: 50%;
      top: 50%;
      height: 100vw;
      width: 100vh;
      margin: -50vw 0 0 -50vh;
      transform-origin: center;
      transform: rotate(90deg);
    }
  }
</style>
