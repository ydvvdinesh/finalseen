export type Ambassador = {
  id: string
  name: string
  tenure: string
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
    tenure: "Tenure (2025–26)",
    university: "Dr. A.P.J. Abdul Kalam Technical University, Kanpur",
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
    tenure: "Tenure (2025–26)",
    university: "Chitkara University of Engineering and Technology",
    department: "Computer Science and Engineering",
    year: "3rd Year",
    avatar: "/images/CodeNeuraX.webp",
    email: "harshita0518.be23@chitkara.edu.in",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/harshita-gupta-090028290/" },
    ],
  },
  {
    id: "3",
    name: "Khushi Sharma",

    tenure: "Tenure (2025–26)",
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
    tenure: "Tenure (2025–26)",
    university: "Silver Oak University",
    department: "Computer Science and Engineering",
    year: "3rd Year",
    avatar: "/images/CodeNeuraX.webp",
    email: "hitendrasinh2004@gmail.com",
    socials: [{ platform: "LinkedIn", url: "https://www.linkedin.com/in/hitendrasinhzala/" }],
  },
  {
    id: "5",
    name: "Hitesh Singh Parihar",
    tenure: "Tenure (2025–26)",
    university: "Government Engineering College, Rajkot",
    department: "Computer Science and Engineering",
    year: "2nd Year",
    avatar: "/images/CodeNeuraX.webp",
    email: "hiteshparihar8780@gmail.com",
    socials: [{ platform: "LinkedIn", url: "https://www.linkedin.com/in/gecrai240200143027/" }],
  }
]

