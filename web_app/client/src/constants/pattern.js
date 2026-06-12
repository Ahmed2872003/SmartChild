const emailPattern = {
  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  description: 'e.g. example@gmail.com',
};

const namePattern = {
  pattern: /^[a-zA-Z]([a-zA-Z_]* ?[a-zA-Z_]+)*$/,
  description: '- Starts with a letter\n- Only letters and _\n- No double spaces',
};

const shareCodePattern = {
  pattern: /^[A-Z0-9]{8}$/,
  description: 'Share code should be:\n- Capital letters and numbers Only\n- 8 characters length',
};

export { emailPattern, namePattern, shareCodePattern };
