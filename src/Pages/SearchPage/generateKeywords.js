export const generateKeywords = (title) => {
  const words = title.toLowerCase().split(" ");

  const keywords = new Set();

  // single words
  words.forEach(word => keywords.add(word));

  // combinations
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j <= words.length; j++) {
      keywords.add(words.slice(i, j).join(" "));
    }
  }

  return Array.from(keywords);
};
