const {
    PollyClient,
    SynthesizeSpeechCommand,
  } = require('@aws-sdk/client-polly');
  const fs = require('fs');
  const path = require('path');
  
  const pollyClient = new PollyClient({ region: 'ap-south-1' });
  
  // ✅ Correct LanguageCode + VoiceId mapping for Polly
  const languageVoiceMap = {
    hi: { voiceId: 'Aditi', languageCode: 'hi-IN' },
    es: { voiceId: 'Lupe', languageCode: 'es-ES' },
    fr: { voiceId: 'Celine', languageCode: 'fr-FR' },
    de: { voiceId: 'Vicki', languageCode: 'de-DE' },
    ja: { voiceId: 'Mizuki', languageCode: 'ja-JP' },
  };
  
  async function synthesizeToAudio(text, lang, index) {
    const { voiceId, languageCode } = languageVoiceMap[lang] || {
      voiceId: 'Joanna',
      languageCode: 'en-US',
    };
  
    const command = new SynthesizeSpeechCommand({
      OutputFormat: 'mp3',
      Text: text,
      VoiceId: voiceId,
      LanguageCode: languageCode,
    });
  
    const response = await pollyClient.send(command);
  
    const audioPath = path.join(__dirname, '../public/audio', `speech_${index}_${lang}.mp3`);
    const writeStream = fs.createWriteStream(audioPath);
    response.AudioStream.pipe(writeStream);
  
    await new Promise((resolve) => writeStream.on('finish', resolve));
  
    return `/audio/speech_${index}_${lang}.mp3`;
  }
  
  module.exports = { synthesizeToAudio };
  