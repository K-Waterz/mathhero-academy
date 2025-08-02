'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

interface Bubble {
  id: number
  x: number
  y: number
  value: number
  popped: boolean
}

export default function AdditionBubblePopper() {
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState({ a: 0, b: 0, answer: 0 })
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [timer, setTimer] = useState(30)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startGame()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function startGame() {
    setScore(0)
    setGameOver(false)
    setTimer(30)
    nextQuestion()
    spawnBubbles()
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setGameOver(true)
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  function nextQuestion() {
    const a = getRandomInt(1, 9)
    const b = getRandomInt(1, 9)
    setQuestion({ a, b, answer: a + b })
  }

  function spawnBubbles() {
    const correct = question.a + question.b
    const bubbleValues = [correct]
    while (bubbleValues.length < 5) {
      const val = getRandomInt(2, 18)
      if (!bubbleValues.includes(val)) bubbleValues.push(val)
    }
    const shuffled = bubbleValues.sort(() => Math.random() - 0.5)
    setBubbles(
      shuffled.map((value, i) => ({
        id: i,
        x: getRandomInt(20, 280),
        y: getRandomInt(60, 180),
        value,
        popped: false
      }))
    )
  }

  function handlePop(bubble: Bubble) {
    if (gameOver || bubble.popped) return
    if (bubble.value === question.answer) {
      setScore(s => s + 10)
      // Play correct sound (placeholder)
      setBubbles(bs => bs.map(b => b.id === bubble.id ? { ...b, popped: true } : b))
      setTimeout(() => {
        nextQuestion()
        spawnBubbles()
      }, 500)
    } else {
      // Play wrong sound (placeholder)
      setScore(s => (s > 0 ? s - 2 : 0))
      setBubbles(bs => bs.map(b => b.id === bubble.id ? { ...b, popped: true } : b))
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-yellow-50">
      <div className="max-w-md w-full card p-8 text-center">
        <h1 className="text-2xl font-bold mb-2 text-primary-600">Addition Bubble Popper</h1>
        <p className="mb-4 text-gray-600">Pop the bubble with the correct answer!</p>
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Score: {score}</span>
          <span className="font-semibold">Time: {timer}s</span>
        </div>
        <div className="mb-6 text-lg font-semibold">
          {question.a} + {question.b} = ?
        </div>
        <svg width={320} height={220} className="mx-auto mb-4">
          {bubbles.map(bubble => (
            <motion.g
              key={bubble.id}
              initial={{ scale: 0 }}
              animate={{ scale: bubble.popped ? 0 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ cursor: bubble.popped ? 'default' : 'pointer' }}
              onClick={() => handlePop(bubble)}
            >
              <circle
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.popped ? 0 : 32}
                fill={bubble.popped ? '#facc15' : '#0070f3'}
                stroke="#1f2937"
                strokeWidth={3}
              />
              <text
                x={bubble.x}
                y={bubble.y + 8}
                textAnchor="middle"
                fontSize="24"
                fill="#fff"
                fontWeight="bold"
              >
                {bubble.value}
              </text>
            </motion.g>
          ))}
        </svg>
        {gameOver ? (
          <div className="mt-6">
            <div className="text-xl font-bold text-red-500 mb-2">Game Over!</div>
            <div className="mb-4">Your score: <span className="font-bold">{score}</span></div>
            <button className="btn-primary" onClick={startGame}>Play Again</button>
          </div>
        ) : null}
      </div>
    </div>
  )
}