<template>
    <div class="main">
        <el-steps :space="200" :active="0" simple class="step">
            <el-step title="生管申请" icon="Edit" />
            <el-step title="品控审核" icon="SetUp" />
            <el-step title="仓库确认" icon="checked" />
        </el-steps>
        <el-divider />
        <el-form
            :model="materialPurchaseForm"
            label-width="70px"
            class="form"
            :inline="true"
        >
            <el-form-item label="申请人">
                <el-input v-model="materialPurchaseForm.name" disabled />
            </el-form-item>
            <el-form-item label="申请时间">
                <el-input v-model="materialPurchaseForm.create_time" disabled />
            </el-form-item>
        </el-form>
        <el-divider>采购列表</el-divider>
        <div>
            <el-row
                v-for="items in materialPurchaseForm.material_list"
                :key="items.id"
                style="margin-bottom: 20px"
            >
                <el-col :span="1"
                    ><span style="line-height: 32px">{{
                        items.id + 1
                    }}</span></el-col
                >
                <el-col :span="23">
                    <el-row :gutter="20">
                        <el-col :span="8"
                            ><el-select
                                v-model="items.material_id"
                                filterable
                                placeholder="请选择原料"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in materialNameList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-col>
                        <el-col :span="8"
                            ><el-input
                                v-model="items.material_weight"
                                placeholder="请输入重量"
                        /></el-col>

                        <el-col :span="8"
                            ><el-select
                                v-model="items.material_from"
                                placeholder="请选择来源"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in materialFromList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                /> </el-select
                        ></el-col> </el-row
                ></el-col>
            </el-row>
        </div>
        <el-button type="primary" text @click="addMaterial"
            ><el-icon><Plus /></el-icon>添加</el-button
        >
        <el-button type="warning" text @click="deleteMaterial"
            ><el-icon><Minus /></el-icon>删除最后一项</el-button
        >
        <el-divider>送货单</el-divider>
        请上传送货单，最多上传一张图片
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
import http from "../../assets/axios";
import { ElMessage } from "element-plus";
import { ref } from "vue";
export default {
    data() {
        return {
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
            materialListLength: 0, //材料入库列表长度
            materialNameList: [],
            materialPurchaseForm: {
                name: sessionStorage.getItem("true_name"),
                user_id: sessionStorage.getItem("user_id"),
                role_id: sessionStorage.getItem("role_id"),
                create_time: "",
                delivery_note_img: "",
                material_list: [
                    {
                        id: 0,
                        material_id: ref(""),
                        material_weight: "",
                        material_from: ref(""),
                    },
                ],
            },
        };
    },
    created() {
        this.getMaterialNameList();
        this.getTime();
    },
    methods: {
        submitForm() {
            this.materialPurchaseForm.user_id = parseFloat(
                this.materialPurchaseForm.user_id
            );
            this.materialPurchaseForm.role_id = parseFloat(
                this.materialPurchaseForm.role_id
            );
            if (this.materialPurchaseForm.delivery_note_img == "") {
                ElMessage.error("请上传送货单");
                return;
            }
            for (let i = 0; i < this.materialListLength + 1; i++) {
                let item = this.materialPurchaseForm.material_list[i];
                if (
                    item.material_from == "" ||
                    item.material_id == "" ||
                    item.material_weight == ""
                ) {
                    ElMessage.error("请填写必要信息");
                    return;
                }
                this.materialPurchaseForm.material_list[i].material_weight =
                    parseFloat(
                        this.materialPurchaseForm.material_list[i]
                            .material_weight
                    );
                this.materialPurchaseForm.material_list[i].material_id =
                    parseFloat(
                        this.materialPurchaseForm.material_list[i].material_id
                    );
            }
            http({
                url: "/materialPurchase",
                method: "post",
                data: this.materialPurchaseForm,
            })
                .then((res) => {
                    if (!res.data.code) {
                        ElMessage.error(res.data.msg);
                    } else {
                        ElMessage.success(res.data.msg);
                        this.materialPurchaseForm = {
                            name: sessionStorage.getItem("true_name"),
                            user_id: sessionStorage.getItem("user_id"),
                            create_time: "",
                            delivery_note_img: "",
                            material_list: [
                                {
                                    id: 0,
                                    material_id: ref(""),
                                    material_weight: "",
                                    material_from: ref(""),
                                },
                            ],
                        };
                        this.getTime();
                    }
                })
                .catch(function (error) {
                    ElMessage.error(error.message);
                });
        },
        addMaterial() {
            this.materialListLength++;
            this.materialPurchaseForm.material_list[this.materialListLength] = {
                id: this.materialListLength,
                material_name: ref(""),
                material_weight: "",
                material_supplier: "",
                material_from: ref(""),
            };
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
            this.materialPurchaseForm.create_time =
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
        deleteMaterial() {
            this.materialListLength--;
            this.materialPurchaseForm.material_list.pop();
        },
        getImageUrl(res) {
            this.materialPurchaseForm.delivery_note_img = res.data.file_name;
            ElMessage.success(res.msg);
        },
        async getMaterialNameList() {
            await http({
                url: "/getAllMaterialName",
                method: "get",
            })
                .then((res) => {
                    this.materialNameList = res.data.data;
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