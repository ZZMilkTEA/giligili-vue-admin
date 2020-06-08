<template>
  <div class="review-audio">
    <el-button type="primary" icon="el-icon-back" @click="$router.push('/dashboard/reviewList')">返回</el-button>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>音频信息</span>
      </div>
      <div class="audio-info">
        <div>标题：{{audio.title}}</div>
        <span>封面:</span><img v-if="audio.avatar" :src="audio.avatar"><span v-else>无</span>
        <div>音频 ID：{{audio.id}}</div>
        <div>音频简介：{{audio.info}}</div>
        <div>创建日期：{{audio.created_at | moment("YYYY-MM-DD h:mm:ss") }}</div>
        <div>音频地址：{{audio.url}}</div>
        <div>被播放次数：{{audio.view}}</div>
        <div>投稿人昵称：{{audio.user.nickname}}</div>
        <div>投稿人 ID：{{audio.user.id}}</div>
        <span style="vertical-align: top">投稿人头像：</span>
        <el-avatar v-if="audio.user.avatar" :src="audio.user.avatar" :size="100"></el-avatar><span v-else>无</span>
      </div>
    </el-card>

    <div class="audio-header">
      音频播放：
    </div>
    <audio :src="audio.url" controls="controls"></audio>

    <el-button class="give-result-button" type="primary" @click="dialogVisible = true">给出结果</el-button>


    <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            class="result-dialog"
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
              class="result-remark"
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
import * as API from '../api/audio/';

export default {
  name: 'LogList',

  data() {
    return {
      audio: {},
      dialogVisible: false,
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
      API.getAudio(this.$route.params.id, this.$store.getters.getToken).then((res) => {
        if (res.status > 0) {
          this.$notify({
            title: '读取音频失败',
            message: res.msg,
            type: 'error',
          });
          if (res.status === 40003){
            this.$router.push({name:'Login'})
          }
        } else {
          this.audio = res.data;
        }
      }).catch((error) => {
                this.$notify.error({
                  title: '网路错误，或者服务器宕机',
                  message: error,
                });
      });

    },


    onSubmit() {
      console.log(this.form);
      API.doReview(this.form, this.audio.id, this.$store.getters.getToken).then((res) => {
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

  beforeMount() {
    this.load();
  },
};
</script>

<style>
  .audio-header {
    margin-bottom: 16px;
  }
  .audio-header h2{
    margin-bottom: 0px;
    font-size: 18px;
    font-weight: 500;
    color: #212121;
    line-height: 26px;
    height: 26px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .audio-header {
    margin-top: 1em;
  }
  .audio-info {
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
    max-width: 1000px;
    min-width: 600px;
    overflow: auto;
  }

  .audio-info {
    line-height: 180%;
  }

  .give-result-button{
    margin-top: 1em;
  }

  .result-dialog .result-remark {
    margin-top: 1em;
  }

  audio {
    display: block;
  }
</style>
