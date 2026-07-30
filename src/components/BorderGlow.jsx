import { useCallback, useEffect, useMemo, useRef } from 'react'
import './BorderGlow.css'

const gradientPositions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
const gradientKeys = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven']
const colorMap = [0, 1, 2, 0, 1, 2, 1]

const parseHsl = (value) => {
  const match = value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  return match
    ? { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) }
    : { h: 84, s: 100, l: 58 }
}

const buildGlowVars = (glowColor, intensity) => {
  const { h, s, l } = parseHsl(glowColor)
  const opacities = [100, 60, 50, 40, 30, 20, 10]
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10']

  return Object.fromEntries(keys.map((key, index) => [
    `--glow-color${key}`,
    `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacities[index] * intensity, 100)}%)`,
  ]))
}

const buildGradientVars = (colors) => {
  const variables = Object.fromEntries(gradientKeys.map((key, index) => [
    key,
    `radial-gradient(at ${gradientPositions[index]}, ${colors[Math.min(colorMap[index], colors.length - 1)]} 0, transparent 50%)`,
  ]))
  variables['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`
  variables['--border-color-one'] = colors[0]
  variables['--border-color-two'] = colors[Math.min(1, colors.length - 1)]
  variables['--border-color-three'] = colors[Math.min(2, colors.length - 1)]
  return variables
}

function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '84 100 58',
  backgroundColor = '#10251a',
  borderRadius = 0,
  glowRadius = 32,
  glowIntensity = 0.72,
  coneSpread = 22,
  animated = false,
  colors = ['#baff28', '#dda85f', '#d7f5dc'],
  fillOpacity = 0.07,
}) {
  const cardRef = useRef(null)
  const gradientVars = useMemo(() => buildGradientVars(colors), [colors])
  const glowVars = useMemo(() => buildGlowVars(glowColor, glowIntensity), [glowColor, glowIntensity])

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const dx = x - centerX
    const dy = y - centerY
    const scaleX = dx === 0 ? Infinity : centerX / Math.abs(dx)
    const scaleY = dy === 0 ? Infinity : centerY / Math.abs(dy)
    const proximity = Math.min(Math.max(1 / Math.min(scaleX, scaleY), 0), 1)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
    if (angle < 0) angle += 360

    card.style.setProperty('--edge-proximity', (proximity * 100).toFixed(3))
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!animated || !card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    card.classList.add('border-glow-card--intro')
    const timer = window.setTimeout(() => card.classList.remove('border-glow-card--intro'), 2100)
    return () => window.clearTimeout(timer)
  }, [animated])

  return (
    <div
      ref={cardRef}
      className={`border-glow-card ${className}`.trim()}
      onPointerMove={handlePointerMove}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVars,
        ...gradientVars,
      }}
    >
      <span className="border-glow-card__edge" aria-hidden="true" />
      <div className="border-glow-card__inner">{children}</div>
    </div>
  )
}

export default BorderGlow
