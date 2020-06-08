<template>
    <div class="login">
        <h2>登陆：</h2>
        <el-form ref="form" :model="form" label-width="80px" :label-position=labelPosition>
            <el-form-item label="用户名">
                <el-input v-model="form.user_name"></el-input>
            </el-form-item>

            <el-form-item label="密码">
                <el-input show-password v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">登陆</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import * as API from '../api/user/';
    import Dashboard from "@/components/Dashboard";

    export default {
        name: 'Login',
        data() {
            return {
                labelPosition: 'top',
                form: {
                    user_name: '',
                    password: '',
                },
            };
        },
        methods: {
            onSubmit() {
                API.userLogin(this.form).then((res) => {
                    if (res.status > 0) {
                        this.$notify.error({
                            title: '登陆失败',
                            message: res.msg,
                        });
                    } else {
                        if (res.user.permission >= 1){
                            this.$store.commit('setToken',res.data);
                            this.$store.commit('setUser', res.user);
                            this.$notify({
                                title: '登陆成功',
                                message: '登陆成功，进入仪表盘',
                                type: 'success',
                            });

                            this.$router.push({name:"Dashboard"});
                        }else {
                            this.$notify.error({
                                title: '登陆失败',
                                message: '您的权限不够',
                            });
                        }
                    }
                }).catch((error) => {
                    this.$notify.error({
                        title: '网路错误，或者服务器宕机',
                        message: error,
                    });
                });
            },
        },
    };
</script>

<style>

</style>
