import { useMemo } from 'react'
import './GradientText.css'

function GradientText({
  children,
  className = '',
  colors = ['#baff28', '#f4f7f2', '#dda85f'],
  animationSpeed = 8,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true,
  showBorder = false,
}) {
  const style = useMemo(() => {
    const angle = direction === 'vertical' ? 'to bottom' : direction === 'diagonal' ? 'to bottom right' : 'to right'
    const backgroundSize = direction === 'vertical' ? '100% 300%' : direction === 'diagonal' ? '300% 300%' : '300% 100%'
    return {
      '--gradient-text-image': `linear-gradient(${angle}, ${[...colors, colors[0]].join(', ')})`,
      '--gradient-text-size': backgroundSize,
      '--gradient-text-speed': `${animationSpeed}s`,
    }
  }, [animationSpeed, colors, direction])

  return (
    <span
      className={`gradient-text ${showBorder ? 'gradient-text--bordered' : ''} ${pauseOnHover ? 'gradient-text--pausable' : ''} ${yoyo ? 'gradient-text--yoyo' : ''} ${className}`.trim()}
      style={style}
    >
      <span className="gradient-text__content">{children}</span>
    </span>
  )
}

export default GradientText
