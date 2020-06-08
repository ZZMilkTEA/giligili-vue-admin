import axios from 'axios';

const getNotPassedAudios = (start, limit, token) => axios.get('/api/v1/not-passed-audios',{ params: { start, limit },headers:{'token':token}}).then(res => res.data);

// 读音频详情
const getAudio = (id, token) => axios.get(`/api/v1/review/audios/${id}`, {headers:{'token':token}}).then(res => res.data);

const doReview = (form, id, token) => axios.put(`/api/v1/review/audios/${id}`,form,{headers:{'token':token}}).then(res => res.data);

export {
  getNotPassedAudios,
  getAudio,
  doReview,
};
