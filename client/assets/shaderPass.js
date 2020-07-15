export const vertexPass = `
precision mediump float;
// those are the mandatory attributes that the lib sets
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
// pass your vertex and texture coords to the fragment shader
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
void main() {
gl_Position = vec4(aVertexPosition, 1.0);
// set the varyings
// use our aTextureCoord attributes as texture coords in our fragment shader
vTextureCoord = aTextureCoord;
vVertexPosition = aVertexPosition;
}
`

export const fragmentPass = `
precision mediump float;
// get our varyings
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
// our render texture
uniform sampler2D uRenderTexture;
void main() {
// display our render texture, which contains our shader pass frame buffer object content
gl_FragColor = texture2D(uRenderTexture, vTextureCoord);
}
`

const backgroundCoverUv = `
vec2 backgroundCoverUv(vec2 screenSize, vec2 imageSize, vec2 uv) {
  float screenRatio = screenSize.x / screenSize.y;
  float imageRatio = imageSize.x / imageSize.y;

  vec2 newSize = screenRatio < imageRatio 
      ? vec2(imageSize.x * screenSize.y / imageSize.y, screenSize.y)
      : vec2(screenSize.x, imageSize.y * screenSize.x / imageSize.x);

  vec2 newOffset = (screenRatio < imageRatio 
      ? vec2((newSize.x - screenSize.x) / 2.0, 0.0) 
      : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;

  return uv * screenSize / newSize + newOffset;
}
`

const vertexShader = `
precision mediump float;

uniform float uVelo;

varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795

void main(){
  vec3 pos = position;
  pos.x = pos.x + ((sin(uv.y * M_PI) * uVelo) * 0.125);

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
}
`

const fragmentShader = `
precision mediump float;

${backgroundCoverUv}

uniform sampler2D uTexture;

uniform vec2 uMeshSize;
uniform vec2 uImageSize;

uniform float uVelo;
uniform float uScale;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  vec2 texCenter = vec2(0.5);
  vec2 texUv = backgroundCoverUv(uMeshSize, uImageSize, uv);
  vec2 texScale = (texUv - texCenter) * uScale + texCenter;
  vec4 texture = texture2D(uTexture, texScale);

  texScale.x += 0.15 * uVelo;
  if(uv.x < 1.) texture.g = texture2D(uTexture, texScale).g;

  texScale.x += 0.10 * uVelo;
  if(uv.x < 1.) texture.b = texture2D(uTexture, texScale).b;

  gl_FragColor = texture;
}
`
