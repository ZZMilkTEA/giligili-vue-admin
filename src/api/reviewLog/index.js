import axios from 'axios';

// 创建视频
const listReviewLogs = (start, limit,token) => axios.get('/api/v1/review-logs', {params: { start, limit },headers:{'token':token}}).then(res => res.data);


export{
  listReviewLogs,
}
