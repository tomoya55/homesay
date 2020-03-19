import { homesay, VoiceTextOptions } from ".";

(async () => {
    const options: VoiceTextOptions = {
        apikey: process.env.VOICE_TEXT_API_KEY,
        text: process.argv[2],
    };
    homesay(options);
})();
