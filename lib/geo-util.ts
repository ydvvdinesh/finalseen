/**
 * lib/geo-util.ts
 * Geolocation and Network Intelligence Utility for Legal Audit & Compliance.
 * Resolves Client IP, City, Region, Country, Latitude, Longitude, Timezone, and ISP
 * from edge headers (Vercel, Cloudflare) with fallback to geo-ip lookup.
 */

import { getClientIp } from '@/lib/rate-limiter'

export interface GeoLocationResult {
  ip: string
  city: string
  region: string
  country: string
  countryCode: string
  latitude: string | null
  longitude: string | null
  timezone: string | null
  isp?: string
  source: 'vercel' | 'cloudflare' | 'geoip_lookup' | 'local' | 'unknown'
}

function isPrivateIp(ip: string): boolean {
  if (!ip) return true
  const trimmed = ip.trim()
  return (
    trimmed === '127.0.0.1' ||
    trimmed === '::1' ||
    trimmed === 'localhost' ||
    trimmed.startsWith('192.168.') ||
    trimmed.startsWith('10.') ||
    trimmed.startsWith('172.16.') ||
    trimmed === 'unknown-ip'
  )
}

/**
 * Resolve IP and geographic location from request headers or geoip service.
 */
export async function resolveGeoLocation(req: Request): Promise<GeoLocationResult> {
  const ip = getClientIp(req)

  // 1. Check native Vercel Edge / Serverless geolocation headers
  const vercelCity = req.headers.get('x-vercel-ip-city')
  const vercelCountry = req.headers.get('x-vercel-ip-country')
  const vercelRegion = req.headers.get('x-vercel-ip-country-region')
  const vercelLat = req.headers.get('x-vercel-ip-latitude')
  const vercelLon = req.headers.get('x-vercel-ip-longitude')
  const vercelTz = req.headers.get('x-vercel-ip-timezone')

  if (vercelCity || vercelCountry) {
    return {
      ip,
      city: vercelCity ? decodeURIComponent(vercelCity) : 'Unknown',
      region: vercelRegion || 'Unknown',
      country: vercelCountry || 'Unknown',
      countryCode: vercelCountry || 'Unknown',
      latitude: vercelLat || null,
      longitude: vercelLon || null,
      timezone: vercelTz || null,
      source: 'vercel',
    }
  }

  // 2. Check Cloudflare geolocation headers
  const cfCity = req.headers.get('cf-ipcity')
  const cfCountry = req.headers.get('cf-ipcountry')
  const cfRegion = req.headers.get('cf-region')
  const cfLat = req.headers.get('cf-iplatitude')
  const cfLon = req.headers.get('cf-iplongitude')

  if (cfCity || cfCountry) {
    return {
      ip,
      city: cfCity || 'Unknown',
      region: cfRegion || 'Unknown',
      country: cfCountry || 'Unknown',
      countryCode: cfCountry || 'Unknown',
      latitude: cfLat || null,
      longitude: cfLon || null,
      timezone: null,
      source: 'cloudflare',
    }
  }

  // 3. Localhost / Private IP development check
  if (isPrivateIp(ip)) {
    return {
      ip,
      city: 'Local Environment',
      region: 'Development',
      country: 'Localhost',
      countryCode: 'DEV',
      latitude: null,
      longitude: null,
      timezone: 'Asia/Kolkata',
      source: 'local',
    }
  }

  // 4. Fallback lookup for public IP (e.g. self-hosted VPS, non-edge deployments)
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,lat,lon,timezone,isp`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (res.ok) {
      const data = await res.json()
      if (data.status === 'success') {
        return {
          ip,
          city: data.city || 'Unknown',
          region: data.regionName || 'Unknown',
          country: data.country || 'Unknown',
          countryCode: data.countryCode || 'Unknown',
          latitude: data.lat != null ? String(data.lat) : null,
          longitude: data.lon != null ? String(data.lon) : null,
          timezone: data.timezone || null,
          isp: data.isp || undefined,
          source: 'geoip_lookup',
        }
      }
    }
  } catch {
    // Non-blocking fallback
  }

  return {
    ip,
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown',
    countryCode: 'XX',
    latitude: null,
    longitude: null,
    timezone: null,
    source: 'unknown',
  }
}
