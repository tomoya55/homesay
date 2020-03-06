import fetch from "node-fetch";
import { URLSearchParams } from "url";

export type VoiceTextOptions = {
    apikey?: string;
    text: string;
    speaker?: "show" | "haruka" | "hikari" | "takeru" | "santa" | "bear";
    format?: string;
    emotion?: "happiness" | "anger" | "sadness";
    emotion_level?: "1" | "2" | "3" | "4";
    volume?: string;
    pitch?: string;
    speed?: string;
};

export type TTS = {
    synth: (options: any) => Promise<Buffer>;
};

export class VoiceText implements TTS {
    public synth(options: any) {
        return this.do(options as VoiceTextOptions);
    }

    // https://cloud.voicetext.jp/webapi/docs/api
    async do(options: VoiceTextOptions) {
        const params = new URLSearchParams();
        params.append("text", options.text);
        params.append("speaker", options.speaker || "haruka");
        params.append("format", options.format || "wav");
        params.append("emotion", options.emotion || "happiness");
        params.append("emotion_level", options.emotion_level || "2");
        params.append("volume", options.volume || "150");
        params.append("pitch", options.pitch || "100");
        params.append("speec", options.speed || "100");

        const ret = await fetch("https://api.voicetext.jp/v1/tts", {
            method: "POST",
            body: params,
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(options.apikey + ":" + "").toString("base64"),
            },
        });
        if (ret.ok) {
            const buf = await ret.buffer();
            return buf;
        } else {
            const json = await ret.json();
            throw new Error(JSON.stringify(json.error));
        }
    }
}
