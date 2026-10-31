// Same rule as the server: letters, digits, spaces and _ . ' -, 2 to 40 long, no links
const NICKNAME = /^[\p{L}\p{N}][\p{L}\p{N} _.'-]{1,39}$/u;

export const isValidNickname = (value: string) => {
  const nickname = value.trim().replace(/\s+/g, " ");
  return NICKNAME.test(nickname) && !/http|www\./i.test(nickname);
};

const STORAGE_KEY = "library-nickname";

// Remembered on this device only, as a convenience for the next request
export const readSavedNickname = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

export const saveNickname = (value: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Private mode or blocked storage: the field is just empty next time
  }
};
