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

/**
 * 获取AI对棋局的评论和预测
 * @param {Array} moves - 棋局移动记录
 * @returns {Promise<Object>}
 */
const getAIAnalysis = (moves) => {
    return request.post('/chess/analyze', {
        moves
    });
};

const api = {
    getBoards,
    postBoard,
    deleteBoard,
    getAIAnalysis
};

export default api;

