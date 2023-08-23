<template>
    <div class="main">
        <el-steps :space="200" :active="0" simple class="step">
            <el-step title="生管申请" icon="Edit" />
            <el-step title="副总审核" icon="SetUp" />
            <el-step title="总经理审核" icon="checked" />
            <el-step title="仓库确认" icon="checked" />
        </el-steps>
        <el-divider />
        <el-form
            :model="materialBackForm"
            label-width="70px"
            class="form"
            :inline="true"
        >
            <el-form-item label="申请人">
                <el-input v-model="materialBackForm.name" disabled />
            </el-form-item>
            <el-form-item label="申请时间">
                <el-input v-model="materialBackForm.create_time" disabled />
            </el-form-item>
        </el-form>
        <el-divider>采购列表</el-divider>
        <div>
            <el-row
                v-for="items in materialBackForm.material_list"
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
                        <el-col :span="6"
                            ><el-select
                                v-model="items.material_id"
                                filterable
                                placeholder="请选择材料"
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
                        <el-col :span="6"
                            ><el-input
                                v-model="items.material_weight"
                                placeholder="请输入重量"
                        /></el-col>
                        <el-col :span="6"
                            ><el-select
                                v-model="items.material_kind"
                                placeholder="请选择材料类别"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in materialKindList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                /> </el-select
                        ></el-col>
                        <el-col :span="6"
                            ><el-select
                                v-model="items.remark"
                                placeholder="请选择备注"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in remarkList"
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
            materialKindList: [
                {
                    value: "0",
                    label: "原料",
                },
                {
                    value: "1",
                    label: "水口料",
                },
            ],
            remarkList: [
                {
                    value: "卖出",
                    label: "卖出",
                },
                {
                    value: "借出",
                    label: "借出",
                },
                {
                    value: "委外生产",
                    label: "委外生产",
                },
                {
                    value: "委外抽粒",
                    label: "委外抽粒",
                },
                {
                    value: "退回",
                    label: "退回",
                },
                {
                    value: "样品送出",
                    label: "样品送出",
                },
            ],
            materialListLength: 0, //材料入库列表长度
            materialNameList: [],

            materialBackForm: {
                name: sessionStorage.getItem("true_name"),
                user_id: sessionStorage.getItem("user_id"),
                role_id: sessionStorage.getItem("role_id"),
                create_time: "",
                material_list: [
                    {
                        id: 0,
                        material_id: ref(""),
                        material_weight: "",
                        material_kind: ref(""),
                        remark: ref(""),
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
            this.materialBackForm.user_id = parseFloat(
                this.materialBackForm.user_id
            );
            this.materialBackForm.role_id = parseFloat(
                this.materialBackForm.role_id
            );
            for (let i = 0; i < this.materialListLength + 1; i++) {
                let item = this.materialBackForm.material_list[i];
                if (
                    item.material_id == "" ||
                    item.material_kind == "" ||
                    item.material_weight == "" ||
                    item.remark == ""
                ) {
                    ElMessage.error("请填写必要信息");
                    return;
                }
                this.materialBackForm.material_list[i].material_weight =
                    parseFloat(
                        this.materialBackForm.material_list[i].material_weight
                    );
                this.materialBackForm.material_list[i].material_kind =
                    parseFloat(
                        this.materialBackForm.material_list[i]
                            .material_kind
                    );
                    this.materialBackForm.material_list[i].material_id =
                    parseFloat(
                        this.materialBackForm.material_list[i]
                            .material_id
                    );
            }
            http({
                url: "/materialOutFactory",
                method: "post",
                data: this.materialBackForm,
            })
                .then((res) => {
                    if (!res.data.code) {
                        ElMessage.error(res.data.msg);
                    } else {
                        ElMessage.success(res.data.msg);
                        this.materialBackForm = {
                            name: sessionStorage.getItem("true_name"),
                            user_id: sessionStorage.getItem("user_id"),
                            create_time: "",
                            material_list: [
                                {
                                    id: 0,
                                    material_id: ref(""),
                                    material_weight: "",
                                    material_kind: ref(""),
                                    remark: ref(""),
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
            this.materialBackForm.material_list[this.materialListLength] = {
                id: this.materialListLength,
                material_name: ref(""),
                material_weight: "",
                material_kind: ref(""),
                remark: ref(""),
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
            this.materialBackForm.create_time =
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
            this.materialBackForm.material_list.pop();
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