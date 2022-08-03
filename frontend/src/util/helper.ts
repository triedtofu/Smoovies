export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  return String(error)
}

export const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

export const youtubeURLToCode = (url: string) => {
  const patterns = [
    /^(?:http[s]?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^#&?.]*)[^.]*$/,
    /^(?:http[s]?:\/\/)?(?:www\.)?youtu\.be\/([^#&?.]*)[^.]*$/,
    /^(?:http[s]?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^#&?.]*)[^.]*$/
  ]
  const len = patterns.length;

  for (let i = 0; i < len; i++) {
    const match = url.match(patterns[i]);
    if (match && match.length > 1 && match[1].length === 11) return match[1];
  }

  return null;
}

/**
 * 
 * @param low 
 * @param high 
 * @returns random integer inclusive from low to high
 */
 export const randInt = (low: number, high: number) => {
  return Math.floor((Math.random() * (high - low + 1)) + low);
}
