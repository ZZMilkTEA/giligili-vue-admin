import axios from 'axios';


// 获取评论
const getCommentById = (id) => axios.get(`/api/v1/comments/${id}`, ).then(res => res.data);

export {
  getCommentById
};
