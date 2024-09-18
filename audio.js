import fs from "node:fs/promises";
import {voice_over_description} from "./required_data.js";

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
  const audio = await getAudio(voice_over_description);
  await fs.writeFile("./audio/speech.mp3", audio);
}

main();
