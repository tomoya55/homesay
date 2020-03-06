# Homesay

Simple Javascript/Typescript utility to make Google Home say something.

## Usage

```
import { homesay } from "homesay";

(async () => homesay(process.env.VOICE_TEXT_API_KEY!, process.argv[2]))();
```

It internally calls [VoiceText](https://cloud.voicetext.jp/webapi/docs/api) API for TTS, so VoiceText API is required.


## License

MIT

## Author

Tomoya Hirano <tomoya@nicecabbage.com>
