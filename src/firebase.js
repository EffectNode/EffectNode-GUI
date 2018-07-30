import fire from 'firebase'

var config = {
  apiKey: 'AIzaSyB-tfIbfq6okbv1tYReo585t_r4zFvf-rI',
  authDomain: 'effectnode.firebaseapp.com',
  databaseURL: 'https://effectnode.firebaseio.com',
  projectId: 'effectnode',
  storageBucket: 'effectnode.appspot.com',
  messagingSenderId: '316567530740'
}

export const firebase = fire.initializeApp(config)
export const database = firebase.database()
export const storage = firebase.storage()

var googleLogin = new firebase.auth.GoogleAuthProvider()
googleLogin.addScope('https://www.googleapis.com/auth/contacts.readonly')

export const state = {
  user: false
}

export const loginGoogle = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().useDeviceLanguage()
    firebase.auth().signInWithPopup(googleLogin).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken
      // The signed-in user info.
      var user = result.user
      // ...
      state.user = user
      resolve(user)
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      // The email of the user's account used.
      var email = error.email
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential
      // ...

      console.table([
        errorCode, errorMessage, email, credential
      ])

      state.user = false
      reject(error)
    })
  })
}

var facebookLogin = new firebase.auth.FacebookAuthProvider()

export const loginFacebook = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().useDeviceLanguage()
    firebase.auth().signInWithPopup(facebookLogin).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken
      // The signed-in user info.
      var user = result.user
      // ...
      state.user = user
      resolve(user)
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      // The email of the user's account used.
      var email = error.email
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential
      // ...

      console.table([
        errorCode, errorMessage, email, credential
      ])

      state.user = false
      reject(error)
    })
  })
}

var githubLogin = new firebase.auth.FacebookAuthProvider()
export const loginGithub = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().useDeviceLanguage()
    firebase.auth().signInWithPopup(githubLogin).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken
      // The signed-in user info.
      var user = result.user
      // ...
      state.user = user
      resolve(user)
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      // The email of the user's account used.
      var email = error.email
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential
      // ...

      console.table([
        errorCode, errorMessage, email, credential
      ])

      state.user = false
      reject(error)
    })
  })
}

export const logout = () => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log('logout successfully')
    state.user = false
  }).catch((error) => {
    // An error happened.
    console.error(error)
    state.user = false
  })
}
