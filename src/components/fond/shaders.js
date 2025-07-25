export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fluidShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec4 iMouse;
  uniform int iFrame;
  uniform sampler2D iPreviousFrame;
  uniform float uBrushSize;
  uniform float uBrushStrength;
  uniform float uFluidDecay;
  uniform float uTrailLength;
  uniform float uStopDecay;
  varying vec2 vUv;
  
  // Fonction de hash pour générer des nombres pseudo-aléatoires
  float hash(float n) {
    return fract(sin(n) * 43758.5453);
  }
  
  vec2 randomPosition(float seed, float zone) {
    float x, y;
    
    if (zone == 0.0) {
      // Zone gauche (20% à 35% de l'écran)
      x = hash(seed) * 0.15 + 0.2;
    } else if (zone == 1.0) {
      // Zone centre (40% à 60% de l'écran)
      x = hash(seed) * 0.2 + 0.4;
    } else {
      // Zone droite (65% à 80% de l'écran)
      x = hash(seed) * 0.15 + 0.65;
    }
    
    // Position Y aléatoire entre 20% et 80%
    y = hash(seed + 1.0) * 0.6 + 0.2;
    
    return vec2(x, y);
  }
  
  void main() {
    vec2 U = vUv * iResolution;
    
    // Positions aléatoires dans 3 zones fixes (gauche, centre, droite)
    vec2 basePos1 = iResolution * randomPosition(1.0, 0.0); // Zone gauche
    vec2 basePos2 = iResolution * randomPosition(2.0, 1.0); // Zone centre
    vec2 basePos3 = iResolution * randomPosition(3.0, 2.0); // Zone droite
    
    // Position des 3 cercles avec mouvement très large et plus lent
    vec2 center1 = basePos1 + vec2(sin(iTime * 0.2) * 300.0, cos(iTime * 0.15) * 250.0);
    vec2 center2 = basePos2 + vec2(cos(iTime * 0.18) * 350.0, sin(iTime * 0.25) * 280.0);
    vec2 center3 = basePos3 + vec2(sin(iTime * 0.12) * 320.0, cos(iTime * 0.22) * 270.0);
    
    // Rayon des cercles (plus gros)
    float radius1 = 200.0;
    float radius2 = 250.0;
    float radius3 = 180.0;
    
    // Distance aux centres
    float dist1 = length(U - center1);
    float dist2 = length(U - center2);
    float dist3 = length(U - center3);
    
    // Intensité des cercles (plus proche du centre = plus intense)
    float intensity1 = max(0.0, 1.0 - dist1 / radius1);
    float intensity2 = max(0.0, 1.0 - dist2 / radius2);
    float intensity3 = max(0.0, 1.0 - dist3 / radius3);
    
    // Lissage des bords
    intensity1 = smoothstep(0.0, 1.0, intensity1);
    intensity2 = smoothstep(0.0, 1.0, intensity2);
    intensity3 = smoothstep(0.0, 1.0, intensity3);
    
    // Combinaison des trois cercles
    float totalIntensity = max(max(intensity1, intensity2), intensity3);
    
    // Créer un vecteur de mouvement basé sur l'intensité
    vec2 movement = vec2(totalIntensity * 0.1, totalIntensity * 0.1);
    
    gl_FragColor = vec4(movement, totalIntensity, 1.0);
  }
`;

export const displayShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform sampler2D iFluid;
  uniform float uDistortionAmount;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uColorIntensity;
  uniform float uSoftness;
  varying vec2 vUv;
  
  void main() {
    vec2 fragCoord = vUv * iResolution;
    
    vec4 fluid = texture2D(iFluid, vUv);
    float circleIntensity = fluid.z; // Intensité des cercles
    // Fond plus clair avec mélange de couleurs
    vec3 backgroundColor = mix(uColor1 * 0.8, uColor2 * 0.4, 0.3);
   
    // Couleur des cercles (principalement color2)
    vec3 circleColor = uColor2;
    
    // Mélange entre fond et cercles
    vec3 finalColor = mix(backgroundColor, circleColor, circleIntensity);
    
    // Appliquer l'intensité globale
    finalColor *= uColorIntensity;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
