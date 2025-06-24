// utils/extractTextFromImage.js

const {
    TextractClient,
    DetectDocumentTextCommand,
  } = require('@aws-sdk/client-textract');
  const fs = require('fs');
  
  // Initialize the client with region
  const textractClient = new TextractClient({ region: 'ap-south-1' });
  
  async function extractTextFromImage(filePath) {
    const imageBytes = fs.readFileSync(filePath); // Read image file as buffer
  
    const command = new DetectDocumentTextCommand({
      Document: {
        Bytes: imageBytes,
      },
    });
  
    const response = await textractClient.send(command);
  
    // Extract only LINE type blocks
    const lines = response.Blocks
      .filter((block) => block.BlockType === 'LINE')
      .map((block) => block.Text);
  
    return lines.join(' ');
  }
  
  module.exports = { extractTextFromImage };
  