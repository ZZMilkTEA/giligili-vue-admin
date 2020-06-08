<template>
  <div class="review-video">
    <el-button type="primary" icon="el-icon-back" @click="$router.push('/dashboard/reviewList')">返回</el-button>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>视频信息</span>
      </div>
      <div class="video-info">
        <div>标题：{{video.title}}</div>
        <span>封面:</span><img v-if="video.avatar" :src="video.avatar"><span v-else>无</span>
        <div>视频 ID：{{video.id}}</div>
        <div>视频简介：{{video.info}}</div>
        <div>创建日期：{{video.created_at | moment("YYYY-MM-DD h:mm:ss") }}</div>
        <div>视频地址：{{video.url}}</div>
        <div>被观看次数：{{video.view}}</div>
        <div>投稿人昵称：{{video.user.nickname}}</div>
        <div>投稿人 ID：{{video.user.id}}</div>
        <span style="vertical-align: top">投稿人头像：</span>
        <el-avatar v-if="video.user.avatar" :src="video.user.avatar" :size="100"></el-avatar><span v-else>无</span>
      </div>
    </el-card>
    <div v-if="this.spritePic">
      <h3>视频雪碧图预览：</h3>
      <img class="sprite-pic"  :src="this.spritePic">
    </div>
    <div class="video-header">
      视频播放：
    </div>
    <video-player
      class="video-player-box"
      :options="playerOptions">
    </video-player>

    <el-button class="give-result-button" type="primary" @click="dialogVisible = true">给出结果</el-button>


    <el-dialog
            title="提交结果"
            :visible.sync="dialogVisible"
            width="30%"
    >
      <el-switch
              style="display: block"
              v-model="passed"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="通过"
              inactive-text="不通过">
      </el-switch>

      <el-input
              type="textarea"
              :rows="2"
              show-word-limit
              maxlength="40"
              placeholder="请输入内容"
              v-model="form.remark">
      </el-input>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';
import * as API from '../api/video/';

export default {
  name: 'ReviewVideo',
  data() {
    return {
      video: {},
      dialogVisible: false,
      spritePic:'',
      playerOptions: {
        height: "360",
        width:'720',
        fluid: false,
        autoplay: false,
        preload: 'auto',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: '',
        }],
      },
      passed: false,
      form: {
        status_backward : 'not_passed',
        remark : '',
      },
    };
  },

  watch: {
    passed:function (val) {
      if (val) {
        this.form.status_backward = 'passed';
      } else {
        this.form.status_backward = 'not_passed'
      }
    }
  },

  methods: {
    load() {
      API.getVideo(this.$route.params.id, this.$store.getters.getToken).then((res) => {
        if (res.status > 0) {
          this.$notify({
            title: '读取视频失败',
            message: res.msg,
            type: 'error',
          });
          if (res.status === 40003){
            this.$router.push({name:'Login'})
          }
        } else {
          this.video = res.data;
          this.playerOptions.sources[0].src = this.video.url;
          this.getSpritePic();
        }
      }).catch((error) => {
                this.$notify.error({
                  title: '网路错误，或者服务器宕机',
                  message: error,
                });
      });

    },
    getSpritePic(){
      API.getSpritePic(this.$route.params.id, this.$store.getters.getToken).then((res) => {
        if (res.status > 0) {
          this.$notify({
            title: '读取视频审核图失败',
            message: res.msg,
            type: 'error',
          });
        } else {
          this.spritePic = res.data;
        }
      }).catch((error) => {
        this.$notify.error({
          title: '网路错误，或者服务器宕机',
          message: error,
        });
      });

    },


    onSubmit() {
      API.doReview(this.form, this.video.id, this.$store.getters.getToken).then((res) => {
        if (res.status > 0) {
          this.$notify.error({
            title: '审核失败',
            message: res.msg,
          });
        } else {
          this.$notify({
            title: '审核成功',
            message: '审核成功',
            type: 'success',
          });
          this.dialogVisible = false;
          this.$router.push({name:'ReviewList'})
        }
      }).catch((error) => {
        this.$notify.error({
          title: '网路错误，或者服务器宕机',
          message: error,
        });
      });
    },
  },

  components: {
    videoPlayer,
  },

  beforeMount() {
    this.load();
  },
};
</script>

<style>
  .video-header {
    margin-bottom: 16px;
  }
  .video-header h2{
    margin-bottom: 0;
    font-size: 18px;
    font-weight: 500;
    color: #212121;
    line-height: 26px;
    height: 26px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .video-header {
    margin-top: 1em;
  }

  .video-info {
    color: #111;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    margin-top: 1em;
    width: 60%;
    overflow: auto;
    min-width: 600px;
  }

  .sprite-pic{
    max-width: 70%;
  }

  .video-info {
    line-height: 180%;
  }

  .give-result-button{
    margin-top: 1em;
  }
</style>
