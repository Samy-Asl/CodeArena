import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let mouse = { x: -999, y: -999 }

    const COLORS = ['#7C3AED', '#22D3EE', '#EC4899']
    const COUNT = 100

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    function onMouseMove(e) { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMouseMove)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        // Repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.8
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
        p.vx *= 0.98; p.vy *= 0.98
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + 'cc'
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d2 = Math.hypot(p.x - q.x, p.y - q.y)
          if (d2 < 140) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = p.color + Math.floor((1 - d2 / 140) * 80).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-canvas" />
}
