import { useEffect, useId, useMemo, useRef, useState } from 'react'
import './CurvedInput.css'

const palettes = {
  dark: {
    background: '#10251a',
    text: '#f4f7f2',
    placeholder: '#93a097',
    border: '#4b6757',
    button: '#baff28',
    buttonText: '#102117',
    shadow: 'rgba(0,0,0,.38)',
  },
  light: {
    background: '#edf1ed',
    text: '#152019',
    placeholder: '#768079',
    border: '#65806e',
    button: '#65aa28',
    buttonText: '#ffffff',
    shadow: 'rgba(3,18,10,.2)',
  },
}

const curveY = (x, width, bend, edgeY) => {
  const t = x / Math.max(width, 1)
  return edgeY - 4 * bend * t * (1 - t)
}

const curvePath = (x0, x1, width, bend, edgeY) => {
  const midpoint = (x0 + x1) / 2
  const y0 = curveY(x0, width, bend, edgeY)
  const y1 = curveY(x1, width, bend, edgeY)
  const ym = curveY(midpoint, width, bend, edgeY)
  const controlY = 2 * ym - (y0 + y1) / 2
  return `M ${x0} ${y0} Q ${midpoint} ${controlY} ${x1} ${y1}`
}

function CurvedInput({
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  placeholder = 'Enter your email',
  buttonText = 'Get Started',
  type = 'email',
  name,
  ariaLabel,
  theme = 'dark',
  width = 450,
  bend = 28,
  height = 64,
  cornerRadius = 18,
  borderWidth = 1.5,
  fontSize = 16,
  backgroundColor,
  textColor,
  placeholderColor,
  borderColor,
  buttonColor,
  buttonTextColor,
  shadowSize = 'md',
  showButton = true,
  showIcon = true,
  className = '',
}) {
  const pathId = useId().replace(/:/g, '')
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const [measuredWidth, setMeasuredWidth] = useState(typeof width === 'number' ? width : 450)
  const [innerValue, setInnerValue] = useState(defaultValue)
  const [focused, setFocused] = useState(false)
  const currentValue = value === undefined ? innerValue : value
  const palette = palettes[theme] || palettes.dark

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect?.width) setMeasuredWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const geometry = useMemo(() => {
    const w = Math.max(measuredWidth, 280)
    const safeBend = Math.max(-w * 0.16, Math.min(bend, w * 0.16))
    const pad = Math.abs(safeBend) + 12
    const edgeY = 8 + Math.max(safeBend, 0)
    const bottomEdgeY = edgeY + height
    const topPath = curvePath(cornerRadius, w - cornerRadius, w, safeBend, edgeY)
    const bottomPath = curvePath(cornerRadius, w - cornerRadius, w, safeBend, bottomEdgeY)
    const bandPath = `${topPath} Q ${w} ${curveY(w, w, safeBend, edgeY)} ${w} ${curveY(w, w, safeBend, edgeY) + cornerRadius} L ${w} ${curveY(w, w, safeBend, bottomEdgeY) - cornerRadius} Q ${w} ${curveY(w, w, safeBend, bottomEdgeY)} ${w - cornerRadius} ${curveY(w - cornerRadius, w, safeBend, bottomEdgeY)} ${bottomPath.replace(/^M [^Q]+Q /, 'Q ')} Q 0 ${curveY(0, w, safeBend, bottomEdgeY)} 0 ${curveY(0, w, safeBend, bottomEdgeY) - cornerRadius} L 0 ${curveY(0, w, safeBend, edgeY) + cornerRadius} Q 0 ${curveY(0, w, safeBend, edgeY)} ${cornerRadius} ${curveY(cornerRadius, w, safeBend, edgeY)} Z`
    const buttonWidth = showButton ? Math.max(132, buttonText.length * fontSize + 48) : 0
    const buttonStart = w - buttonWidth
    const textStart = showIcon ? 66 : 26
    const textEnd = showButton ? buttonStart - 20 : w - 24
    const textEdge = edgeY + height / 2 + fontSize * 0.34
    const textPath = curvePath(textStart, Math.max(textStart + 30, textEnd), w, safeBend, textEdge)
    const buttonTextPath = curvePath(buttonStart + 18, w - 18, w, safeBend, textEdge)
    const iconX = 34
    const iconY = curveY(iconX, w, safeBend, edgeY + height / 2)
    const caretX = Math.min(textEnd, textStart + Math.max(currentValue.length, 1) * fontSize * 0.58)
    const caretY = curveY(caretX, w, safeBend, textEdge - fontSize * 0.34)
    return { w, pad, edgeY, bandPath, buttonStart, textPath, buttonTextPath, iconX, iconY, caretX, caretY, svgHeight: height + pad + 18 }
  }, [bend, buttonText, cornerRadius, currentValue.length, fontSize, height, measuredWidth, showButton, showIcon])

  const submit = (event) => {
    event?.preventDefault?.()
    onSubmit?.(currentValue)
  }

  const updateValue = (event) => {
    const nextValue = event.target.value
    if (value === undefined) setInnerValue(nextValue)
    onChange?.(nextValue)
  }

  const shadowStrength = shadowSize === 'none' ? 'none' : shadowSize === 'lg' ? `0 22px 48px ${palette.shadow}` : shadowSize === 'sm' ? `0 6px 16px ${palette.shadow}` : `0 12px 28px ${palette.shadow}`

  return (
    <form
      ref={rootRef}
      className={`curved-input ${focused ? 'curved-input--focused' : ''} ${className}`.trim()}
      style={{ width: typeof width === 'number' ? `${width}px` : width, '--curved-shadow': shadowStrength }}
      onSubmit={submit}
    >
      <svg
        className="curved-input__svg"
        viewBox={`0 0 ${geometry.w} ${geometry.svgHeight}`}
        role="presentation"
        onClick={() => inputRef.current?.focus()}
      >
        <defs>
          <path id={`curved-text-${pathId}`} d={geometry.textPath} />
          <path id={`curved-button-${pathId}`} d={geometry.buttonTextPath} />
          <clipPath id={`curved-button-clip-${pathId}`}>
            <rect x={geometry.buttonStart} y="0" width={geometry.w - geometry.buttonStart + 2} height={geometry.svgHeight} rx={cornerRadius} />
          </clipPath>
        </defs>

        <path
          className="curved-input__focus-ring"
          d={geometry.bandPath}
          fill="none"
          stroke={buttonColor || palette.button}
          strokeWidth={borderWidth + 7}
        />
        <path
          d={geometry.bandPath}
          fill={backgroundColor || palette.background}
          stroke={borderColor || palette.border}
          strokeWidth={borderWidth}
        />
        {showButton && (
          <path
            className="curved-input__button-fill"
            d={geometry.bandPath}
            fill={buttonColor || palette.button}
            clipPath={`url(#curved-button-clip-${pathId})`}
          />
        )}

        {showIcon && (
          <g className="curved-input__icon" transform={`translate(${geometry.iconX} ${geometry.iconY})`} aria-hidden="true">
            <rect x="-15" y="-12" width="30" height="24" rx="7" fill={buttonColor || palette.button} />
            <path d="M -8 -4 L 0 2 L 8 -4 M -8 6 L -2 1 M 8 6 L 2 1" fill="none" stroke={buttonTextColor || palette.buttonText} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        <text className="curved-input__text" fill={currentValue ? (textColor || palette.text) : (placeholderColor || palette.placeholder)} style={{ fontSize }}>
          <textPath href={`#curved-text-${pathId}`}>{currentValue || placeholder}</textPath>
        </text>

        {focused && (
          <line className="curved-input__caret" x1={geometry.caretX} x2={geometry.caretX} y1={geometry.caretY - fontSize * .7} y2={geometry.caretY + fontSize * .7} stroke={textColor || palette.text} strokeWidth="1.5" />
        )}

        {showButton && (
          <g
            className="curved-input__button"
            role="button"
            tabIndex="0"
            aria-label={buttonText}
            onClick={(event) => {
              event.stopPropagation()
              submit(event)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') submit(event)
            }}
          >
            <text fill={buttonTextColor || palette.buttonText} textAnchor="middle" style={{ fontSize, fontWeight: 700 }}>
              <textPath href={`#curved-button-${pathId}`} startOffset="50%">{buttonText}</textPath>
            </text>
          </g>
        )}
      </svg>
      <input
        ref={inputRef}
        className="curved-input__field"
        type={type}
        name={name}
        value={currentValue}
        onChange={updateValue}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={ariaLabel || placeholder}
        autoComplete="off"
      />
    </form>
  )
}

export default CurvedInput
