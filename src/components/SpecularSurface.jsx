import { useEffect, useRef } from 'react'
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'
import './SpecularSurface.css'

const PAD = 18

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = sdRoundedRect(p, uHalfSize, uRadius);
  vec2 lightDirection = vec2(cos(uAngle), sin(uAngle));
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.42;
  vec2 normal = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(normal, lightDirection)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float highlight = line * rim * edgeClamp * uIntensity;
  vec3 color = uBaseColor * base + uLineColor * highlight;
  fragColor = vec4(color, clamp(base + highlight, 0.0, 1.0));
}
`

function SpecularSurface({
  as: Element = 'div',
  children,
  className = '',
  radius = 0,
  lineColor = '#baff28',
  baseColor = '#54705f',
  intensity = 1.15,
  shineSize = 12,
  shineFade = 38,
  thickness = 1.15,
  speed = 0.28,
  proximity = 230,
  idleIntensity = 0.08,
  ...rest
}) {
  const surfaceRef = useRef(null)
  const effectRef = useRef(null)
  const configRef = useRef({})

  configRef.current = {
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    proximity,
    idleIntensity,
  }

  useEffect(() => {
    const surface = surfaceRef.current
    const effect = effectRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches

    if (!surface || !effect || reducedMotion || coarsePointer || !window.WebGL2RenderingContext) {
      surface?.classList.add('specular-surface--fallback')
      return undefined
    }

    let renderer
    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr, webgl: 2 })
      const gl = renderer.gl
      gl.clearColor(0, 0, 0, 0)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      const geometry = new Triangle(gl)
      if (geometry.attributes.uv) delete geometry.attributes.uv

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uCenter: { value: [0, 0] },
          uHalfSize: { value: [1, 1] },
          uRadius: { value: 0 },
          uAngle: { value: 2.4 },
          uPx: { value: dpr },
          uLineColor: { value: [1, 1, 1] },
          uBaseColor: { value: [0.3, 0.4, 0.34] },
          uIntensity: { value: 0 },
          uShineSize: { value: 0.2 },
          uShineFade: { value: 0.65 },
          uThickness: { value: 1 },
          uBaseWidth: { value: dpr },
        },
      })
      const mesh = new Mesh(gl, { geometry, program })
      effect.appendChild(gl.canvas)

      const dimensions = { width: 1, height: 1 }
      const resize = () => {
        const rect = surface.getBoundingClientRect()
        dimensions.width = rect.width
        dimensions.height = rect.height
        renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2)
        program.uniforms.uCenter.value = [(PAD + rect.width / 2) * dpr, (PAD + rect.height / 2) * dpr]
        program.uniforms.uHalfSize.value = [(rect.width / 2) * dpr, (rect.height / 2) * dpr]
      }
      const observer = new ResizeObserver(resize)
      observer.observe(surface)
      resize()

      let pointerAngle = 2.4
      let proximityValue = 0
      const moveLight = (event) => {
        const rect = surface.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right)
        const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom)
        const distance = Math.hypot(dx, dy)

        if (distance === 0) {
          const localX = (event.clientX - centerX) / Math.max(rect.width / 2, 1)
          const localY = (centerY - event.clientY) / Math.max(rect.height / 2, 1)
          pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + localX * 0.34 + localY * 0.18
        } else {
          pointerAngle = Math.atan2(centerY - event.clientY, event.clientX - centerX)
        }

        const amount = Math.max(0, 1 - distance / Math.max(configRef.current.proximity, 1))
        proximityValue = amount * amount * (3 - 2 * amount)
        surface.style.setProperty('--specular-x', `${event.clientX - rect.left}px`)
        surface.style.setProperty('--specular-y', `${event.clientY - rect.top}px`)
        surface.style.setProperty('--specular-opacity', proximityValue.toFixed(3))
      }
      window.addEventListener('pointermove', moveLight, { passive: true })

      let angle = 2.4
      let idleAngle = 2.4
      let brightness = 0
      let previousTime = performance.now()
      let frame = 0
      const line = new Color()
      const base = new Color()

      const render = (time) => {
        frame = requestAnimationFrame(render)
        const delta = Math.min((time - previousTime) / 1000, 0.05)
        previousTime = time
        const config = configRef.current
        idleAngle += config.speed * delta
        const target = proximityValue > 0 ? pointerAngle : idleAngle
        const difference = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
        angle += difference * (1 - Math.exp(-delta * 7))
        const targetBrightness = Math.max(proximityValue, config.idleIntensity)
        brightness += (targetBrightness - brightness) * (1 - Math.exp(-delta * 8))

        line.set(config.lineColor)
        base.set(config.baseColor)
        program.uniforms.uAngle.value = angle
        program.uniforms.uRadius.value = Math.min(config.radius, dimensions.width / 2, dimensions.height / 2) * dpr
        program.uniforms.uLineColor.value = [line.r, line.g, line.b]
        program.uniforms.uBaseColor.value = [base.r, base.g, base.b]
        program.uniforms.uIntensity.value = config.intensity * brightness
        program.uniforms.uShineSize.value = (config.shineSize * Math.PI) / 180
        program.uniforms.uShineFade.value = (config.shineFade * Math.PI) / 180
        program.uniforms.uThickness.value = config.thickness * dpr
        renderer.render({ scene: mesh })
      }
      frame = requestAnimationFrame(render)

      return () => {
        cancelAnimationFrame(frame)
        observer.disconnect()
        window.removeEventListener('pointermove', moveLight)
        surface.style.removeProperty('--specular-x')
        surface.style.removeProperty('--specular-y')
        surface.style.removeProperty('--specular-opacity')
        if (gl.canvas.parentNode === effect) effect.removeChild(gl.canvas)
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      }
    } catch {
      surface.classList.add('specular-surface--fallback')
      return undefined
    }
  }, [])

  return (
    <Element ref={surfaceRef} className={`specular-surface ${className}`.trim()} {...rest}>
      {children}
      <span ref={effectRef} className="specular-surface__effect" aria-hidden="true" />
    </Element>
  )
}

export default SpecularSurface
