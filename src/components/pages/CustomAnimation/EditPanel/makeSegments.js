export const makeSphere = `let makeSphere = ({ radius, w, h }) => {
  var radius = radius || 100;

  var widthSegments = w || 50;
  var heightSegments = h || 50;

  var phiStart = 0;
  var phiLength = Math.PI * 2;

  var thetaStart = 0;
  var thetaLength = Math.PI;

  var thetaEnd = thetaStart + thetaLength;

  var ix, iy;

  var index = 0;
  var grid = [];

  var vertex = new THREE.Vector3();
  var normal = new THREE.Vector3();

  // buffers

  var indices = [];
  var vertices = [];
  var vertices2 = [];
  var normals = [];
  var indexes = [];
  var uvs = [];

  var rands = [];
  var gradients = [];

  var r = radius;

  var iii = 0;

  //*******START READING HERE*******
  // generate vertices, normals and uvs
  for ( iy = 0; iy <= heightSegments; iy ++ ) {
    var verticesRow = [];
    var v = iy / heightSegments;

    for ( ix = 0; ix <= widthSegments; ix ++ ) {
      var u = ix / widthSegments;

      var eee = iii / (heightSegments * widthSegments);

      // vertex
      vertex.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
      vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
      vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

      // normal
      normal.set( vertex.x, vertex.y, vertex.z ).normalize();
      // start dot
      normals.push( normal.x, normal.y, normal.z );
      // end dot
      normals.push( normal.x, normal.y, normal.z );

      // line dot 1
      vertices.push( vertex.x, vertex.y, vertex.z );
      // line dot 2
      vertices.push(
        normal.x * r * 1.0,
        normal.y * r * 1.0,
        normal.z * r * 1.0
      );

      // line dot 1
      vertices2.push( vertex.x, vertex.y, vertex.z );
      // line dot 2
      vertices2.push(
        normal.x * r * (1.5),
        normal.y * r * (1.5),
        normal.z * r * (1.5)
      );

      gradients.push(
        // start point
        0, 1
      )

      rands.push(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      )

      indexes.push(
        1 - v,
        1 - v
      )

      // uv
      // uvs.push( u, 1 - v );

      // verticesRow.push( index++ );

      iii++;

    }

    // grid.push( verticesRow );
  }

  let BAs = [
    {
      attribute: 'vertices',
      array: vertices,
      count: 3
    },
    {
      attribute: 'vertices2',
      array: vertices2,
      count: 3
    },
    {
      attribute: 'normals',
      array: normals,
      count: 3
    },
    {
      attribute: 'uvs',
      array: uvs,
      count: 2
    },
    {
      attribute: 'rands',
      array: rands,
      count: 1
    },
    {
      attribute: 'indexes',
      array: indexes,
      count: 1
    },
    {
      attribute: 'gradients',
      array: gradients,
      count: 1
    }
  ]

  return {
    BAs,
    radius,
    w,
    h,
    count: iii
  }
}

return makeSphere({ radius: 5, w: 5, h: 5 })
`
