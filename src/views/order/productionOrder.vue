<template>
    <div class="main">
        <el-steps :space="200" :active="0" simple class="step">
            <el-step title="生管申请" icon="Edit" />
            <el-step title="品控审核" icon="SetUp" />
            <el-step title="厂长确认" icon="checked" />
        </el-steps>
        <el-divider />
        <el-form
            :model="productionOrderForm"
            label-width="90px"
            class="form"
            :inline="true"
        >
            <el-form-item label="申请人">
                <el-input v-model="productionOrderForm.name" disabled />
            </el-form-item>
            <el-form-item label="申请时间">
                <el-input v-model="productionOrderForm.create_time" disabled />
            </el-form-item>
            <el-form-item label="指令单编号">
                <el-input
                    v-model="productionOrderForm.production_order_id"
                    disabled
                />
            </el-form-item>
            <el-form-item label="客户">
                <el-input
                    v-model="productionOrderForm.custom"
                    placeholder="请输入客户名称"
                />
            </el-form-item>
            <el-form-item label="客户交期">
                <el-input
                    v-model="productionOrderForm.custom_deadline"
                    placeholder="请输入客户交期"
                />
            </el-form-item>
            <el-form-item label="模具编号">
                <el-input
                    v-model="productionOrderForm.mould_name"
                    placeholder="请输入模具编号"
                />
            </el-form-item>
            <el-form-item label="成型周期">
                <el-input
                    v-model="productionOrderForm.molding_cycle"
                    placeholder="请输入成型周期"
                />
            </el-form-item>
        </el-form>
        <el-divider>材料列表</el-divider>
        <div>
            <el-row
                v-for="items in productionOrderForm.material_list"
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
                            >
                            <!-- 
                            <material-choose></material-choose>
                             -->
                            <el-select
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
                        <el-col :span="8"
                            ><el-input
                                v-model="items.material_order_weight"
                                placeholder="请输入指令材料重量"
                        /></el-col>

                        <el-col :span="8"
                            ><el-select
                                v-model="items.material_order_kind"
                                placeholder="请选择材料种类"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in materialKindList"
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
        <el-divider>产品列表</el-divider>
        <div>
            <el-row
                v-for="items in productionOrderForm.production_list"
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
                                v-model="items.product_name"
                                filterable
                                placeholder="请选择产品"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in productNameList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-col>
                        <el-col :span="6"
                            ><el-select
                                v-model="items.if_semi_finished"
                                filterable
                                placeholder="请选择产品类型"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in if_semi_finished"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-col>
                        <el-col :span="6"
                            ><el-input
                                v-model="items.product_weight"
                                placeholder="请输入指令产品净重"
                        /></el-col>

                        <el-col :span="6"
                            ><el-input
                                v-model="items.product_number"
                                placeholder="请输入指令产品数量"
                        /></el-col> </el-row
                ></el-col>
            </el-row>
        </div>
        <el-button type="primary" text @click="addProduct"
            ><el-icon><Plus /></el-icon>添加</el-button
        >
        <el-button type="warning" text @click="deleteProduct"
            ><el-icon><Minus /></el-icon>删除最后一项</el-button
        >

        <el-divider>生产指令单</el-divider>
        请上传指令单，最多上传一张图片
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
        <!-- <el-button
                    style="width: 100%; margin-bottom: 20px"
                    type="primary"
                    size="large"
                    @click="submitForm"
                    >提 交</el-button
                > -->
        <el-row :gutter="20">
            <el-col :span="12">
                <el-button
                    style="width: 100%; margin-bottom: 20px"
                    type="success"
                    size="large"
                    @click="openPrintPreview"
                    >打 印</el-button
                > </el-col
            ><el-col :span="12">
                <el-button
                    style="width: 100%; margin-bottom: 20px"
                    type="primary"
                    size="large"
                    @click="submitForm"
                    >提 交</el-button
                ></el-col
            >
        </el-row>
    </div>
    <el-dialog
        v-model="printDialogVisible"
        title="打印预览｜生产指令单"
        width="1000"
    >
        <div class="print-preview">
            <div id="printArea" class="print-main">
                <div class="title-first">苏州易鑫精密塑胶有限公司</div>
                <div class="title-second">内部生产指令单</div>
                <el-row :gutter="20">
                    <el-col :span="12">生产部门：成型</el-col>
                    <el-col :span="12"
                        >申请人：{{ productionOrderForm.name }}</el-col
                    >
                    <el-col :span="12"
                        >下单日期：{{ productionOrderForm.create_time }}</el-col
                    >
                    <el-col :span="12"
                        >指令编号：{{
                            productionOrderForm.production_order_id
                        }}</el-col
                    >
                </el-row>
                <div class="table-border">
                    <el-table
                        :data="printProductionOrderForm"
                        border
                        style="width: 100%"
                    >
                        <el-table-column prop="custom" label="客户名称" />
                        <el-table-column
                            prop="custom_deadline"
                            label="客户交期"
                        />
                        <el-table-column prop="mould_name" label="磨具编号" />
                        <el-table-column
                            prop="molding_cycle"
                            label="成型周期"
                        />
                    </el-table>
                </div>
                <div class="table-border">
                    <el-table
                        :data="printProductionOrderMaterial"
                        border
                        style="width: 100%"
                    >
                        <el-table-column
                            prop="material_full_name"
                            label="材料名称"
                        />
                        <el-table-column
                            prop="material_kind"
                            label="材料类型"
                        />
                        <el-table-column prop="material_weight" label="重量" />
                    </el-table>
                </div>

                <div class="table-border">
                    <el-table :data="printProductionOrderProduct" border>
                        <el-table-column prop="product_name" label="产品名称" />
                        <el-table-column
                            prop="product_weight"
                            label="产品净重"
                        />
                        <el-table-column
                            prop="product_number"
                            label="产品数量"
                        />
                    </el-table>
                </div>
                <el-row style="margin-top: 10px">
                    <el-col :span="8">作成：王礼娟</el-col>
                    <el-col :span="8">确认：</el-col>
                    <el-col :span="8">核准：</el-col>
                </el-row>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="printDialogVisible = false">取消</el-button>
                <el-button type="primary" v-print="print"> 打印 </el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
  <script>
import http from "../../assets/axios";
import { ElMessage } from "element-plus";
import { ref } from "vue";
export default {
    data() {
        return {
            printDialogVisible: false,
            printProductionOrderProduct: [],
            printProductionOrderMaterial: [],
            printProductionOrderForm: [],
            print: {
                id: "printArea",
                popTitle: "苏州易鑫精密塑胶有限公司｜生产指令单", // 打印配置页上方的标题
                preview: false, // 是否启动预览模式，默认是false
                clickMounted() {
                    // 点击print绑定按钮
                },
                standard: "",
                extarCss: "",
            },
            fileList: [],
            if_semi_finished: [
                {
                    value: "1",
                    label: "半成品",
                },
                {
                    value: "0",
                    label: "成品",
                },
            ],
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
            materialListLength: 0, //材料入库列表长度
            productListLength: 0, //产品列表长度
            materialNameList: [],
            productNameList: [],
            productionOrderForm: {
                role_id: sessionStorage.getItem("role_id"),
                user_id: sessionStorage.getItem("user_id"),
                name: sessionStorage.getItem("true_name"),
                production_order_id: "",
                create_time: "",
                custom: "",
                custom_deadline: "",
                production_order_img: "",
                mould_name: "",
                molding_cycle: "",
                material_list: [
                    {
                        id: 0,
                        material_id: ref(""),
                        material_order_weight: "",
                        material_order_kind: "",
                    },
                ],
                production_list: [
                    {
                        id: 0,
                        product_name: ref(""),
                        product_weight: "",
                        product_number: "",
                        if_semi_finished: ref(""),
                    },
                ],
            },
        };
    },
    created() {
        this.getMaterialNameList();
        this.getProductNameList();
        this.getTime();
    },

    methods: {
        openPrintPreview() {
            this.renderPrintTable();
        },
        renderPrintTable() {
            this.printProductionOrderProduct = [];
            this.printProductionOrderMaterial = [];
            this.printProductionOrderForm = [];
            let tempForm = {
                custom: this.productionOrderForm.custom,
                custom_deadline: this.productionOrderForm.custom_deadline,
                mould_name: this.productionOrderForm.mould_name,
                molding_cycle: this.productionOrderForm.molding_cycle,
            };
            this.printProductionOrderForm[0] = tempForm;

            for (let i = 0; i < this.materialListLength + 1; i++) {
                let tempMaterial = {
                    material_weight: "",
                    material_kind: "",
                    material_full_name: "",
                };
                http({
                    url: "/getMaterialNameById",
                    method: "post",
                    data: {
                        material_id:
                            this.productionOrderForm.material_list[i]
                                .material_id,
                    },
                })
                    .then((res) => {
                        tempMaterial.material_full_name = res.data.data;
                        tempMaterial.material_weight =
                            this.productionOrderForm.material_list[
                                i
                            ].material_order_weight;
                        if (
                            this.productionOrderForm.material_list[i]
                                .material_order_kind == "0"
                        ) {
                            tempMaterial.material_kind = "原料";
                        } else {
                            tempMaterial.material_kind = "水口料";
                        }

                        this.printProductionOrderMaterial[i] = tempMaterial;
                        for (let i = 0; i < this.productListLength + 1; i++) {
                            let tempProduct = {
                                product_name: "",
                                product_weight: "",
                                product_number: "",
                            };
                            tempProduct.product_name =
                                this.productionOrderForm.production_list[
                                    i
                                ].product_name;
                            tempProduct.product_weight =
                                this.productionOrderForm.production_list[
                                    i
                                ].product_weight;
                            tempProduct.product_number =
                                this.productionOrderForm.production_list[
                                    i
                                ].product_number;

                            this.printProductionOrderProduct[i] = tempProduct;
                        }
                        if (
                            this.printProductionOrderMaterial[0]
                                .material_full_name == ""
                        ) {
                            ElMessage.error('材料名称获取失败')
                        } else {
                            this.printDialogVisible = true;
                        }
                    })
                    .catch(function (error) {
                        ElMessage.error(error.message);
                    });
            }
        },
        submitForm() {
            this.productionOrderForm.role_id = parseFloat(
                this.productionOrderForm.role_id
            );
            this.productionOrderForm.user_id = parseFloat(
                this.productionOrderForm.user_id
            );

            if (
                this.productionOrderForm.custom == "" ||
                this.productionOrderForm.mould_name == "" ||
                this.productionOrderForm.molding_cycle == "" ||
                this.productionOrderForm.production_order_img == ""
            ) {
                ElMessage.error("客户、模具编号、成型周期为必填字段");
                return;
            }
            for (let i = 0; i < this.materialListLength + 1; i++) {
                let item = this.productionOrderForm.material_list[i];
                if (
                    item.material_order_weight == "" ||
                    item.material_id == "" ||
                    item.material_order_kind == ""
                ) {
                    ElMessage.error("请填写材料列表必要信息");
                    return;
                }
                this.productionOrderForm.material_list[
                    i
                ].material_order_weight = parseFloat(
                    this.productionOrderForm.material_list[i]
                        .material_order_weight
                );
                this.productionOrderForm.material_list[i].material_order_kind =
                    parseFloat(
                        this.productionOrderForm.material_list[i]
                            .material_order_kind
                    );
                this.productionOrderForm.material_list[i].material_id =
                    parseFloat(
                        this.productionOrderForm.material_list[i].material_id
                    );
            }
            for (let i = 0; i < this.productListLength + 1; i++) {
                let item = this.productionOrderForm.production_list[i];
                if (
                    item.product_weight == "" ||
                    item.product_name == "" ||
                    item.product_number == "" ||
                    item.if_semi_finished == ""
                ) {
                    ElMessage.error("请填写产品列表必要信息");
                    return;
                }
                this.productionOrderForm.production_list[i].product_weight =
                    parseFloat(
                        this.productionOrderForm.production_list[i]
                            .product_weight
                    );
                this.productionOrderForm.production_list[i].product_number =
                    parseFloat(
                        this.productionOrderForm.production_list[i]
                            .product_number
                    );
                this.productionOrderForm.production_list[i].if_semi_finished =
                    parseFloat(
                        this.productionOrderForm.production_list[i]
                            .if_semi_finished
                    );
                console.log(this.productionOrderForm);
            }
            http({
                url: "/makeProductionOrder",
                method: "post",
                data: this.productionOrderForm,
            })
                .then((res) => {
                    if (!res.data.code) {
                        ElMessage.error(res.data.msg);
                    } else {
                        ElMessage.success(res.data.msg);
                        this.productionOrderForm = {
                            role_id: sessionStorage.getItem("role_id"),
                            user_id: sessionStorage.getItem("user_id"),
                            name: sessionStorage.getItem("true_name"),
                            production_order_id: "",
                            create_time: "",
                            custom: "",
                            custom_deadline: "",
                            mould_name: "",
                            molding_cycle: "",
                            production_order_img: "",
                            material_list: [
                                {
                                    id: 0,
                                    material_id: ref(""),
                                    material_order_weight: "",
                                    material_order_kind: "",
                                },
                            ],
                            production_list: [
                                {
                                    id: 0,
                                    product_name: ref(""),
                                    product_weight: "",
                                    product_number: "",
                                    if_semi_finished: ref(""),
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
            this.productionOrderForm.material_list[this.materialListLength] = {
                id: this.materialListLength,
                material_name: ref(""),
                material_order_weight: "",
                material_order_kind: "",
            };
        },
        addProduct() {
            this.productListLength++;
            this.productionOrderForm.production_list[this.productListLength] = {
                id: this.productListLength,
                product_name: ref(""),
                product_weight: "",
                product_number: "",
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
            this.productionOrderForm.create_time =
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
            this.productionOrderForm.production_order_id = Date.now();
        },
        deleteMaterial() {
            this.materialListLength--;
            this.productionOrderForm.material_list.pop();
        },
        getImageUrl(res) {
            this.productionOrderForm.production_order_img = res.data.file_name;
            ElMessage.success(res.msg);
        },
        deleteProduct() {
            this.productListLength--;
            this.productionOrderForm.production_list.pop();
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
        async getProductNameList() {
            await http({
                url: "/getAllProductName",
                method: "get",
            })
                .then((res) => {
                    this.productNameList = res.data.data;
                })
                .catch(function (error) {});
        },
    },
};
</script>
<style scoped>
.print-preview {
    border: 1px solid #d4d7de;
    padding: 20px;
    width: 900px;
}
.print-main {
    width: 900px;
    font-size: 14px;
}
.title-first {
    color: black;
    font-size: 28px;
    font-weight: 900;
    padding: 20px;
    text-align: center;

}
.table-border {
    border: 2px solid #d4d7de;
    margin-top: 20px;
    width: 900px;
}
.title-second {
    text-align: center;
    font-weight: 400;
    font-size: 18px;
    padding: 0 15px 15px 15px;
    
}
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