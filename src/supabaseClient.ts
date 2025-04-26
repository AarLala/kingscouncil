import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edbzcwrxfhgudxaklovz.supabase.co'; // TODO: Replace with your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkYnpjd3J4ZmhndWR4YWtsb3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTY2NTUsImV4cCI6MjA2MTE3MjY1NX0.TOv9OOFxRrcBXUPbFqGCtsTUWVNryUM8dGdhIBIyY-M'; // TODO: Replace with your Supabase anon/public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utility to fetch and cache challenge UUIDs by number
let challengeUuidMap: Record<string, string> | null = null;

export async function getChallengeUuidMap() {
  if (challengeUuidMap) return challengeUuidMap;
  const { data, error } = await supabase
    .from('challenges')
    .select('id, name');
  if (error) throw error;
  // Map challenge numbers to UUIDs based on name order
  // You may want to adjust this logic if you add/remove challenges
  const nameToNumber: Record<string, string> = {
    'Memory Recall': '1',
    'Blurred Vision': '2',
    'Prediction Game': '3',
    'Recall the Game': '4',
    'Cognitive Switch': '5',
  };
  challengeUuidMap = {};
  for (const row of data) {
    const num = nameToNumber[row.name];
    if (num) challengeUuidMap[num] = row.id;
  }
  return challengeUuidMap;
} 