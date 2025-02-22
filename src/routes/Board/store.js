export const reset = () => {
    window.localStorage.chessData = '';
  };
  
  export const write = (key, value) => {
    if (!window.localStorage.chessData) {
      window.localStorage.chessData = '{}';
    }
    const chessData = JSON.parse(window.localStorage.chessData);
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    chessData[key] = data;
    window.localStorage.chessData = JSON.stringify(chessData);
  };
  
  export const read = (key) => {
    let result;
    let data;
    try {
      data = JSON.parse(window.localStorage.chessData)[key];
      result = JSON.parse(data);
    } catch (e) {
      result = data || null;
    }
    return result;
  };