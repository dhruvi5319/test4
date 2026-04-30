import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyWeather, UnitSystem } from '../types/weather'
import { formatLocalDay, formatTemperature } from '../utils/formatters'

interface TemperatureTrendChartProps {
  data: DailyWeather[]
  timezone: string
  unit: UnitSystem
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

export default function TemperatureTrendChart({ data, timezone, unit }: TemperatureTrendChartProps) {
  const prefersReducedMotion = useReducedMotion()

  const chartData = data.map((day, i) => ({
    day: formatLocalDay(day.date, timezone, i),
    high: Math.round(day.tempMax),
    low: Math.round(day.tempMin),
  }))

  const unitLabel = unit === 'metric' ? '°C' : '°F'

  return (
    <div className="mt-4 bg-slate-800 rounded-2xl p-4">
      <h4 className="text-xs font-medium text-slate-400 mb-3">
        Temperature Trend ({unitLabel})
      </h4>

      {/* Accessible table for screen readers */}
      <table className="sr-only">
        <caption>7-day temperature trend</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">High ({unitLabel})</th>
            <th scope="col">Low ({unitLabel})</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map(row => (
            <tr key={row.day}>
              <th scope="row">{row.day}</th>
              <td>{row.high}</td>
              <td>{row.low}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Visual chart — hidden from screen readers via aria-hidden */}
      <div aria-hidden="true" style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}${unitLabel}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 8,
                color: '#f1f5f9',
                fontSize: 12,
              }}
              formatter={(value, name) => [
                formatTemperature(Number(value), unit),
                name === 'high' ? 'High' : 'Low',
              ]}
            />
            <Area
              type="monotone"
              dataKey="high"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#highGradient)"
              isAnimationActive={!prefersReducedMotion}
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#lowGradient)"
              isAnimationActive={!prefersReducedMotion}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
