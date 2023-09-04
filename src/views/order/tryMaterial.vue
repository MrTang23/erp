<template>
    <div class="main">
        <el-steps :space="200" :active="0" simple class="step">
            <el-step title="生管申请" icon="Edit" />
            <el-step title="副总审核" icon="SetUp" />
            <el-step title="仓库确认" icon="checked" />
        </el-steps>
        <el-divider />
        <el-form
            :model="MaterialTestOrderForm"
            label-width="90px"
            class="form"
            :inline="true"
        >
            <el-form-item label="申请人">
                <el-input v-model="MaterialTestOrderForm.name" disabled />
            </el-form-item>
            <el-form-item label="申请时间">
                <el-input
                    v-model="MaterialTestOrderForm.create_time"
                    disabled
                />
            </el-form-item>
            <el-form-item label="试料单编号">
                <el-input
                    v-model="MaterialTestOrderForm.material_test_order_id"
                    disabled
                />
            </el-form-item>

            <el-form-item label="客户">
                <el-input
                    v-model="MaterialTestOrderForm.custom"
                    placeholder="请输入客户名称"
                />
            </el-form-item>
            <el-form-item label="机种名">
                <el-input
                    v-model="MaterialTestOrderForm.machine_name"
                    placeholder="请输入机种名"
                />
            </el-form-item>
            <el-form-item label="模具编号">
                <el-input
                    v-model="MaterialTestOrderForm.mould_name"
                    placeholder="请输入模具编号"
                />
            </el-form-item>
        </el-form>

        <el-input
            v-model="MaterialTestOrderForm.test_reason"
            maxlength="100"
            placeholder="请输入试料原因"
            show-word-limit
            type="textarea"
        />
        <el-divider>材料列表</el-divider>
        <div>
            <el-row
                v-for="items in MaterialTestOrderForm.material_list"
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
                        <el-col :span="8">
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
                        ></el-col>
                        <el-col :span="8"
                            ><el-input
                                v-model="items.material_order_weight"
                                placeholder="请输入计划使用材料重量"
                        /></el-col> </el-row
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
                v-for="items in MaterialTestOrderForm.production_list"
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
                        <el-col :span="8"
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

                        <el-col :span="8"
                            ><el-input
                                v-model="items.product_number"
                                placeholder="请输入计划产品数量"
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

        <el-divider>试料指令单</el-divider>
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
        <el-button
                    style="width: 100%; margin-bottom: 20px"
                    type="primary"
                    size="large"
                    @click="submitForm"
                    >提 交</el-button
                >
        <!-- <el-row :gutter="20">
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
        </el-row> -->
    </div>
    <el-dialog
        v-model="printDialogVisible"
        title="打印预览｜试料指令单"
        width="1000"
    >
        <div class="print-preview">
            <div id="printArea" class="print-main">
                <div class="title-first">苏州易鑫精密塑胶有限公司</div>
                <div class="title-second">试料指令单</div>
                <el-row :gutter="20">
                    <el-col :span="12">生产部门：成型</el-col>
                    <el-col :span="12"
                        >申请人：{{ MaterialTestOrderForm.name }}</el-col
                    >
                    <el-col :span="12"
                        >下单日期：{{
                            MaterialTestOrderForm.create_time
                        }}</el-col
                    >
                    <el-col :span="12"
                        >指令编号：{{
                            MaterialTestOrderForm.material_test_order_id
                        }}</el-col
                    >
                </el-row>
                <div class="table-border">
                    <el-table
                        :data="printMaterialTestOrderForm"
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
                        :data="printMaterialTestOrderMaterial"
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
                    <el-table :data="printMaterialTestOrderProduct" border>
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
            printMaterialTestOrderProduct: [],
            printMaterialTestOrderMaterial: [],
            printMaterialTestOrderForm: [],
            print: {
                id: "printArea",
                popTitle: "苏州易鑫精密塑胶有限公司｜试料指令单", // 打印配置页上方的标题
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
            MaterialTestOrderForm: {
                role_id: sessionStorage.getItem("role_id"),
                user_id: sessionStorage.getItem("user_id"),
                name: sessionStorage.getItem("true_name"),
                material_test_order_id: "",
                create_time: "",
                custom: "",
                machine_name: "",
                material_test_order_img: "",
                mould_name: "",
                test_reason: "",
                material_list: [
                    {
                        id: 0,
                        material_id: ref(""),
                        material_order_weight: "",
                        material_order_kind: ref(""),
                    },
                ],
                production_list: [
                    {
                        id: 0,
                        product_name: ref(""),
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
            this.printMaterialTestOrderProduct = [];
            this.printMaterialTestOrderMaterial = [];
            this.printMaterialTestOrderForm = [];
            let tempForm = {
                custom: this.MaterialTestOrderForm.custom,
                custom_deadline: this.MaterialTestOrderForm.custom_deadline,
                mould_name: this.MaterialTestOrderForm.mould_name,
                molding_cycle: this.MaterialTestOrderForm.molding_cycle,
            };
            this.printMaterialTestOrderForm[0] = tempForm;

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
                            this.MaterialTestOrderForm.material_list[i]
                                .material_id,
                    },
                })
                    .then((res) => {
                        tempMaterial.material_full_name = res.data.data;
                        tempMaterial.material_weight =
                            this.MaterialTestOrderForm.material_list[
                                i
                            ].material_test_order_weight;
                        if (
                            this.MaterialTestOrderForm.material_list[i]
                                .material_test_order_kind == "0"
                        ) {
                            tempMaterial.material_kind = "原料";
                        } else {
                            tempMaterial.material_kind = "水口料";
                        }

                        this.printMaterialTestOrderMaterial[i] = tempMaterial;
                        for (let i = 0; i < this.productListLength + 1; i++) {
                            let tempProduct = {
                                product_name: "",
                                product_weight: "",
                                product_number: "",
                            };
                            tempProduct.product_name =
                                this.MaterialTestOrderForm.production_list[
                                    i
                                ].product_name;
                            tempProduct.product_weight =
                                this.MaterialTestOrderForm.production_list[
                                    i
                                ].product_weight;
                            tempProduct.product_number =
                                this.MaterialTestOrderForm.production_list[
                                    i
                                ].product_number;

                            this.printMaterialTestOrderProduct[i] = tempProduct;
                        }
                        if (
                            this.printMaterialTestOrderMaterial[0]
                                .material_full_name == ""
                        ) {
                            ElMessage.error("材料名称获取失败");
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
            console.log(this.MaterialTestOrderForm)
            this.MaterialTestOrderForm.role_id = parseFloat(
                this.MaterialTestOrderForm.role_id
            );
            this.MaterialTestOrderForm.user_id = parseFloat(
                this.MaterialTestOrderForm.user_id
            );

            if (
                this.MaterialTestOrderForm.custom == "" ||
                this.MaterialTestOrderForm.mould_name == "" 
            ) {
                ElMessage.error("客户、模具编号等为必填字段");
                return;
            }
            for (let i = 0; i < this.materialListLength + 1; i++) {
                let item = this.MaterialTestOrderForm.material_list[i];
                if (
                    item.material_order_weight == "" ||
                    item.material_id == "" ||
                    item.material_order_kind == ""
                ) {
                    ElMessage.error("请填写材料列表必要信息");
                    return;
                }
                this.MaterialTestOrderForm.material_list[
                    i
                ].material_order_weight = parseFloat(
                    this.MaterialTestOrderForm.material_list[i]
                        .material_order_weight
                );
                this.MaterialTestOrderForm.material_list[
                    i
                ].material_order_kind = parseFloat(
                    this.MaterialTestOrderForm.material_list[i]
                        .material_order_kind
                );
                this.MaterialTestOrderForm.material_list[i].material_id =
                    parseFloat(
                        this.MaterialTestOrderForm.material_list[i].material_id
                    );
            }
            for (let i = 0; i < this.productListLength + 1; i++) {
                let item = this.MaterialTestOrderForm.production_list[i];
                if (
                    item.product_name == "" ||
                    item.product_number == "" ||
                    item.if_semi_finished == ""
                ) {
                    ElMessage.error("请填写产品列表必要信息");
                    return;
                }
                this.MaterialTestOrderForm.production_list[i].product_weight =
                    this.MaterialTestOrderForm.production_list[
                        i
                    ].product_number = parseFloat(
                        this.MaterialTestOrderForm.production_list[i]
                            .product_number
                    );
                this.MaterialTestOrderForm.production_list[i].if_semi_finished =
                    parseFloat(
                        this.MaterialTestOrderForm.production_list[i]
                            .if_semi_finished
                    );
                console.log(this.MaterialTestOrderForm);
            }
            http({
                url: "/makeMaterialTestOrder",
                method: "post",
                data: this.MaterialTestOrderForm,
            })
                .then((res) => {
                    if (!res.data.code) {
                        ElMessage.error(res.data.msg);
                    } else {
                        ElMessage.success(res.data.msg);
                        this.MaterialTestOrderForm = {
                            role_id: sessionStorage.getItem("role_id"),
                            user_id: sessionStorage.getItem("user_id"),
                            name: sessionStorage.getItem("true_name"),
                            material_test_order_id: "",
                            create_time: "",
                            custom: "",
                            machine_name: "",
                            material_test_order_img: "",
                            mould_name: "",
                            test_reason: "",
                            material_list: [
                                {
                                    id: 0,
                                    material_id: ref(""),
                                    material_order_weight: "",
                                    material_order_kind: ref(""),
                                },
                            ],
                            production_list: [
                                {
                                    id: 0,
                                    product_name: ref(""),
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
            this.MaterialTestOrderForm.material_list[this.materialListLength] =
                {
                    id: this.materialListLength,
                    material_name: ref(""),
                    material_test_order_weight: "",
                    material_test_order_kind: "",
                };
        },
        addProduct() {
            this.productListLength++;
            this.MaterialTestOrderForm.production_list[this.productListLength] =
                {
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
            this.MaterialTestOrderForm.create_time =
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
            this.MaterialTestOrderForm.material_test_order_id = Date.now();
        },
        deleteMaterial() {
            this.materialListLength--;
            this.MaterialTestOrderForm.material_list.pop();
        },
        getImageUrl(res) {
            this.MaterialTestOrderForm.material_test_order_img =
                res.data.file_name;
            ElMessage.success(res.msg);
        },
        deleteProduct() {
            this.productListLength--;
            this.MaterialTestOrderForm.production_list.pop();
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