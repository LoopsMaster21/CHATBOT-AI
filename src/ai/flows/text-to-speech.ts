'use server';
/**
 * @fileOverview Converts text to speech using Google's TTS model.
 *
 * - convertTextToSpeech - A function that handles the text-to-speech conversion.
 * - ConvertTextToSpeechInput - The input type for the convertTextToSpeech function.
 * - ConvertTextToSpeechOutput - The return type for the convertTextToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

const ConvertTextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type ConvertTextToSpeechInput = z.infer<typeof ConvertTextToSpeechInputSchema>;

const ConvertTextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI in WAV format. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type ConvertTextToSpeechOutput = z.infer<typeof ConvertTextToSpeechOutputSchema>;

export async function convertTextToSpeech(input: ConvertTextToSpeechInput): Promise<ConvertTextToSpeechOutput> {
  return textToSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d: Buffer) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: ConvertTextToSpeechInputSchema,
    outputSchema: ConvertTextToSpeechOutputSchema,
  },
  async ({text}) => {
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const voiceName = isArabic ? 'Zeta' : 'Triton'; // Using pre-built voice names

    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName},
          },
        },
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('No audio media returned from TTS model.');
    }
    
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
