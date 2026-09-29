import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.codeneurax.in'
  
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/events', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/aispark', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/econtent', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/services', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/work-with-us', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/speaker', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/sponsorship', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/login', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' as const },
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
