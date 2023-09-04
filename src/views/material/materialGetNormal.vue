<template>
    <div class="main">
        <el-steps :space="200" :active="0" simple class="step">
            <el-step title="生产申请" icon="Edit" />
            <el-step title="厂长审核" icon="SetUp" />
            <el-step title="仓库确认" icon="checked" />
        </el-steps>
        <el-divider />
        <el-form
            :model="materialGetNormalForm"
            label-width="70px"
            class="form"
            :inline="true"
        >
            <el-form-item label="申请人">
                <el-input v-model="materialGetNormalForm.name" disabled />
            </el-form-item>
            <el-form-item label="申请时间">
                <el-input
                    v-model="materialGetNormalForm.create_time"
                    disabled
                />
            </el-form-item>
            <el-form-item label="指令单号">
                <el-select
                    v-model="materialGetNormalForm.production_order_id"
                    placeholder="请选择指令单号"
                    filterable
                    style="width: 100%"
                    @change="getMaterialInfo"
                >
                    <el-option
                        v-for="item in productionOrderIdList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <el-divider>领取列表</el-divider>
        <div>
            <el-row
                v-for="items in material_order_list"
                :key="items.material_name"
                style="margin-bottom: 20px"
            >
                <el-col :span="1"
                    ><span style="line-height: 32px">{{
                        items.id
                    }}</span></el-col
                >
                <el-col :span="23">
                    <el-row :gutter="20">
                        <el-col :span="6"
                            ><span style="line-height: 32px">{{
                                items.material_name
                            }}</span>
                        </el-col>
                        <el-col :span="3"
                            ><span
                                style="
                                    line-height: 32px;
                                    text-align: center;
                                    width: 100%;
                                "
                                >{{ items.material_kind }}</span
                            ></el-col
                        >
                        <el-col :span="6">
                            <el-input
                                v-model="
                                    materialGetNormalForm.material_list[
                                        items.id - 1
                                    ].material_weight
                                "
                                placeholder="请填写需要领取的重量"
                            ></el-input>
                        </el-col>
                        <el-col :span="6"
                            ><span style="line-height: 32px">{{
                                "剩余可领取：" +
                                items.material_can_get +
                                "kg"
                            }}</span></el-col
                        >
                        <el-col :span="3"
                            ><el-button
                                type="primary"
                                text
                                @click="deleteMaterial(items.id)"
                                >删除</el-button
                            ></el-col
                        >
                    </el-row></el-col
                >
            </el-row>
        </div>
        <el-divider>领料单</el-divider>
        请上传领料单，最多上传一张图片
        <el-upload
            v-model:file-list="fileList"
            action="http://127.0.0.1:8000/imgUpload"
            list-type="picture-card"
            :on-success="getImageUrl"
            :limit="1"
            class="upload"
        >
            <el-icon><Plus /></el-icon>
        </el-upload>
        <el-divider></el-divider>
        <el-button
            style="width: 100%; margin-bottom: 20px"
            type="primary"
            size="large"
            @click="submitForm"
            >提 交</el-button
        >
    </div>
</template>
  
  <script>
import { Delete } from "@element-plus/icons-vue";
import http from "../../assets/axios";
import { ElMessage } from "element-plus";
import { ref } from "vue";
export default {
    data() {
        return {
            productionOrderIdList: [],
            fileList: [],
            materialFromList: [
                {
                    value: "采购",
                    label: "采购",
                },
                {
                    value: "客供",
                    label: "客供",
                },
                {
                    value: "归还",
                    label: "归还",
                },
                {
                    value: "抽粒",
                    label: "抽粒",
                },
                {
                    value: "借入",
                    label: "借入",
                },
            ],
            materialNameList: [],
            materialGetNormalForm: {
                name: sessionStorage.getItem("true_name"),
                user_id: sessionStorage.getItem("user_id"),
                role_id: sessionStorage.getItem("role_id"),
                create_time: "",
                production_order_id: ref(""),
                material_get_img: "",
                material_list: [],
            },
            material_order_list: [],
        };
    },
    created() {
        this.getProductionOrderIdList();
        this.getTime();
    },
    methods: {
        submitForm() {
            this.materialGetNormalForm.user_id = parseFloat(
                this.materialGetNormalForm.user_id
            );
            this.materialGetNormalForm.role_id = parseFloat(
                this.materialGetNormalForm.role_id
            );
            if (this.materialGetNormalForm.production_order_id == "") {
                ElMessage.error("请选择生产指令单");
                return;
            }
            if (this.materialGetNormalForm.material_get_img == "") {
                ElMessage.error("请上传领料单");
                return;
            }
            
            for (
                let i = 0;
                i < this.materialGetNormalForm.material_list.length;
                i++
            ) {
                let item = this.materialGetNormalForm.material_list[i];
                if (item.material_weight == "") {
                    ElMessage.error("请填需要领取材料的数量");
                    return;
                }
                this.materialGetNormalForm.material_list[i].material_weight =
                    parseFloat(
                        this.materialGetNormalForm.material_list[i]
                            .material_weight
                    );
                this.materialGetNormalForm.material_list[i].material_id =
                    parseFloat(
                        this.materialGetNormalForm.material_list[i].material_id
                    );
            }
            http({
                url: "/materialGetNormal",
                method: "post",
                data: this.materialGetNormalForm,
            })
                .then((res) => {
                    if (!res.data.code) {
                        ElMessage.error(res.data.msg);
                    } else {
                        ElMessage.success(res.data.msg);
                        this.materialGetNormalForm = {
                            name: sessionStorage.getItem("true_name"),
                            user_id: sessionStorage.getItem("user_id"),
                            create_time: "",
                            production_order_id: ref(""),
                            material_get_img: "",
                            material_list: [],
                        };
                        this.material_order_list=[]
                        this.productionOrderIdList= []
                        this.fileList=[]
                        this.getTime();
                    }
                })
                .catch(function (error) {
                    ElMessage.error(error.message);
                });
        },
        getTime() {
            let time = new Date();
            let year = time.getFullYear();
            let month =
                time.getMonth() + 1 < 10
                    ? "0" + (time.getMonth() + 1)
                    : time.getMonth() + 1; //月份
            let day =
                time.getDate() < 10 ? "0" + time.getDate() : time.getDate(); //日
            let hour =
                time.getHours() < 10 ? "0" + time.getHours() : time.getHours(); //小时
            let min =
                time.getMinutes() < 10
                    ? "0" + time.getMinutes()
                    : time.getMinutes(); //分
            let second =
                time.getSeconds() < 10
                    ? "0" + time.getSeconds()
                    : time.getSeconds(); //秒
            this.materialGetNormalForm.create_time =
                year +
                "-" +
                month +
                "-" +
                day +
                " " +
                hour +
                ":" +
                min +
                ":" +
                second;
        },
        deleteMaterial(id) {
            this.material_order_list.splice(id - 1, 1);
            this.materialGetNormalForm.material_list.splice(id - 1, 1);
        },
        getImageUrl(res) {
            this.materialGetNormalForm.material_get_img = res.data.file_name;
            ElMessage.success(res.msg);
        },
        async getProductionOrderIdList() {
            await http({
                url: "/getAllProductionOrderId",
                method: "get",
            })
                .then((res) => {
                    this.productionOrderIdList = res.data.data;
                })
                .catch(function (error) {});
        },
        async getMaterialInfo() {
            await http({
                url: "/getMaterialInfoByProductionOrderId",
                method: "post",
                data: {
                    production_order_id:
                        this.materialGetNormalForm.production_order_id,
                },
            })
                .then((res) => {
                    this.material_order_list = res.data.data;
                    let length = res.data.data.length;
                    for (let i = 0; i < length; i++) {
                        let tempObj = {
                            material_id: res.data.data[i].material_id,
                            material_weight: "",
                        };
                        this.materialGetNormalForm.material_list[i] = tempObj;
                    }
                })
                .catch(function (error) {});
        },
    },
};
</script>
<style scoped>
.main {
    width: 100%;
}
.step {
    margin-bottom: 20px;
}
.form {
    width: 100%;
}
.upload {
    margin-top: 20px;
}
</style>