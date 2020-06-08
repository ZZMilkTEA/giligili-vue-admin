import axios from 'axios';
import '../axios';

const getNotPassedVideos = (start, limit, token) => axios.get('/api/v1/not-passed-videos',{ params: { start, limit },headers:{'token':token}}).then(res => res.data);

// 读视频详情
const getVideo = (id, token) => axios.get(`/api/v1/review/videos/${id}`, {headers:{'token':token}}).then(res => res.data);

const doReview = (form, id, token) => axios.put(`/api/v1/review/videos/${id}`,form,{headers:{'token':token}}).then(res => res.data);

const getSpritePic = (id, token) => axios.get(`/api/v1/videos/${id}/sprite`,{headers:{'token':token}}).then(res => res.data);
export {
  getNotPassedVideos,
  getVideo,
  doReview,
  getSpritePic,
};
