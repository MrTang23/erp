<template>
    <div class="main">
        <el-form :model="personalForm" label-width="100px">
            <el-form-item label="用户名">
                <el-input v-model="personalForm.new_username" size="large"/>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="personalForm.new_password" size="large"/>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="personalForm.true_name" size="large" disabled/>
            </el-form-item>
            <el-form-item label="权限等级">
                <el-input v-model="personalForm.role_id" size="large" disabled/>
            </el-form-item>
            <el-form-item>
      <el-button type="primary" @click="updatePersonalInfo">更新信息</el-button>
    </el-form-item>
        </el-form>
    </div>
</template>
<script>
import http from "../../assets/axios";
import { ElMessage } from "element-plus";
import { ref } from "vue";
export default {
    data() {
        return {
            personalForm: {
                new_username: sessionStorage.getItem('username'),
                new_password: sessionStorage.getItem('password'),
                true_name:sessionStorage.getItem('true_name'),
                user_id: parseFloat(sessionStorage.getItem("user_id")),
                role_id: parseFloat(sessionStorage.getItem("role_id"))
            },
        };
    },
    created() {},
    methods: {
        updatePersonalInfo(){
            http({
                url: "/changeUserInfo",
                method: "post",
                data: this.personalForm,
            })
                .then((res) => {
                    if (!res.data.code) {
                        ElMessage.error(res.data.msg);
                    } else {
                        ElMessage.success(res.data.msg);
                        sessionStorage.setItem('username',this.personalForm.new_username)
                        sessionStorage.setItem('password',this.personalForm.new_password)
                    }
                })
                .catch(function (error) {
                    ElMessage.error(error.message);
                });
        }
    },
};
</script>
<style scoped>
.main {
    width: 100%;
}
</style>