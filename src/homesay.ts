import mdns from "mdns-js";
import http from "http";
import url from "url";
import { lookup } from "dns";
import { hostname } from "os";
import { promisify } from "util";
import { VoiceText, VoiceTextOptions } from "./tts/voicetext";
const castv2 = require("castv2-client");

const getLocalIp = (): Promise<string> =>
    promisify(lookup)(hostname()).then(
        (r: { address: string; family: number }): string => r.address
    );

const matchName = (deviceName: string, name: string) =>
    name.replace(/\s+/g, "") === deviceName.replace(/\s+/g, "");

export type BrowsedDevice = {
    device_id: string;
    name: string;
    address: string;
    port: number;
};

function parseService(service: any): BrowsedDevice | undefined {
    const txt = service["txt"];
    if (txt && txt.length >= 7) {
        return {
            device_id: service["txt"][0].split("=")[1]!,
            name: service["txt"][6].split("=")[1]!,
            address: service["addresses"][0]!,
            port: service["port"]!,
        };
    }
}

function searchDeviceIp({
    name,
    timeout = 3000,
}: {
    name?: string;
    timeout?: number;
}): Promise<string> {
    return new Promise((resolve, reject) => {
        const browser = mdns.createBrowser(mdns.tcp("googlecast"));
        browser.on("ready", () => browser.discover());
        browser.on("update", (service: any) => {
            const dev = parseService(service);
            if (dev) {
                console.log(dev);
                if ((name && matchName(dev.name, name)) || !name) {
                    if (timer) clearTimeout(timer);
                    browser.stop();
                    resolve(dev.address);
                }
            }
        });
        const timer = setTimeout(() => {
            browser.stop();
            reject();
        }, timeout);
    });
}

const createAudioServer = (buf: Buffer) =>
    http.createServer(async (req, res) => {
        if (req.url) {
            const parts = url.parse(req.url);
            if (parts?.path === "/voice.mp3") {
                try {
                    res.writeHead(200, {
                        "Content-Type": "audio/mpeg",
                        "Content-Length": buf.length,
                    });
                    res.write(buf);
                    res.end();
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end(`e.toString()\n`);
                }
                return;
            }
        }
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found\n");
    });

const audioUrl = async (port: number) =>
    `http://${await getLocalIp()}:${port}/voice.mp3`;

function connectFromHomeAndPlay(deviceIP: string, contentId: string) {
    return new Promise<void>((resolve, reject) => {
        const client = new castv2.Client();

        client.connect(deviceIP, () => {
            client.launch(
                castv2.DefaultMediaReceiver,
                async (err: any, player: any) => {
                    if (err) {
                        client.close();
                        reject(err);
                    }
                    player.load(
                        {
                            contentId,
                            contentType: "audio/mp3",
                            streamType: "BUFFERED",
                        },
                        { autoplay: true },
                        () => {
                            console.log("done");
                            client.close();
                            resolve();
                        }
                    );
                }
            );
        });
        client.on("error", (err: any) => {
            client.close();
            reject(err);
        });
    });
}

export const homesay = async (
    voice_text_api_key: string,
    message: string,
    deviceName?: string,
    port = 18086
) => {
    const ttsOptions: VoiceTextOptions = {
        apikey: voice_text_api_key,
        text: message,
        format: "mp3",
    };

    try {
        const buf = await new VoiceText().synth(ttsOptions);

        const s = createAudioServer(buf);
        s.listen(port, async () => {
            console.log(`listening on ${port}`);
            try {
                const deviceIp = await searchDeviceIp({ name: deviceName });
                await connectFromHomeAndPlay(deviceIp, await audioUrl(port));
            } finally {
                console.log("shutting down the server");
                s.close();
            }
        });
    } catch (e) {
        console.error(e);
        process.exit(-1);
    }
};
