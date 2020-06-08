<template>
    <div id="review">
        <h1>待处理举报信息</h1>
        <el-table
                class="list-table"
                :data="items"
                stripe
        >
            <el-table-column prop="id" label="举报信息ID" width="90">
            </el-table-column>
            <el-table-column prop="created_at"  label="举报时间" width="180" :formatter="timestampToTime">
            </el-table-column>
            <el-table-column prop="reporter_id" label="举报人ID" width="80">
            </el-table-column>
            <el-table-column prop="report_type"  label="举报内容类型" width="110" >
            </el-table-column>
            <el-table-column prop="reported_id" label="举报内容ID" width="120">
            </el-table-column>
            <el-table-column prop="description" label="举报描述" width="400">
            </el-table-column>
            <el-table-column
                    label="操作"
            >
                <template slot-scope="scope">
                    <el-button @click="jumpToObject(scope.row)" type="primary">查看被举报内容</el-button>
                    <el-button @click="handleReport(scope.row.id)" type="primary">已处理</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import * as reportAPI from '../api/report'
    import * as commentAPI from '../api/comment'

    export default {
        name: 'ReviewList',
        data() {
            return {
                items: [],
                start: 0,
                limit: 20,
                total: 0,
                mediaType: 'video',
                form:{

                }
            }
        },

        watch:{
          mediaType: function () {
              this.load();
          }
        },

        methods: {
            load() {
                    reportAPI.listPendingReport(this.start, this.limit, this.$store.getters.getToken).then((res) => {
                        this.items = res.data.items;
                        this.total = res.data.total;
                    });
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },

            handleCurrentChange(val) {
                this.start = this.limit * (val - 1); // val 页面
                this.load();
            },

            jumpToObject(row){
                if (row.report_type === 'video'){
                    window.open(process.env.VUE_APP_MAIN_SITE + "#/video/" + row.reported_id);
                }
                if (row.report_type === 'audio'){
                    window.open(process.env.VUE_APP_MAIN_SITE + "#/audio/" + row.reported_id);
                }
                if (row.report_type === 'user'){
                    window.open(process.env.VUE_APP_MAIN_SITE + "#/user/" + row.reported_id);
                }
                if (row.report_type === 'comment'){
                    commentAPI.getCommentById(row.reported_id).then((res)=>{
                        if (res.status !== 0){
                            this.this.$notify.error({
                                title:"未获取到该评论信息",
                                msg:res.error,
                            })
                        } else {
                            if (res.data.media_type === 'video'){
                                window.open(process.env.VUE_APP_MAIN_SITE + "#/video/" + res.data.media_id);
                            }
                            if (res.data.media_type === 'audio'){
                                window.open(process.env.VUE_APP_MAIN_SITE + "#/audio/" + res.data.media_id);
                            }
                        }
                    })
                }
            },
            handleReport(id){
                let form = {
                    status_backward:"handled",
                }
                reportAPI.handleReport(form, id, this.$store.getters.getToken).then(res =>{
                    if (res.status === 0){
                        this.$notify({
                            title:"举报处理成功",
                            msg:"该举报已被成功处理",
                            type: 'success',
                        })
                        this.load();
                    } else {
                        this.$notify.error({
                            title:"举报处理失败",
                            msg:res.error,
                        })
                    }
                }).catch((error) => {
                        this.$notify.error({
                            title: '网路错误，或者服务器宕机',
                            message: error,
                        });
                });
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