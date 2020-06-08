<template>
    <div id="review">
        <h1>审核页面</h1>

            <el-radio-group v-model="mediaType">
                <el-radio label="video">视频</el-radio>
                <el-radio label="audio">音频</el-radio>
            </el-radio-group>
        <el-table
                class="list-table"
                :data="items"
                stripe
        >
            <el-table-column prop="id" label="媒体ID" width="140">
            </el-table-column>
            <el-table-column prop="title" label="媒体标题" width="120">
            </el-table-column>
            <el-table-column prop="created_at"  label="投稿日期" width="180" :formatter="timestampToTime">
            </el-table-column>
            <el-table-column prop="user.id" label="投稿人ID" width="120">
            </el-table-column>
            <el-table-column
                    label="操作"
            >
                <template slot-scope="scope">
                    <el-button @click="jumpToReview(scope.row.id)" type="primary">查看稿件</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import * as videoAPI from '../api/video/'
    import * as audioAPI from '../api/audio/'

    export default {
        name: 'ReviewList',
        data() {
            return {
                items: [],
                start: 0,
                limit: 10,
                total: 0,
                mediaType: 'video',
            }
        },

        watch:{
          mediaType: function () {
              this.load();
          }
        },

        methods: {
            load() {
                if (this.mediaType === 'video'){
                    videoAPI.getNotPassedVideos(this.start, this.limit, this.$store.getters.getToken).then((res) => {
                        this.items = res.data.items;
                        this.total = res.data.total;
                    });
                } else {
                    audioAPI.getNotPassedAudios(this.start, this.limit, this.$store.getters.getToken).then((res) => {
                        this.items = res.data.items;
                        this.total = res.data.total;
                    });
                }
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },

            handleCurrentChange(val) {
                this.start = this.limit * (val - 1); // val 页面
                this.load();
            },

            jumpToReview(id){
                if (this.mediaType === 'video'){
                    this.$router.push({name:'ReviewVideo', params:{id: id}});
                } else {
                    this.$router.push({name:'ReviewAudio', params:{id: id}});
                }

            },

            // 时间戳转换成时间
            // 使用element table组件中的formatter属性，传入一个函数
            timestampToTime (row, column) {
                let date = row[column.property]*1000;
                if (date === undefined) {
                    return "";
                }

                var moment = require("moment");

                return moment(date).format("YYYY-MM-DD HH:mm:ss");
            },

        },

        beforeMount() {
            this.load();
        },
    }
</script>

<style scoped>
    .list-table {
        margin-top: 1em;
    }
</style>