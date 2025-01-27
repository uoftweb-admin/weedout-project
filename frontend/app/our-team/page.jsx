import React from "react";
import { Inria_Serif } from '@next/font/google';

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function OurTeamPage() {
  const teamData = [
    {
      teamName: "UofT WebDev Team",
      members: Array(6).fill({ name: "John Doe", position: "Position Name" }),
    },
    {
      teamName: "UTM Software Club Team",
      members: Array(6).fill({ name: "John Doe", position: "Position Name" }),
    },
  ];

  return (
    <div className="bg-customGreen min-h-screen p-8">
      <h1
        className={`${inriaSerif.className} text-beige text-4xl font-bold text-center mt-10`}
      >
        2024 - 2025 WeedOut Team
      </h1>
      <p
        className={`${inriaSerif.className} text-beige text-lg text-center mt-2`}
      >
        UofT WebDev X UTM Software Club
      </p>
      <div className="mt-10 space-y-16">
        {teamData.map((team, index) => (
          <div key={index}>
            <h2
              className={`${inriaSerif.className} text-beige text-3xl font-semibold text-center`}
            >
              {team.teamName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-8 mt-8 justify-items-center">
              {team.members.map((member, idx) => (
                <div
                  key={idx}
                  className={`${inriaSerif.className} flex flex-col items-center text-beige space-y-2`}
                >
                  <div className="w-24 h-24 bg-beige rounded-full"></div>
                  <h3 className="text-xl font-medium">{member.name}</h3>
                  <p className="text-sm">{member.position}</p>
                  <div className="flex justify-center space-x-4 mt-2">
                    <a
                      href="#"
                      className="bg-beige p-2 rounded-full"
                      aria-label="GitHub"
                    >
                      <img
                        src="/icons/github-icon.png"
                        alt="GitHub"
                        className="w-6 h-6 md:w-5 md:h-5"
                      />
                    </a>
                    <a
                      href="#"
                      className="bg-beige p-2 rounded-full"
                      aria-label="LinkedIn"
                    >
                      <img
                        src="/icons/linkedin-icon.png"
                        alt="LinkedIn"
                        className="w-6 h-6 md:w-5 md:h-5"
                      />
                    </a>
                    <a
                      href="#"
                      className="bg-beige p-2 rounded-full"
                      aria-label="Email"
                    >
                      <img
                        src="/icons/email-icon.png"
                        alt="Email"
                        className="w-6 h-6 md:w-5 md:h-5"
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
