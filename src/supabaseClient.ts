import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jmmtlvkmtxrqzkfebtwq.supabase.co'; // TODO: Replace with your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbXRsdmttdHhycXprZmVidHdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Njc0NjEsImV4cCI6MjA2NDQ0MzQ2MX0.vhWqV8FenOdnolgPpXB69Q4xYy9suFTzFjbI1VET-wQ'; // TODO: Replace with your Supabase anon/public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utility to fetch and cache challenge UUIDs by number
let challengeUuidMap: Record<string, string> | null = null;

export async function getChallengeUuidMap() {
  if (challengeUuidMap) return challengeUuidMap;

  const { data, error } = await supabase
    .from("challenges")
    .select("id, name");

  if (error) throw error;

  const nameToNumber: Record<string, string> = {
    "memory recall": "1",
    "blurred vision": "2",
    "prediction game": "3",
    "recall the game": "4",
    "cognitive switch": "5",
  };

  challengeUuidMap = {};

  for (const row of data) {
    const cleanedName = row.name?.trim().toLowerCase();
    const num = nameToNumber[cleanedName];

    if (num) {
      challengeUuidMap[num] = row.id;
    } else {
      console.warn("Unmapped challenge name in DB:", row.name);
    }
  }

  return challengeUuidMap;
}
