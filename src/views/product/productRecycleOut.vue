<template>
    <div class="main">
        <el-steps :space="200" :active="0" simple class="step">
            <el-step title="生产申请" icon="Edit" />
            <el-step title="品控审核" icon="SetUp" />
            <el-step title="仓库确认" icon="checked" />
        </el-steps>
        <el-divider />
        <el-form
            :model="productStorageNormalForm"
            label-width="70px"
            class="form"
            :inline="true"
        >
            <el-form-item label="申请人">
                <el-input v-model="productStorageNormalForm.name" disabled />
            </el-form-item>
            <el-form-item label="申请时间">
                <el-input
                    v-model="productStorageNormalForm.create_time"
                    disabled
                />
            </el-form-item>
            <el-form-item label="指令单号">
                <el-select
                    v-model="productStorageNormalForm.production_order_id"
                    placeholder="请选择指令单号"
                    filterable
                    style="width: 100%"
                    @change="getProductInfo"
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
        <el-divider>产品重工列表</el-divider>
        <div>
            <el-row
                v-for="items in product_order_list"
                :key="items.product_name"
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
                                items.product_name
                            }}</span>
                        </el-col>
                        <el-col :span="3"
                            ><span
                                style="
                                    line-height: 32px;
                                    text-align: center;
                                    width: 100%;
                                "
                                >{{ items.product_kind }}</span
                            ></el-col
                        >
                        <el-col :span="6">
                            <el-input
                                v-model="
                                    productStorageNormalForm.product_list[
                                        items.id - 1
                                    ].product_number
                                "
                                placeholder="请填写需要出货的数量"
                            ></el-input>
                        </el-col>
                        <el-col :span="6"
                            ><span style="line-height: 32px">{{
                                "剩余可重工：" + (items.product_received_number-items.product_shipped_number)
                            }}</span></el-col
                        >
                        <el-col :span="3"
                            ><el-button
                                type="primary"
                                text
                                @click="deleteProduct(items.id)"
                                >删除</el-button
                            ></el-col
                        >
                    </el-row></el-col
                >
            </el-row>
        </div>
        <el-divider>重工出库单</el-divider>
        请上传单据，最多上传一张图片
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
            productionOrderIdList: [],
            fileList: [],
            materialNameList: [],
            productStorageNormalForm: {
                name: sessionStorage.getItem("true_name"),
                user_id: sessionStorage.getItem("user_id"),
                role_id: sessionStorage.getItem("role_id"),
                create_time: "",
                production_order_id: ref(""),
                product_recycle_img: "",
                product_list: [],
            },
            product_order_list: [],
        };
    },
    created() {
        this.getProductionOrderIdList();
        this.getTime();
    },
    methods: {
        submitForm() {
            this.productStorageNormalForm.user_id = parseFloat(
                this.productStorageNormalForm.user_id
            );
            this.productStorageNormalForm.role_id = parseFloat(
                this.productStorageNormalForm.role_id
            );
            if (this.productStorageNormalForm.production_order_id == "") {
                ElMessage.error("请选择生产指令单");
                return;
            }
            if (this.productStorageNormalForm.product_shipment_img == "") {
                ElMessage.error("请上传出货单");
                return;
            }

            for (
                let i = 0;
                i < this.productStorageNormalForm.product_list.length;
                i++
            ) {
                let item = this.productStorageNormalForm.product_list[i];
                if (item.product_number == "") {
                    ElMessage.error("请填需要出货的数量");
                    return;
                }
                this.productStorageNormalForm.product_list[i].product_number =
                    parseFloat(
                        this.productStorageNormalForm.product_list[i]
                            .product_number
                    );
            }
            http({
                url: "productRecycleOut",
                method: "post",
                data: this.productStorageNormalForm,
            })
                .then((res) => {
                    if (!res.data.code) {
                        ElMessage.error(res.data.msg);
                    } else {
                        ElMessage.success(res.data.msg);
                        this.productStorageNormalForm = {
                            name: sessionStorage.getItem("true_name"),
                            user_id: sessionStorage.getItem("user_id"),
                            create_time: "",
                            production_order_id: ref(""),
                            product_recycle_img: "",
                            product_list: [],
                        };
                        this.product_order_list = [];
                        this.productionOrderIdList = [];
                        this.fileList = [];
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
            this.productStorageNormalForm.create_time =
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
        deleteProduct(id) {
            this.product_order_list.splice(id - 1, 1);
            this.productStorageNormalForm.product_list.splice(id - 1, 1);
        },
        getImageUrl(res) {
            this.productStorageNormalForm.product_shipment_img = res.data.file_name;
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
        async getProductInfo() {
            await http({
                url: "/getProductInfoByProductionOrderId",
                method: "post",
                data: {
                    production_order_id:
                        this.productStorageNormalForm.production_order_id,
                },
            })
                .then((res) => {
                    this.product_order_list = res.data.data;
                    let length = res.data.data.length;
                    for (let i = 0; i < length; i++) {
                        let tempObj = {
                            product_name: res.data.data[i].product_name,
                            product_can_storage: "",
                        };
                        this.productStorageNormalForm.product_list[i] = tempObj;
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