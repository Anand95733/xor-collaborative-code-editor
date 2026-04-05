"use client"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip2"
const people = [
  {
    id: 1,
    name: "Anand Ediga",
    designation: "Full Stack Developer",
    image: "/profile.png",
    link: "https://github.com/Anand95733",
  },
]

export default function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      {people.map((person) => (
        <a key={person.id} href={person.link} target="_blank" rel="noopener noreferrer">
          <AnimatedTooltip items={[person]} />
        </a>
      ))}
    </div>
  )
}
