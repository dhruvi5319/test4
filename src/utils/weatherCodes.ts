export interface WeatherCondition {
  label: string
  iconDay: string    // lucide-react icon name for daytime
  iconNight: string  // lucide-react icon name for nighttime
  backgroundClass: string
}

export const WMO_CONDITIONS: Record<number, WeatherCondition> = {
  // Clear
  0:  { label: 'Clear sky',              iconDay: 'Sun',             iconNight: 'Moon',             backgroundClass: 'from-sky-400 to-blue-500' },
  // Mainly clear / partly cloudy / overcast
  1:  { label: 'Mainly clear',           iconDay: 'Sun',             iconNight: 'Moon',             backgroundClass: 'from-sky-300 to-blue-400' },
  2:  { label: 'Partly cloudy',          iconDay: 'CloudSun',        iconNight: 'CloudMoon',        backgroundClass: 'from-slate-300 to-sky-400' },
  3:  { label: 'Overcast',               iconDay: 'Cloud',           iconNight: 'Cloud',            backgroundClass: 'from-slate-400 to-slate-500' },
  // Fog
  45: { label: 'Fog',                    iconDay: 'CloudFog',        iconNight: 'CloudFog',         backgroundClass: 'from-slate-300 to-slate-400' },
  48: { label: 'Icy fog',                iconDay: 'CloudFog',        iconNight: 'CloudFog',         backgroundClass: 'from-slate-300 to-slate-400' },
  // Drizzle
  51: { label: 'Light drizzle',          iconDay: 'CloudDrizzle',    iconNight: 'CloudDrizzle',     backgroundClass: 'from-slate-400 to-blue-600' },
  53: { label: 'Moderate drizzle',       iconDay: 'CloudDrizzle',    iconNight: 'CloudDrizzle',     backgroundClass: 'from-slate-400 to-blue-600' },
  55: { label: 'Heavy drizzle',          iconDay: 'CloudDrizzle',    iconNight: 'CloudDrizzle',     backgroundClass: 'from-slate-500 to-blue-700' },
  // Freezing drizzle
  56: { label: 'Light freezing drizzle', iconDay: 'CloudHail',       iconNight: 'CloudHail',        backgroundClass: 'from-slate-400 to-blue-600' },
  57: { label: 'Heavy freezing drizzle', iconDay: 'CloudHail',       iconNight: 'CloudHail',        backgroundClass: 'from-slate-500 to-blue-700' },
  // Rain
  61: { label: 'Light rain',             iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-500 to-blue-700' },
  63: { label: 'Moderate rain',          iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-600 to-blue-800' },
  65: { label: 'Heavy rain',             iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-700 to-blue-900' },
  // Freezing rain
  66: { label: 'Light freezing rain',    iconDay: 'CloudHail',       iconNight: 'CloudHail',        backgroundClass: 'from-slate-500 to-blue-700' },
  67: { label: 'Heavy freezing rain',    iconDay: 'CloudHail',       iconNight: 'CloudHail',        backgroundClass: 'from-slate-700 to-blue-900' },
  // Snow
  71: { label: 'Light snow',             iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-200 to-blue-200' },
  73: { label: 'Moderate snow',          iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-200 to-blue-300' },
  75: { label: 'Heavy snow',             iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-100 to-blue-200' },
  77: { label: 'Snow grains',            iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-200 to-blue-200' },
  // Rain showers
  80: { label: 'Light showers',          iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-500 to-blue-700' },
  81: { label: 'Moderate showers',       iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-600 to-blue-800' },
  82: { label: 'Violent showers',        iconDay: 'CloudRain',       iconNight: 'CloudRain',        backgroundClass: 'from-slate-700 to-blue-900' },
  // Snow showers
  85: { label: 'Light snow showers',     iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-200 to-blue-200' },
  86: { label: 'Heavy snow showers',     iconDay: 'Snowflake',       iconNight: 'Snowflake',        backgroundClass: 'from-slate-100 to-blue-200' },
  // Thunderstorm
  95: { label: 'Thunderstorm',           iconDay: 'CloudLightning',  iconNight: 'CloudLightning',   backgroundClass: 'from-slate-700 to-slate-900' },
  96: { label: 'Thunderstorm w/ hail',   iconDay: 'CloudLightning',  iconNight: 'CloudLightning',   backgroundClass: 'from-slate-700 to-slate-900' },
  99: { label: 'Thunderstorm w/ hail',   iconDay: 'CloudLightning',  iconNight: 'CloudLightning',   backgroundClass: 'from-slate-700 to-slate-900' },
}

export function getWeatherCondition(code: number): WeatherCondition {
  return WMO_CONDITIONS[code] ?? {
    label: 'Unknown',
    iconDay: 'Cloud',
    iconNight: 'Cloud',
    backgroundClass: 'from-slate-400 to-slate-500',
  }
}
