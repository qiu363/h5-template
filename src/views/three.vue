<template>
  <section class="three-wrap">
    <div id="J_three" class="three-box"></div>
  </section>
</template>

<script lang="ts" name="Three" setup>
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
  import carModelConfig from '@/utils/dygl.config'

  let camera, scene, renderer, light

  const init = () => {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(-9, 2.5, 4.5)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x8cc7de)

    // 添加光源
    light = new THREE[carModelConfig.lights[0].type](carModelConfig.lights[0])
    scene.add(light)

    // 环境贴图
    const cubesObj = {}
    const cubeLoader = new THREE.CubeTextureLoader().setPath('cube/')
    carModelConfig.cubes.map((item) => {
      cubesObj[item.name] = cubeLoader.load([
        item.name + '/PX.jpg',
        item.name + '/NX.jpg',
        item.name + '/PY.jpg',
        item.name + '/NY.jpg',
        item.name + '/PZ.jpg',
        item.name + '/NZ.jpg',
      ])
      cubesObj[item.name].encoding = THREE.sRGBEncoding
    })

    // 贴图
    const textureObj = {}
    const textureLoader = new THREE.TextureLoader().setPath('texture/')
    carModelConfig.textures.map((item) => {
      const texture = textureLoader.load(item.name, render)
      texture.encoding = THREE.sRGBEncoding
      texture.mapping = THREE.UVMapping
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.flipY = false
      texture.center = new THREE.Vector2(0.5, 0.5)
      texture.name = item.name
      if (item.repeat) {
        texture.repeat.set(item.repeat.x, item.repeat.y)
      }

      textureObj[item.name] = texture
    })

    // 处理纹理对象
    const materials = {}
    carModelConfig.materials.map((item) => {
      materials[item.name] = new THREE[item.type](item)

      if (item.envMap) {
        materials[item.name].envMap = cubesObj[item.envMap]
      }
      if (item.envMapIntensity) {
        materials[item.name].envMapIntensity = item.envMapIntensity
      }
      if (item.map) {
        materials[item.name].map = textureObj[item.map]
      }
      if (item.aoMap) {
        materials[item.name].aoMap = textureObj[item.aoMap]
      }
      if (item.alphaMap) {
        materials[item.name].alphaMap = textureObj[item.alphaMap]
      }
      if (item.specularMap) {
        materials[item.name].specularMap = textureObj[item.specularMap]
      }
      if (item.roughnessMap) {
        materials[item.name].roughnessMap = textureObj[item.roughnessMap]
      }
      if (item.normalMap) {
        materials[item.name].normalMap = textureObj[item.normalMap]
      }
      if (item.clearcoatNormalMap) {
        materials[item.name].clearcoatNormalMap = textureObj[item.clearcoatNormalMap]
      }
      if (item.normalScale) {
        materials[item.name].normalScale = new THREE.Vector2(item.normalScale.x, item.normalScale.y)
      }
    })
    const meshMap = {}
    carModelConfig.models[0].meshs.map((item) => {
      if (materials[item.material]) {
        meshMap[item.name] = {
          mesh: materials[item.material],
          ...item,
        }
      }
    })

    // 环境
    new RGBELoader().setPath('./').load('studio_001.hdr', function (hdr) {
      hdr.mapping = THREE.EquirectangularReflectionMapping

      scene.background = hdr
      scene.environment = hdr

      render()
    })

    // 模型
    const loader = new GLTFLoader().setPath('./')
    loader.load(carModelConfig.models[0].name, function (gltf) {
      gltf.scene.scale.set(1.0, 1.0, 1.0)
      console.log(gltf.scene.getObjectByName('02_car_glass'))

      // 设置车型颜色
      const color = carModelConfig.carpaints[1]
      // 设置配置
      const curPos = '600km四驱'
      const hup = 'hub_19'
      let curConfig = {} as any
      let curHup = {} as any
      carModelConfig.variants.map((item) => {
        if (item.name === curPos) {
          curConfig = item
        }
        if (item.name === hup) {
          curHup = item
        }
      })

      // 模型添加纹理
      gltf.scene.children.map((mesh) => {
        if (meshMap[mesh.name]) {
          const meshObj = mesh.getObjectByName(mesh.name)
          const curColor = color.materials.find((item) => item.mesh === mesh.name)
          const curMesh = curConfig.materials.find((item) => item.mesh === mesh.name)
          const curHu = curHup.materials.find((item) => item.mesh === mesh.name)
          if (curColor) {
            meshObj.material = materials[curColor.material]
          } else if (curMesh) {
            meshObj.material = materials[curMesh.material]
          } else if (curHu) {
            meshObj.material = materials[curHu.material]
          } else {
            meshObj.material = meshMap[mesh.name].mesh
          }
          meshObj.visible = meshMap[mesh.name].visible

          // 不同配置展示
          if (curConfig.visibles.includes(mesh.name)) {
            meshObj.visible = true
          }
          if (curConfig.invisible.includes(mesh.name)) {
            meshObj.visible = false
          }
          if (curHup.visibles.includes(mesh.name)) {
            meshObj.visible = true
          }
          if (curHup.invisible.includes(mesh.name)) {
            meshObj.visible = false
          }
        }
      })

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
    controls.minDistance = 5
    controls.maxDistance = 6
    controls.target.set(0, 0.5, 0)

    // 上下旋转范围
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI * (85 / 180)
    console.log(controls)
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
      renderer.render(scene, camera)
    }
  }

  onMounted(() => {
    init()
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
