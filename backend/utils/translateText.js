const {
    TranslateClient,
    TranslateTextCommand,
  } = require('@aws-sdk/client-translate');
  
  const translateClient = new TranslateClient({ region: 'ap-south-1' });
  
  const targetLanguages = ['hi', 'es', 'fr', 'de', 'ja'];
  
  async function translateTextToAllLanguages(text) {
    const translations = [];
  
    for (const lang of targetLanguages) {
      const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: 'en',
        TargetLanguageCode: lang,
      });
  
      const response = await translateClient.send(command);
  
      translations.push({
        language: lang,
        text: response.TranslatedText,
      });
    }
  
    return translations;
  }
  
  module.exports = { translateTextToAllLanguages };
  