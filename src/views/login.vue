<template>
    <div class="main">
        <div class="login-main">
            <div class="logo">
                <div class="logo-all">
                    <span
                        style="font-size: 35px; font-weight: 900; color: black"
                        >苏 州 易 鑫</span
                    ><br /><span style="font-weight: 300; color: black"
                        >精密塑胶有限公司</span
                    >
                </div>
            </div>

            <el-input
                v-model="username"
                type="text"
                placeholder="请输入用户名"
                class="input-box"
                size="large"
            >
            </el-input>

            <el-input
                v-model="password"
                type="password"
                placeholder="请输入密码"
                show-password
                class="input-box"
                size="large"
            />
            <el-button
                size="large"
                color="rgb(27, 69, 178)"
                class="login-button"
                @click="login()"
                >登 陆</el-button
            >
        </div>
    </div>
</template>
<script>
import { ElMessage } from "element-plus";
import http from "../assets/axios";
export default {
    data() {
        return {
            username: "tangaozhong",
            password: "123456",
            privateCheck: true,
        };
    },
    methods: {
        async login() {
            await http({
                url: "/login",
                method: "post",
                data: {
                    username: this.username,
                    password: this.password,
                },
            })
                .then((res) => {
                    if (!res.data.code) {
                        ElMessage.error(res.data.msg);
                    } else {
                        let data = res.data.data;
                        sessionStorage.setItem("role_id", data.role_id);
                        sessionStorage.setItem("username", data.username);
                        sessionStorage.setItem("password", data.password);
                        sessionStorage.setItem("user_id", data.user_id);
                        sessionStorage.setItem("true_name", data.true_name);
                        this.$router.push("/home");
                    }
                })
                .catch(function (error) {
                    ElMessage.error(error.message);
                });
        },
    },
};
</script>
<style scoped>
.divider {
    width: 320px;
    margin: 100px 40px 30px 40px;
}
.main {
    width: 100%;
    height: 100%;
    background-color: white;
    position: fixed;
    background: url(https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png)
        0% 0% / 100% 100%;
}
.login-main {
    position: absolute;
    width: 400px;
    height: 420px;
    border-radius: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: var(--el-box-shadow-dark);
    background-color: whitesmoke;
}
.input-box {
    margin: 0 40px 30px 40px;
    width: 320px;
}
.logo {
    width: 100%;
    height: 170px;
    position: relative;
}
.logo-title {
    float: right;
    font-size: 30px;
    line-height: 30px;
    font-weight: 500;
    font-family: title;
}
.logo-all {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    height: 50px;
    width: 300px;
    text-align: center;
    font-size: 30px;
    font-weight: 600;
}
.login-button {
    width: 320px;
    margin: 15px 40px 0 40px;
}
</style>