<template>
    <div id="Dashboard">
        <el-container style="width: 100%; border: 1px solid #eee">
            <el-header style="text-align: right; font-size: 12px">
                <img src="@/assets/logo.svg" class="logo"/>
                <span style="float: left;color: white;font-size: 2em" >可视化音影播放网站管理后台</span>
                <el-dropdown @command="handleCommand">
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>我的信息</el-dropdown-item>
                        <el-dropdown-item command="logout">登出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>{{this.showname}}</span>
            </el-header>

            <el-container v-bind:style="{height: mainHeight + 'px'}">
                <el-aside width="200px; bottom: 0;" style="background-color: rgb(238, 241, 246)">
                    <el-menu style="width: 200px" router>
                        <el-menu-item-group>
                            <template slot="title">导航</template>

                            <router-link :to="{name:'ReviewList'}"><el-menu-item>稿件审核</el-menu-item></router-link>
                            <router-link v-if="permission >= 2" :to="{name:'Users'}"><el-menu-item>用户管理</el-menu-item></router-link>
                            <router-link v-if="permission >= 2" :to="{name:'ReportList'}"><el-menu-item>待处理举报信息</el-menu-item></router-link>
                            <router-link v-if="permission >= 2" :to="{name:'LogList'}"><el-menu-item>审核日志</el-menu-item></router-link>


                        </el-menu-item-group>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import * as API from '@/api/user'

    export default {
        name: 'Dashboard',
        data() {
            return {
                mainHeight : window.innerHeight - 80,
                showname : '',
                uid : '',
                permission:''
            }
        },
        methods:{
            //用户昵称、id获取
            getUserInfo: function () {
                API.userTokenGetInfo(this.$store.getters.getToken).then((res) =>{
                    if (res.status === 0){
                        this.permission = res.data.permission;
                        if (this.permission < 1){
                            this.$notify.error({
                                title: '返回登录页',
                                message: '你的权限不够',
                                type: 'warning',
                            });
                            this.$router.push({name:'Login'});
                        }
                        this.$store.commit('setUser',res.data)
                        this.showname = res.data.nickname;
                        this.uid = res.data.user_id;
                    } else {
                        this.$notify.error({
                            title: '返回登录页',
                            message: '获取登陆信息失败',
                        });
                        this.$router.push({name:'Login'});
                    }
                }).catch((error)=>{
                    this.$notify.error({
                        title: '网络错误或服务器宕机，返回登录页',
                        message: error,
                    });
                    this.$router.push({name:'Login'});
                });
            },
            handleCommand(command){
                switch (command) {
                    case 'logout':{
                        this.$store.commit('setToken','');
                        this.$notify({
                            title: '登出成功',
                            message: '登出成功',
                            type: 'success',
                        });
                        this.$router.push({name:'Login'});
                        break;
                    }
                }
            }
        },

        beforeMount() {
            this.getUserInfo();
        }
    }
</script>

<style scoped>
    a {
        text-decoration: none;
    }

    .router-link-active {
        text-decoration: none;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }

    .logo {
        margin-top: 10px;
        width: 15%;
        height: 50%;
        float: left;
    }
</style>