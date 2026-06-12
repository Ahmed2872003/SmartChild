const cleanStreamText = (chunk) => {
  const textChunk = chunk.toString();

  const lines = textChunk.split('\n');

  for (const line of lines) {
    if (line.trim() === '' || line.includes('[DONE]')) continue;

    if (line.startsWith('data:')) {
      const cleanWord = line.replace(/^data:\s*/, '');

      return cleanWord;
    }
  }
  return '';
};

module.exports = { cleanStreamText };
