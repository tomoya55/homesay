import { homesay } from "../src";

(async () => homesay(process.env.VOICE_TEXT_API_KEY!, process.argv[2]))();
