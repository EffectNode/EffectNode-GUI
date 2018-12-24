/* global env */
/* eslint-disable */
let {
  AppSignal,
  Resources,
  sockets,
  box,
  inputs,
  outputs
} = env
/* esltint-enable */
console.log('Environment is ready for you!::', env)

this.onReady = () => {
  console.log('onReady')



  let h = {
  	onColor: (degree) => {
      Resources.get('rootDOM')
        .style
        .background = `linear-gradient(45deg,
													hsl(${Math.floor(degree * 360)}, 50%, 50%),
													hsl(${Math.floor(Math.abs(1.0 - degree) * 360)}, 50%, 50%)
                      )`
    }
  }


  AppSignal.$on(inputs[0].id, () => {
  	h.onColor(Math.random())
  })
  AppSignal.$emit(outputs[0].id, Math.random())


  this.onClean = () => {
     Resources.get('rootDOM')
        .style
        .background = `none`
    console.log('onClean', box)
  }
}

