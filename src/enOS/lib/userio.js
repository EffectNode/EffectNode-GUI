export default function makeIO ({ target, preventTouchStart }) {
  var container = target
  var ui = {
    disabled: false,
    deltaX: 0.1,
    deltaY: 0.1,
    deltaZ: 0.0,
    addon: 0.0016667,
    mass: 5.0,
    inertia: 1.0,
    dt: 0,
    inc: 0,
    aX: 0,
    aY: 0,
    aZ: 0,
    inX: 0,
    inY: 0,
    inZ: 0,

    _: {
      tsTheta: 0,
      tsX: 0,
      tsY: 0,
      tsZ: 0
    },

    isFocus: true,

    pX: 0,
    pY: 0,
    cX: 0,
    cY: 0,

    // angle
    deltaTheta: 0,
    aTheta: 0,
    inTheta: 0,

    useWheel: false,
    touches: 0
  }

  function onPointerMove (ppp) {
    ui.pX = ppp.clientX
    ui.pY = ppp.clientY
    ui.cX = (ui.pX / ui.conW) * 2 - 1
    ui.cY = (ui.pY / ui.conH) * 2 - 1

    if (ui.conW >= ui.conH) {
      let a = ui.conW / ui.conH
      ui.cX = ui.cX * a
      ui.cY = ui.cY
    } else {
      let a = ui.conH / ui.conW
      ui.cX = ui.cX
      ui.cY = ui.cY * a
    }
  }

  function sim (rAFT) {
    if (ui.disabled) { return }
    ui.dt = rAFT / 1000
    ui.inc += ui.addon
    if (ui.inertia > 0.01) {
      //
      ui.inX = (ui.deltaX * ui.inertia)
      ui.inY = (ui.deltaY * ui.inertia)
      ui.inZ = (ui.deltaY * ui.inertia)
      ui.aX += ui.inX
      ui.aY += ui.inZ
      ui.aZ += ui.inZ

      //
      ui.inTheta = ((ui.deltaTheta * ui.inertia) * 0.45)
      ui.aTheta += ui.inTheta

      // inertia
      ui.inertia *= 0.98
    }
  }
  function isDescendant (parent, child) {
    var node = child.parentNode
    if (parent === child) {
      return true
    }

    while (node !== null) {
      if (node === parent) {
        return true
      }
      node = node.parentNode
    }
    return false
  }

  function onWheel (evt) {
    if (ui.disabled) { return }
    // console.log(container)
    if (isDescendant(container, evt.target)) {
      evt.preventDefault()
    } else {
      return
    }

    // console.log(evt)

    if (evt.metaKey || evt.ctrlKey) {
      ui.deltaZ = -event.deltaY * 0.02
      ui.deltaX = 0
      ui.deltaY = 0
      ui.inX = 0
      ui.inY = 0
      ui.useWheel = true
      ui.inertia = ui.mass
      return
    }

    ui.deltaX = -event.deltaX * 0.02
    ui.deltaY = -event.deltaY * 0.02

    if (event.deltaX) {
      ui.deltaTheta = -event.deltaX * 0.02 / (Math.PI * 2)
    }
    if (event.deltaY) {
      ui.deltaTheta = -event.deltaY * 0.02 / (Math.PI * 2)
    }

    ui.useWheel = true

    // initia speed
    ui.inertia = ui.mass
  }

  function onThetaStart (t1) {
    var x = t1.clientX
    var y = t1.clientY
    var w = ui.conW
    var h = ui.conH
    var cX = (x - (w / 2)) / w
    var cY = (y - (h / 2)) / h
    var theta = Math.atan2(cY, cX)
    ui._.tsTheta = theta
  }
  function onThetaMove (t1) {
    var x = t1.clientX
    var y = t1.clientY
    var w = ui.conW
    var h = ui.conH
    var cX = (x - (w / 2)) / w
    var cY = (y - (h / 2)) / h
    var theta = Math.atan2(cY, cX)
    if (
      (ui._.tsTheta < 0 && theta > 0) ||
      (ui._.tsTheta > 0 && theta < 0)
    ) {
      ui._.tsTheta *= -1
    }

    // center
    ui.deltaTheta = (theta - ui._.tsTheta)
    ui._.tsTheta = theta
    ui.aTheta += ui.deltaTheta
  }

  function onResize () {
    ui.conW = container.clientWidth
    ui.conH = container.clientHeight
  }
  onResize()

  // pan around
  function onPanStart (t1) {
    // var t1 = touch[0]
    // var x = t1.pageX
    // var y = t1.pageY
    var x = t1.clientX
    var y = t1.clientY

    // ui.cX = (x / window.innerWidth) * 2 - 1
    // ui.cY = (y / window.innerHeight) * 2 - 1

    // var w = ui.conW
    // var h = ui.conH
    // var cX = (x - (w / 2)) / w
    // var cY = (y - (h / 2)) / h
    // var theta = Math.atan2(cY, cX)

    // pan
    ui._.tsX = x
    ui._.tsY = y

    // ui.inertia *= 0.05
    ui.isIn = true
  }

  function onPanMove (t1) {
    // var t1 = touch[0]
    // var x = t1.pageX
    // var y = t1.pageY
    var x = t1.clientX
    var y = t1.clientY

    // ui.cX = (x / window.innerWidth) * 2 - 1
    // ui.cY = (y / window.innerHeight) * 2 - 1

    //
    ui.deltaX = (x - ui._.tsX) * 0.05
    ui.deltaY = (y - ui._.tsY) * 0.05

    ui._.tsX = x
    ui._.tsY = y

    ui.aX += ui.deltaX
    ui.aY += ui.deltaY

    ui.inertia = ui.mass
  }

  function onPanEnd (t1) {
    ui.isIn = false
  }

  function onTS (evt) {
    if (ui.disabled) { return }
    // console.log(evt)
    // evt.target.style.outline = 'red solid 3px'
    if (preventTouchStart === true && evt.target === container) {
      evt.preventDefault()
    }
    var t = evt.touches
    if (t.length >= 1) {
      onPanStart(t[0])
      onThetaStart(t[0])
    }
    ui.touches = t.length
  }

  function onTM (evt) {
    if (ui.disabled) { return }
    evt.preventDefault()
    var t = evt.touches

    if (t.length >= 1) {
      onPanMove(t[0])
      onThetaMove(t[0])
      onPointerMove(t[0])
    }
  }
  function onTE (evt) {
    if (ui.disabled) { return }
    // evt.preventDefault()
    var t = evt.touches

    if (t.length === 1) {
      onPanEnd(t[0])
    }
    ui.touches = t.length
  }

  function onMM (evt) {
    if (ui.disabled) { return }
    onPointerMove(evt)
  }

  function onFocus () {
    ui.isFocus = true
  }
  function onBlur () {
    ui.isFocus = true
  }

  window.addEventListener('focus', onFocus, false)
  window.addEventListener('blur', onBlur, false)

  window.addEventListener('resize', onResize, false)

  container.addEventListener('mousemove', onMM, false)
  container.addEventListener('touchstart', onTS, false)
  container.addEventListener('touchmove', onTM, false)
  container.addEventListener('touchend', onTE, false)
  window.addEventListener('wheel', onWheel, false)
  function clean () {
    window.removeEventListener('focus', onFocus)
    window.removeEventListener('blur', onBlur)

    window.removeEventListener('resize', onResize)

    container.removeEventListener('mousemove', onMM)
    container.removeEventListener('touchstart', onTS)
    container.removeEventListener('touchmove', onTM)
    container.removeEventListener('touchend', onTE)
    window.removeEventListener('wheel', onWheel)
  }
  return {
    sim: sim,
    clean: clean,
    ui: ui
  }
}
