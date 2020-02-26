#ifdef GL_ES
precision mediump float;
#endif
// get our varyings
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
varying vec2 vTextureCoord0;
varying vec2 vTextureCoord1;
varying vec2 vActiveTextureCoord;
varying vec2 vNextTextureCoord;
// the uniform we declared inside our javascript
// uniform float uTime;
uniform float uProgress; 
// our texture sampler (default name, to use a different name please refer to the documentation)
uniform sampler2D uSampler0;
uniform sampler2D uSampler1;
uniform sampler2D activeTex;
uniform sampler2D nextTex;
void main() {
float p = fract(uProgress);
  // vec2 uvDivided = fract(vTextureCoord*vec2(intensity,1.));
	// 		vec2 uvDisplaced1 = newUV + rotate(3.1415926/4.)*uvDivided*progress*0.1;
	// 		vec2 uvDisplaced2 = newUV + rotate(3.1415926/4.)*uvDivided*(1. - progress)*0.1;
	// 		vec4 t1 = texture2D(texture1,uvDisplaced1);

  vec4 image1 = texture2D(activeTex, vActiveTextureCoord - fract(vActiveTextureCoord * vec2(11.,0.)) * p * 0.1);
  vec4 image2 = texture2D(nextTex, vNextTextureCoord - fract(vNextTextureCoord * vec2(11.,0.)) * (1. - p) * 0.1);
  gl_FragColor = mix(image1, image2, p);

  // gl_FragColor = texture2D(uSampler1,vTextureCoord1 - fract(vTextureCoord1 * vec2(115.,0.)) * uProgress * 0.1);

// gl_FragColor = texture2D(uSampler0, vTextureCoord0);
}