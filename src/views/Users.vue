<template>
    <div id="review">
        <h1>用户列表</h1>
        <span class="ps"> 注：权限数字越大权限越高。0:普通用户  1:审核员</span>
        <el-table :data="users" stripe>
            <el-table-column prop="id" label="用户ID" width="140">
            </el-table-column>
            <el-table-column prop="user_name" label="用户名" width="120">
            </el-table-column>
            <el-table-column prop="nickname" label="昵称" width="120">
            </el-table-column>
            <el-table-column prop="created_at" label="创建日期" width="180" :formatter="timestampToTime">
            </el-table-column>
            <el-table-column label="状态" width="140">
                <template slot-scope="scope">
                    <el-select  v-show="scope.row.show" v-model="scope.row.status">
                        <el-option  value="active"></el-option>
                        <el-option  value="inactive"></el-option>
                        <el-option  value="suspend"></el-option>
                    </el-select>
                    <span v-show="!scope.row.show">{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <el-table-column label="权限" width="100">
                <template slot-scope="scope">
                        <el-select  v-show="scope.row.show" v-model="scope.row.permission">
                            <el-option  value="0"></el-option>
                            <el-option  value="1"></el-option>
                        </el-select>
                    <span v-show="!scope.row.show">{{scope.row.permission}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
            >
                <template slot-scope="scope">
                    <el-button type="primary" @click="edit(scope.$index,scope.row)">{{scope.row.show?'保存':"修改"}}</el-button>
                </template>
            </el-table-column>

        </el-table>

        <div class="block">
            <el-pagination
          c         @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="10"
                    layout="prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import * as API from "../api/user/"

    export default {
        name: 'Users',
        data() {
            return {
                users: [],
                start: 0,
                limit: 10,
                total: 0,
                rawUsers: [],
            }
        },
        methods:{
            edit(index, row){
                if (row.show){
                    let form = {
                        permission: parseInt(row.permission),
                        status: row.status,
                    }
                    API.changeUserInfo(form, row.id, this.$store.getters.getToken).then((res) => {
                        if (res.status > 0) {
                            this.$notify.error({
                                title: '更改失败',
                                message: res.msg,
                            });
                        } else {
                            row.show = !row.show;
                            this.$set(this.users, index, row);
                            this.$notify({
                                title: '更改成功',
                                message: '更改成功',
                                type: 'success',
                            });
                        }
                    })
                } else {
                    row.show = !row.show;
                    this.$set(this.users, index, row);
                }
            },

            load() {
                API.listUsers(this.start, this.limit,this.$store.getters.getToken).then((res) => {
                    this.rawUsers = res.data.items;
                    this.rawUsers.forEach(element =>{
                        element["show"] =false;
                    })
                    this.users = this.rawUsers;
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
                if (date == undefined) {
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
    .ps {
        color: #72767b;
        font-size: 0.7em;
    }
</style>