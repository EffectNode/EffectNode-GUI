import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyB-tfIbfq6okbv1tYReo585t_r4zFvf-rI',
  authDomain: 'effectnode.firebaseapp.com',
  databaseURL: 'https://effectnode.firebaseio.com',
  projectId: 'effectnode',
  storageBucket: 'effectnode.appspot.com',
  messagingSenderId: '316567530740'
}

export const fireapp = firebase.initializeApp(config)
export const db = firebase.database()
export const storage = firebase.storage()

export const state = {
  user: false // ,
  // _fu () {}// ,
  // set $forceUpdate (v) {
  //   v()
  //   state._fu = v
  //   setTimeout(() => {
  //     v()
  //   }, 100)
  // },
  // get $forceUpdate () {
  //   return state._fu
  // }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    state.user = user
  } else {
    state.user = false
  }
  console.log(state)
})

export const loginGoogle = () => {
  var googleLogin = new firebase.auth.GoogleAuthProvider()
  // googleLogin.addScope('https://www.googleapis.com/auth/contacts.readonly')
  return new Promise((resolve, reject) => {
    firebase.auth().useDeviceLanguage()
    firebase.auth().signInWithPopup(googleLogin).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken
      // The signed-in user info.
      var user = result.user
      state.user = user
      // ...
      resolve(user)
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      // The email of the user's account used.
      var email = error.email
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential

      state.user = false
      // ...

      console.table([
        errorCode, errorMessage, email, credential
      ])

      reject(error)
    })
  })
}

export const loginFacebook = () => {
  var facebookLogin = new firebase.auth.FacebookAuthProvider()
  return new Promise((resolve, reject) => {
    firebase.auth().useDeviceLanguage()
    firebase.auth().signInWithPopup(facebookLogin).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken
      // The signed-in user info.
      var user = result.user
      state.user = user
      // ...
      resolve(user)
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      // The email of the user's account used.
      var email = error.email
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential

      state.user = false
      // ...

      console.table([
        errorCode, errorMessage, email, credential
      ])

      reject(error)
    })
  })
}

export const loginGithub = () => {
  var githubLogin = new firebase.auth.GithubAuthProvider()
  return new Promise((resolve, reject) => {
    firebase.auth().useDeviceLanguage()
    firebase.auth().signInWithPopup(githubLogin).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken
      // The signed-in user info.
      var user = result.user
      state.user = user
      // ...
      resolve(user)
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      // The email of the user's account used.
      var email = error.email
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential

      state.user = false
      // ...

      console.table([
        errorCode, errorMessage, email, credential
      ])

      reject(error)
    })
  })
}

export const logout = () => {
  return firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log('logout successfully')
    state.user = false
  }).catch((error) => {
    // An error happened.
    console.error(error)
    state.user = false
  })
}

export const deployToWWW = ({ pid, html }) => {
  if (!state.user) {
    return Promise.reject(new Error('require uid'))
  }
  let htmlACL = db.ref(`/html-acl/${state.user.uid}/${pid}`)
  let htmlDB = db.ref(`/html-db/${state.user.uid}/${pid}`)

  return Promise.all([
    htmlACL.set(true),
    htmlDB.set(html)
  ])
}
