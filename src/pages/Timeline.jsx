import React from "react";
import Header from "../components/Header";

const events = [
  {
    date: "April 18th, 2025",
    title: "National Library Week",
    photos: [
  "/images/Day13Image1.jpg",
  "/images/Day13Image2.jpg",
  "/images/Day13Image3.jpg",
  "/images/Day13Image4.jpg",
    ],
    summary: "King's Council celebrates national library week with more chess",
  },
  {
    date: "January 17th, 2025",
    title: "Winter Skirmish",
    photos: [
  "/images/Day12Image1.jpg",
  "/images/Day12Image2.jpg",
  "/images/Day12Image3.jpg",
  "/images/Day12Image4.jpg",
    ],
    summary: "Casual Chess playing with tactical puzzles",
  },
  {
    date: "September 18th, 2024",
    title: "Back to school",
    photos: [
  "/images/Day11Image1.jpg",
  "/images/Day11Image2.jpg",
  "/images/Day11Image3.jpg",
  "/images/Day11Image4.jpg",
    ],
    summary: "Virtual with 2 inperson coordinators",
  },
  {
    date: "July 26th, 2024",
    title: "Wrapping up the Summer",
    photos: [
  "/images/Day10Image1.jpg",
  "/images/Day10Image2.jpg",
  "/images/Day10Image3.jpg",
  "/images/Day10Image4.jpg",
    ],
    summary: "Wrapping up the summer with a new coordinator",
  },
  {
    date: "July 12th, 2024",
    title: "Summer Blitz",
    photos: [
  "/images/Day9Image1.jpg",
  "/images/Day9Image2.jpg",
  "/images/Day9Image3.jpg",
  "/images/Day9Image4.jpg",
    ],
    summary: "Inhouse bltiz tournament celebrating the previous week's 4th of July",
  },
  {
    date: "June 28th, 2024",
    title: "Sculpting Synpases",
    photos: [
  "/images/Day8Image1.jpg",
  "/images/Day8Image2.jpg",
  "/images/Day8Image3.jpg",
  "/images/Day8Image4.jpg",
    ],
    summary: "Raised over $1000 with the Heart of Alabama Food Bank, while learning about our brain",
  },
  {
    date: "June 11th, 2024",
    title: "Summer Kickoff",
    photos: [
  "/images/Day7Image1.jpg",
  "/images/Day7Image2.jpg",
  "/images/Day7Image3.jpg",
  "/images/Day7Image4.jpg",
    ],
    summary: "Held our summer kickoff event to ignite a fun chess-filled break",
  },
  {
    date: "March 29th, 2024",
    title: "Chess Food Drive",
    photos: [
  "/images/Day6Image1.jpg",
  "/images/Day6Image2.jpg",
  "/images/Day6Image3.jpg",
  "/images/Day6Image4.jpg",
    ],
    summary: "Raised money and donated food for the local food pantry, Woodland Food Pantry",
  },
  {
    date: "February 24th, 2024",
    title: "Blitz Tournament",
    photos: [
  "/images/Day5Image1.jpg",
  "/images/Day5Image2.jpg",
  "/images/Day5Image3.jpg",
  "/images/Day5Image4.jpg",
    ],
    summary: "Held an inhouse blitz tournament training instinct and speed",
  },
  {
    date: "January 5th, 2024",
    title: "Winter Chess Workshop",
    photos: [
  "/images/Day4Image1.jpg",
  "/images/Day4Image2.jpg",
  "/images/Day4Image3.jpg",
  "/images/Day4Image4.jpg",
    ],
    summary: "Focused workshop on openings and endgames.",
  },
  {
    date: "November 20th, 2023",
    title: "Tournament",
    photos: [
  "/images/Day3Image1.jpg",
  "/images/Day3Image2.jpg",
  "/images/Day3Image3.jpg",
  "/images/Day3Image4.jpg",
    ],
    summary: "Held our very first in-house tournament",
  },
  {
    date: "October 13th, 2023",
    title: "2nd Kings Council Event",
    photos: [
  "/images/Day2Image1.jpg",
  "/images/Day2Image2.jpg",
  "/images/Day2Image3.jpg",
  "/images/Day2Image4.jpg",
    ],
    summary: "Traditional Casual Chess Games",
  },
  {
    date: "July 14th, 2023",
    title: "Club Founding Day",
photos: [
  "/images/Day1Image1.jpg",
  "/images/Day1Image2.jpg",
  "/images/Day1Image3.jpg",
  "/images/Day1Image4.jpg",
],



    summary: "Officially founded the chess club and welcomed first members.",
  },
];

export default function Timeline() {
  return (
    <div className="min-h-screen bg-gray-50 font-body text-gray-900">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif-custom font-bold mb-12 text-center">
          Chess Club Timeline
        </h1>

        <div className="space-y-16">
          {events.map(({ date, title, photos, summary }, idx) => (
            <section key={idx} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-2">{title}</h2>
              <p className="text-gray-700 mb-4 italic">{date}</p>
              <p className="mb-6">{summary}</p>
              <div className="grid grid-cols-2 gap-4">
                {photos.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${title} photo ${i + 1}`}
                    className="rounded-lg w-full h-auto max-h-64 object-contain"
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
