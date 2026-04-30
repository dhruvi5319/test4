import { useState, useEffect } from 'react'

function computeLabel(updatedAt: number | undefined): string {
  if (updatedAt == null) return ''
  const elapsedMs = Date.now() - updatedAt
  const seconds = Math.floor(elapsedMs / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  return 'over an hour ago'
}

export function useDataFreshness(dataUpdatedAt: number | undefined): string {
  const [label, setLabel] = useState(() => computeLabel(dataUpdatedAt))

  useEffect(() => {
    setLabel(computeLabel(dataUpdatedAt))
    if (dataUpdatedAt == null) return
    const interval = setInterval(() => {
      setLabel(computeLabel(dataUpdatedAt))
    }, 60_000)
    return () => clearInterval(interval)
  }, [dataUpdatedAt])

  return label
}
