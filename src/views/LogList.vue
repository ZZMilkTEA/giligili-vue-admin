<template>
    <div id="review">
        <h1>审核日志</h1>
        <el-table
                class="list-table"
                :data="items"
                stripe
        >
            <el-table-column prop="id" label="审核日志ID" width="90">
            </el-table-column>
            <el-table-column prop="created_at"  label="审核时间" width="180" :formatter="timestampToTime">
            </el-table-column>
            <el-table-column prop="reviewer_id"  label="审核人ID" width="180">
            </el-table-column>
            <el-table-column prop="media_type" label="内容类型" width="80">
                <template scope="scope">
                    <span v-if="scope.row.media_type === 'video'" style="color:cornflowerblue">{{ scope.row.media_type }}</span>
                    <span v-else style="color: palevioletred">{{ scope.row.media_type }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="media_id"  label="内容ID" width="110" >
            </el-table-column>
            <el-table-column prop="status_forward" label="前状态" width="120">
                <template scope="scope">
                    <span v-if="scope.row.status_forward === 'pending_review'" style="color:sandybrown">{{ scope.row.status_forward }}</span>
                    <span v-else-if="scope.row.status_forward === 'passed'" style="color:green">{{ scope.row.status_forward }}</span>
                    <span v-else style="color: red">{{ scope.row.status_forward }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status_backward" label="后状态" width="120">
                <template scope="scope">
                    <span v-if="scope.row.status_backward === 'pending_review'" style="color:sandybrown">{{ scope.row.status_backward }}</span>
                    <span v-else-if="scope.row.status_backward === 'passed'" style="color:green">{{ scope.row.status_backward }}</span>
                    <span v-else style="color: red">{{ scope.row.status_backward }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import * as API from '../api/reviewLog'

    export default {
        name: 'Logs',
        data() {
            return {
                items: [],
                start: 0,
                limit: 20,
                total: 0,
            }
        },


        methods: {
            load() {
                    API.listReviewLogs(this.start, this.limit, this.$store.getters.getToken).then((res) => {
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