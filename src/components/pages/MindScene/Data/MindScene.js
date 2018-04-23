import * as EN from '../../HeartSpace/EffectNodeCore'

export const makeRandomID = () => {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

/* root */
export const makeRoot = () => {
  return {
    version: 0.1,
    state: {
    },
    backups: []
  }
}

export const makeWords = () => {
  return [
  ]
}

/* words */
export const makeOneWord = () => {
  return {
    id: makeRandomID(),
    arr: 'words',
    transparent: true,
    text: '',
    wordwrap: 300,
    pos: { x: 0, y: 0, z: 0 },
    effect: EN.makeWordTemplate({})
  }
}

export const makeDemoRoot = () => {
  let root = makeRoot()

  root.state.words = makeWords()

  // 1st
  root.state.words[0] = makeOneWord()
  root.state.words[0].text = 'LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK LOK '
  root.state.words[0].pos = { x: -10, y: 0, z: 0 }

  // 2nd
  root.state.words[1] = makeOneWord()
  root.state.words[1].text = 'BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO BO  '
  root.state.words[1].pos = { x: 10, y: 0, z: 0 }

  return root
}
