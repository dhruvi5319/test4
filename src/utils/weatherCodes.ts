export interface WeatherCondition {
  label: string
  iconDay: string    // lucide-react icon name for daytime
  iconNight: string  // lucide-react icon name for nighttime
  backgroundClass: string      // daytime gradient (WCAG-validated dark-text or white-text safe)
  backgroundClassNight: string // nighttime gradient (deep dark, white text safe)
}

export const WMO_CONDITIONS: Record<number, WeatherCondition> = {
  // Clear — daytime: sky blue; nighttime: deep navy
  0:  { label: 'Clear sky',              iconDay: 'Sun',             iconNight: 'Moon',             backgroundClass: 'from-sky-500 to-blue-600',    backgroundClassNight: 'from-slate-800 to-blue-950' },
  1:  { label: 'Mainly clear',           iconDay: 'Sun',             iconNight: 'Moon',             backgroundClass: 'from-sky-500 to-blue-600',    backgroundClassNight: 'from-slate-800 to-blue-950' },
  // Partly cloudy
  2:  { label: 'Partly cloudy',          iconDay: 'CloudSun',        iconNight: 'CloudMoon',        backgroundClass: 'from-sky-600 to-slate-500',   backgroundClassNight: 'from-slate-700 to-slate-900' },
  // Overcast
  3:  { label: 'Overcast',               iconDay: 'Cloud',           iconNight: 'Cloud',            backgroundClass: 'from-slate-600 to-slate-700', backgroundClassNight: 'from-slate-700 to-slate-900' },
  // Fog
  45: { label: 'Fog',                    iconDay: 'CloudFog',        iconNight: 'CloudFog',         backgroundClass: 'from-slate-500 to-slate-600', backgroundClassNight: 'from-slate-700 to-slate-800' },
  48: { label: 'Icy fog',                iconDay: 'CloudFog',        iconNight: 'CloudFog',         backgroundClass: 'from-slate-500 to-slate-600', backgroundClassNight: 'from-slate-700 to-slate-800' },
  // Drizzle
  51: { label: 'Light drizzle',          iconDay: 'CloudDrizzle',    iconNight: 'CloudDrizzle',     backgroundClass: 'from-slate-600 to-blue-700',  backgroundClassNight: 'from-slate-700 to-blue-900' },
  53: { label: 'Moderate drizzle',       iconDay: 'CloudDrizzle',    iconNight: 'CloudDrizzle',     backgroundClass: 'from-slate-600 to-blue-700',  backgroundClassNight: 'from-slate-700 to-blue-900' },
  55: { label: 'Heavy drizzle',          iconDay: 'CloudDrizzle',    iconNight: 'CloudDrizzle',     backgroundClass: 'from-slate-700 to-blue-800',  backgroundClassNight: 'from-slate-800 to-blue-950' },
  // Freezing drizzle
  56: { label: 'Light freezing drizzle', iconDay: 'CloudHail',       iconNight: 'CloudHail',        backgroundClass: 'from-slate-600 to-blue-700',  backgroundClassNight: 'from-slate-700 to-blue-900' },
  57: { label: 'Heavy freezing drizzle', iconDay: 'CloudHail',       iconNight: 'CloudHail',        backgroundClass: 'from-slate-700 to-blue-800',  backgroundClassNight: 'from-slate-800 to-blue-950' },
  // Rain
  61: { label: 'Light rain',             iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-600 to-blue-800',  backgroundClassNight: 'from-slate-800 to-blue-950' },
  63: { label: 'Moderate rain',          iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-700 to-blue-900',  backgroundClassNight: 'from-slate-800 to-blue-950' },
  65: { label: 'Heavy rain',             iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-700 to-blue-900',  backgroundClassNight: 'from-slate-900 to-blue-950' },
  // Freezing rain
  66: { label: 'Light freezing rain',    iconDay: 'CloudHail',       iconNight: 'CloudHail',        backgroundClass: 'from-slate-600 to-blue-800',  backgroundClassNight: 'from-slate-800 to-blue-950' },
  67: { label: 'Heavy freezing rain',    iconDay: 'CloudHail',       iconNight: 'CloudHail',        backgroundClass: 'from-slate-700 to-blue-900',  backgroundClassNight: 'from-slate-900 to-blue-950' },
  // Snow — WCAG-safe: darkened from original slate-200 (too light for white text)
  71: { label: 'Light snow',             iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-500 to-blue-600',  backgroundClassNight: 'from-slate-700 to-blue-900' },
  73: { label: 'Moderate snow',          iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-500 to-blue-600',  backgroundClassNight: 'from-slate-700 to-blue-900' },
  75: { label: 'Heavy snow',             iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-500 to-blue-700',  backgroundClassNight: 'from-slate-700 to-blue-900' },
  77: { label: 'Snow grains',            iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-500 to-blue-600',  backgroundClassNight: 'from-slate-700 to-blue-900' },
  // Rain showers
  80: { label: 'Light showers',          iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-600 to-blue-800',  backgroundClassNight: 'from-slate-800 to-blue-950' },
  81: { label: 'Moderate showers',       iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-700 to-blue-900',  backgroundClassNight: 'from-slate-800 to-blue-950' },
  82: { label: 'Violent showers',        iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-700 to-blue-900',  backgroundClassNight: 'from-slate-900 to-blue-950' },
  // Snow showers
  85: { label: 'Light snow showers',     iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-500 to-blue-600',  backgroundClassNight: 'from-slate-700 to-blue-900' },
  86: { label: 'Heavy snow showers',     iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-500 to-blue-700',  backgroundClassNight: 'from-slate-700 to-blue-900' },
  // Thunderstorm
  95: { label: 'Thunderstorm',           iconDay: 'CloudLightning',  iconNight: 'CloudLightning',   backgroundClass: 'from-slate-700 to-slate-900', backgroundClassNight: 'from-slate-800 to-slate-950' },
  96: { label: 'Thunderstorm w/ hail',   iconDay: 'CloudLightning',  iconNight: 'CloudLightning',   backgroundClass: 'from-slate-700 to-slate-900', backgroundClassNight: 'from-slate-800 to-slate-950' },
  99: { label: 'Thunderstorm w/ hail',   iconDay: 'CloudLightning',  iconNight: 'CloudLightning',   backgroundClass: 'from-slate-700 to-slate-900', backgroundClassNight: 'from-slate-800 to-slate-950' },
}

export function getWeatherCondition(code: number): WeatherCondition {
  return WMO_CONDITIONS[code] ?? {
    label: 'Unknown',
    iconDay: 'Cloud',
    iconNight: 'Cloud',
    backgroundClass: 'from-slate-600 to-slate-700',
    backgroundClassNight: 'from-slate-800 to-slate-900',
  }
}
