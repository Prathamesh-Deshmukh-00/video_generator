import fs from "node:fs/promises";

const API_BASE_URL = "https://api.sws.speechify.com";
const API_KEY = "Rz2tmCnZ_eNpsk034eelEvOdKC5F8Asr4JbRgPoQMVk=";
const VOICE_ID = "george";

async function getAudio(text) {
  const res = await fetch(`${API_BASE_URL}/v1/audio/speech`, {
    method: "POST",
    body: JSON.stringify({
      input: `<speak>${text}</speak>`,
      voice_id: VOICE_ID,
      audio_format: "mp3",
    }),
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "content-type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}\n${await res.text()}`);
  }

  const responseData = await res.json();
  const decodedAudioData = Buffer.from(responseData.audio_data, "base64");
  return decodedAudioData;
}

async function main() {
  const audio = await getAudio("Three best friends, Anna, Chloe, and Mia, are getting ready for a night out. They're trying on different outfits in a dressing room, and the scene quickly descends into chaos as they poke fun at each other's fashion choices. The laughter is contagious, and the girls are rolling with hysterics. It's clear that their friendship is built on a solid foundation of shared humor and mutual teasing.");
  await fs.writeFile("./audio/speech.mp3", audio);
}

main();
