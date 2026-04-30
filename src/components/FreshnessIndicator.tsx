import { useDataFreshness } from '../hooks/useDataFreshness'

interface FreshnessIndicatorProps {
  dataUpdatedAt: number | undefined
}

export default function FreshnessIndicator({ dataUpdatedAt }: FreshnessIndicatorProps) {
  const label = useDataFreshness(dataUpdatedAt)
  if (!label) return null

  return (
    <p className="text-xs text-slate-500 text-right" aria-live="polite">
      Updated {label}
    </p>
  )
}
