import { NextResponse } from 'next/server'

export async function GET() {
  const content = `# CodeNeuraX

> CodeNeuraX is a student-led tech community offering coding challenges, events, resources, mentorship, and career support for aspiring developers and students.

## About

CodeNeuraX was founded in 2025 by Dinesh Yadav. It is a welcoming tech community designed specifically for computer science students and recent graduates. The community provides workshops, hackathons, research projects, and industry partnerships to help members excel in Computer Science.

## Pages

- [Home](https://www.codeneurax.in/)
- [Events](https://www.codeneurax.in/events)
- [E-Content](https://www.codeneurax.in/econtent)
- [AI Spark 2026](https://www.codeneurax.in/aispark)
- [Services](https://www.codeneurax.in/services)
- [Speakers](https://www.codeneurax.in/speaker)
- [Sponsorship](https://www.codeneurax.in/sponsorship)
- [Work With Us](https://www.codeneurax.in/work-with-us)
- [Privacy Policy](https://www.codeneurax.in/privacy)
- [Terms & Conditions](https://www.codeneurax.in/terms)

## Community Features

- **Coding Challenges**: Weekly coding challenges to sharpen skills and prepare for interviews
- **Hackathons & Events**: Stay updated with the latest hackathons and tech events worldwide
- **Learning Resources**: Curated tech news, insights, and learning materials
- **Career Opportunities**: Access to internships and career guidance
- **Discussions**: Regular Ask Me Anything sessions with industry professionals
- **Community Driven**: Connect with like-minded students and professionals

## Contact

- Email: team@codeneurax.in
- LinkedIn: https://www.linkedin.com/company/codeneurax
- Instagram: https://www.instagram.com/codeneurax
- YouTube: https://www.youtube.com/@CodeNeuraX
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
