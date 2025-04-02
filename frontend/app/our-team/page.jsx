// Import Statements
import React from 'react';
import Image from 'next/image';
import { Inria_Serif } from 'next/font/google';

// Google Font Configuration
const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

// Team Data with Optional GitHub and Image Fields
const teamData = [
  {
    teamName: "UofT WebDev Team",
    members: [
      {
        name: "Eiqan Ahmed",
        position: "Project Lead",
        linkedin: "https://www.linkedin.com/in/eiqan-ahmed-549786254",
        github: "https://github.com/eiqanahmed",
        image: "/images/eiqan-ahmed.jpg"
      }, 
      {
        name: "Jialuo (Eric) Chen",
        position: "Software Developer",
        linkedin: "https://www.linkedin.com/in/ericjialuochen/",
        github: "https://github.com/chenj926",
        image: "/images/jialuo-chen.jpg"
      },
      
      {
        name: "Yiyun Zhang",
        position: "Software Developer",
        linkedin: "http://linkedin.com/in/zhangyiyun-",
        github: "",  // No GitHub link provided
        image: "/images/yiyun-zhang.jpg"
      },
      {
        name: "Hansini Mirchandani",
        position: "Software Developer",
        linkedin: "https://www.linkedin.com/in/hansini-mirchandani/",
        github: "https://github.com/hansini0813",
        image: ""
      },
    ]
  },
  {
    teamName: "UTM Software Club Team",
    members: [
      {
        name: "Rohan Sunilkumar Nair",
        position: "Co-founder and ML Lead",
        linkedin: "https://www.linkedin.com/in/rohansunilkumarnair/",
        github: "https://github.com/rohannair2022",
        image: "/images/rohan-nair.jpg"
      },
      {
        name: "Karan Kumar",
        position: "Co-Founder and Head of Product",
        linkedin: "https://www.linkedin.com/in/karan-kumar-b18426163/",
        github: "https://github.com/bayesiankk123",
        image: "/images/karan-kumar.jpg"
      },
      {
        name: "Senajith S R",
        position: "Machine Learning Engineer",
        linkedin: "https://www.linkedin.com/in/senajith-s-r-99837621a/?originalSubdomain=in",
        github: "https://github.com/Senajith",
        image: "/images/senajith-sr.jpg"
      }
    ]
  }
];

// Main Component
export default function OurTeamPage() {
  return (
    <div className="bg-customGreen min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className={`${inriaSerif.className} text-beige text-4xl font-bold text-center mt-10`}>
        2024 - 2025 WeedOut Team
      </h1>
      <p className={`${inriaSerif.className} text-beige text-lg text-center mt-2`}>
        UofT WebDev X UTM Software Club
      </p>

      <div className="mt-10 w-full max-w-6xl">
        {teamData.map((team, index) => (
          <div key={index} className="mb-16">
            <h2 className={`${inriaSerif.className} text-beige text-3xl font-semibold text-center mb-8`}>
              {team.teamName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 justify-items-center">
              {team.members.map((member, idx) => (
                <div key={idx} className="flex flex-col items-center text-beige space-y-4">
                  {/* Profile Image or White Circle */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-beige flex items-center justify-center bg-beige">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      // White Circle
                      <div className="w-full h-full bg-beige rounded-full"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-medium text-center">{member.name}</h3>
                  <p className="text-sm text-center">{member.position}</p>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-beige p-2 rounded-full hover:bg-opacity-80 transition"
                        aria-label="GitHub"
                      >
                        <img
                          src="/icons/github-icon.png"
                          alt="GitHub"
                          className="w-6 h-6"
                        />
                      </a>
                    )}
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-beige p-2 rounded-full hover:bg-opacity-80 transition"
                      aria-label="LinkedIn"
                    >
                      <img
                        src="/icons/linkedin-icon.png"
                        alt="LinkedIn"
                        className="w-6 h-6"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
