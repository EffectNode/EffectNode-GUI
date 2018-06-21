import * as THREE from 'three'
import Worker from './EditPanel/dataMaker.worker'

export const makeBA = (config) => {
  return {
    label: 'position',
    ...config
  }
}

export const makeObject = () => {
  var item = {}
  var material = {
    transparent: true,
    depthTest: true,
    side: THREE.DoubleSide,
    uniformsInfo: [
      {
        uniform: 'pattern',
        data: {
          url: ''
        },
        type: 'THREE.Texture'
      },
      {
        uniform: 'time',
        type: 'time'
      },
      {
        uniform: 'opacity',
        type: 'slider'
      },
      {
        uniform: 'progress',
        type: 'tween',
        data: {
          start: 0,
          end: 1,
          time: 1000
        }
      },
      {
        uniform: 'mouse',
        type: 'mouse'
      }
    ],
    vertexShader: `
    varying vec3 vPos;
    uniform float time;

    void main (void) {
      vPos = position;
      vPos.x = vPos.x + sin(vPos.x + time);
      // vPos.y = vPos.y + cos(vPos.y + time);
      // vPos.z = vPos.z + tan(vPos.z + time);

      vec4 mvPosition = modelViewMatrix * vec4(vPos, 1.0);
      vec4 outputPos = projectionMatrix * mvPosition;
      gl_Position = outputPos;
      gl_PointSize = 1.0;
    }
    `,
    fragmentShader: `
    varying vec3 vPos;

    void main () {
      gl_FragColor = vec4(vec3(vPos), 1.0);
    }
    `
  }

  item.buffGeo = {
    maker: require('./EditPanel/makeSegments').makeSphere
  }
  item.material = material
  item.drawType = {
    type: 'Points'
  }
  return item
}

export const execGeoMaker = (geoMaker) => {
}

export const makeRoot = () => {
  let root = {
    now: {
      state: {
        objects: [
        ]
      }
    },
    backups: [
      {
        title: '',
        date: new Date(),
        nowJSON: ''
      }
    ]
  }
  let objs = root.now.state.objects
  objs.push(makeObject())

  return root
}

export const getObjectByIndex = (root, index) => {
  return root.now.state.objects[index]
}

export const runner = ({ formula = `return {}`, done = () => {}, isService = false }) => {
  var state = {
    worker: new Worker()
  }
  if (state.worker) {
    state.worker.terminate()
  }
  state.worker = new Worker()

  setTimeout(() => {
    state.worker.terminate()
    if (isService) {
      state.worker = new Worker()
    }
  }, 1000 * 120)

  state.worker.addEventListener('message', (evt) => {
    done(evt.data)
  })

  var api = {
    state,
    run () {
      state.worker.postMessage({ formula })
    }
  }
  return api
}

export const makeBuffGeo = ({ buffGeo }) => {
  return new Promise((resolve, reject) => {
    var geo = new THREE.BufferGeometry()

    var done = (data) => {
      data.BAs.forEach((ba) => {
        geo.addAttribute(ba.attribute, new THREE.BufferAttribute(new Float32Array(ba.array), ba.count))
      })

      resolve({
        geo,
        BAs: data.BAs
      })
    }
    var myRunner = runner({ formula: buffGeo.maker, done, isService: false })

    myRunner.run()
  })
}
