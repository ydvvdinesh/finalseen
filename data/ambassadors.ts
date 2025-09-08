export type Ambassador = {
  id: string
  name: string
  university: string
  department?: string
  year?: string
  avatar?: string
  email?: string
  socials?: { platform: string; url: string }[]
}

// Edit this list to manage Campus Ambassadors
export const AMBASSADORS: Ambassador[] = [
  {
    id: "1",
    name: "Nidhi Mishra",
    university: "Dr. A.P.J. Abdul Kalam Technical University,Kanpur",
    department: "Electronics and Communication Engineering",
    year: "3rd Year",
    avatar: "/images/CodeNeuraX.webp",
    email: "mishranidhi41050@gmail.com",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/nidhi-mishra-640b1735b/" },
    ],
  },
  {
    id: "2",
    name: "Harshita Gupta",
    university: "Chitkara University of Engineering and Technology",
    department: "Computer Science and Engineering",
    year: "3rd Year",
    avatar: "/images/CodeNeuraX.webp",
    email: "harshita0518.be23@chitkara.edu.in",
    socials: [{ platform: "LinkedIn", url: "https://www.linkedin.com/in/harshita-gupta-090028290/" }],
  },
  {
    id: "3",
    name: "Khushi Sharma",
    university: "Indira Gandhi Delhi Technical University For Women",
    department: "Bachelor of Business Administration",
    year: "2nd Year",
    avatar: "/images/CodeNeuraX.webp",
    email: "rsharmakhushi6161@gmail.com",
    socials: [{ platform: "LinkedIn", url: "https://www.linkedin.com/in/khushiisharma/" }],
  },
    {
    id: "4",
    name: "Hitendrasinh Zala",
    university: "Silver Oak University",
    department: "Computer Science and Engineering",
    year: "3rd Year",
    avatar: "/images/CodeNeuraX.webp",
    email: "hitendrasinh2004@gmail.com",
    socials: [{ platform: "LinkedIn", url: "https://www.linkedin.com/in/hitendrasinhzala/" }],
  },
]


