export default {
  CubeTexture: require('./System/CubeTexture.vue').default,
  CubeMapTarget: require('./System/CubeMapTarget.vue').default,
  Renderer: require('./System/Renderer.vue').default,
  Scene: require('./System/Scene.vue').default,
  PerspectiveCamera: require('./System/PerspectiveCamera.vue').default,
  CubeCamera: require('./System/CubeCamera.vue').default,
  // Refractor: require('./System/Refractor.vue').default,
  Raycaster: require('./System/Raycaster.vue').default,
  RenderTarget: require('./System/RenderTarget.vue').default,
  SVGLoader: require('./System/SVGLoader.vue').default,
  LayoutItem: require('./System/LayoutItem.vue').default,

  Object3D: require('./Element/Object3D.vue').default,
  LineSegments: require('./Element/LineSegments.vue').default,
  Mesh: require('./Element/Mesh.vue').default,
  Points: require('./Element/Points.vue').default,
  PointLight: require('./Element/PointLight.vue').default,
  SpotLight: require('./Element/SpotLight.vue').default,

  MeshLambertMaterial: require('./Material/MeshLambertMaterial.vue').default,
  MeshPhongMaterial: require('./Material/MeshPhongMaterial.vue').default,
  LineBasicMaterial: require('./Material/LineBasicMaterial.vue').default,
  ShaderMaterial: require('./Material/ShaderMaterial.vue').default,
  MeshBasicMaterial: require('./Material/MeshBasicMaterial.vue').default,
  PointsMaterial: require('./Material/PointsMaterial.vue').default,

  BufferGeometry: require('./Geo/BufferGeometry.vue').default,
  CircleBufferGeometry: require('./Geo/CircleBufferGeometry.vue').default,
  TorusKnotBufferGeometry: require('./Geo/TorusKnotBufferGeometry.vue').default,
  SphereBufferGeometry: require('./Geo/SphereBufferGeometry.vue').default,
  BoxBufferGeometry: require('./Geo/BoxBufferGeometry.vue').default,
  PlaneBufferGeometry: require('./Geo/PlaneBufferGeometry.vue').default,
  TorusBufferGeometry: require('./Geo/TorusBufferGeometry.vue').default,

  dummy: {}
}
