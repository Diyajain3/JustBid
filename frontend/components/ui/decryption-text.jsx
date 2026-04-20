import { useState, useEffect } from "react"

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@&%*+-"

export function DecryptionText({ text, speed = 40, delay = 0, className }) {
  const [displayText, setDisplayText] = useState("")
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    let timeout
    let iteration = 0
    let interval

    const startDecryption = () => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index]
              }
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("")
        )

        if (iteration >= text.length) {
          clearInterval(interval)
          setIsRevealed(true)
        }

        iteration += 1 / 3
      }, speed)
    }

    timeout = setTimeout(startDecryption, delay)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [text, speed, delay])

  return (
    <span className={className}>
      {displayText}
    </span>
  )
}
