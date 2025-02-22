import request from "../request";

/**
 * 获取boards
 * @returns {Promise<Object>}
 */
const getBoards = () => {
    return request.get("/chess/getRecord");
};

/**
 * 上传board
 * @returns {Promise<Object>}
 */
const postBoard = (name, value) => {
    return request.post('/chess/saveRecord', {
      name,
      value
  });
};

/**
 * 删除board
 * @returns {Promise<Object>}
 */
const deleteBoard = (id) => {
    return request.post(`/chess/delete?id=${id}`);
};

const api = {
    getBoards,
    postBoard,
    deleteBoard
};

export default api;

