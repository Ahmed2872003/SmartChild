const formatEmotionLabel = (key) => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' / ');
};

const cleanChunk = (chunk) => {
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

export { formatEmotionLabel, cleanChunk };
