<template>
    <div style="width: 100%">
        <!-- <el-select
            v-model="chooseMaterialName"
            filterable
            placeholder=""
        >
            <el-option
                v-for="item in materialNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
        <el-button @click="selectMaterial" type="primary">筛 选</el-button>
        <el-button @click="cancelSelectMaterial" text>取消筛选</el-button>
        <el-divider></el-divider> -->
        <el-table :data="materialStock" border style="width: 100%" stripe>
            <el-table-column
                prop="production_order_id"
                label="指令单编号"
                width="150"
            />
            <el-table-column prop="create_time" label="创建日期" width="200" />
            <el-table-column prop="mould_name" label="模具编号" width="150" />
            <el-table-column prop="custom" label="客户" width="100" />
            <el-table-column prop="custom_deadline" label="客户交期" />
            <el-table-column
                prop="quality_confirm"
                label="品控审核"
                width="100"
            >
                <template #default="scope">
                    <el-tag
                        :type="checkType(scope.row.quality_confirm)"
                        disable-transitions
                        effect="dark"
                        >{{ scope.row.quality_confirm }}</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="factory_manager_confirm"
                label="厂长审核"
                width="100"
            >
                <template #default="scope">
                    <el-tag
                        :type="checkType(scope.row.factory_manager_confirm)"
                        disable-transitions
                        effect="dark"
                        >{{ scope.row.factory_manager_confirm }}</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="操作">
                <template #default="scope">
                    <el-button disable-transitions link type="primary" size="small" @click="toApprove(scope.row.production_order_id,scope.row.create_time,'生产指令单申请')">
                        查看详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-dialog
        v-model="productionOrderVisible"
        title="生产指令单"
        :width="1000"
    >
        <el-descriptions style="margin-bottom: 20px" :column="3" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon>
                            <user />
                        </el-icon>
                        申请人
                    </div>
                </template>
                王礼娟
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><AlarmClock /></el-icon>
                        申请时间
                    </div>
                </template>
                {{ data.create_time }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><Memo /></el-icon>
                        指令单编号
                    </div>
                </template>
                {{ data.production_order_id }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><Box /></el-icon>
                        客户名称
                    </div>
                </template>
                {{ data.custom }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><Setting /></el-icon>
                        磨具编号
                    </div>
                </template>
                {{ data.mould_name }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><Notification /></el-icon>
                        成型周期
                    </div>
                </template>
                {{ data.molding_cycle }}
            </el-descriptions-item>
        </el-descriptions>
        <el-divider></el-divider>
        <el-table
            :data="data.material_list"
            border
            style="width: 100%; margin-bottom: 20px"
        >
            <el-table-column prop="material_name" label="材料名称" />
            <el-table-column prop="material_type" label="材料类型" />
            <el-table-column prop="material_color" label="材料颜色" />
            <el-table-column
                prop="material_product_supplier"
                label="生产厂商"
            />
            <el-table-column prop="material_supplier" label="供应商" />
            <el-table-column prop="remark" label="材料备注" />
            <el-table-column prop="material_weight" label="计划使用(kg)" />
        </el-table>
        <el-table
            :data="data.product_list"
            border
            style="width: 100%; margin-bottom: 20px"
        >
            <el-table-column prop="product_name" label="产品名称" />
            <el-table-column prop="product_kind" label="产品类型" />
            <el-table-column prop="product_weight" label="产品净重" />
            <el-table-column prop="product_number" label="产品数量" />
        </el-table>
        <el-image
            :src="'http://127.0.0.1:8000/getImage?url='+data.production_order_img"
            :zoom-rate="1.2"
            :preview-src-list="'http://127.0.0.1:8000/getImage?url='+data.production_order_img"
            fit="cover"
        />

    </el-dialog>
</template>
<script>
import http from "../../assets/axios";
import { ElMessage } from "element-plus";
import { ref } from "vue";
export default {
    data() {
        return {
            materialStock: [],
            allMaterialStock: [],
            materialNameList: [],
            chooseMaterialName: ref(""),
            productionOrderVisible:false,
            data:{}
        };
    },
    created() {
        this.getMaterialNameList();
        this.getMaterialAllStock();
    },
    methods: {
        toApprove(id, createTime, formName) {
            this.productionOrderVisible=true
            let form_id = id;
            http({
                url: "/getApprovalDialogData",
                method: "post",
                data: {
                    form_id: form_id,
                    create_time: createTime,
                    form_name: formName,
                },
            })
                .then((res) => {
                    this.data = res.data.data;
                })
                .catch(function (error) {
                    ElMessage.error(error.message);
                });
        },
        selectMaterial() {
            let length = this.allMaterialStock.length;
            for (let i = 0; i < length; i++) {
                let item = this.allMaterialStock[i];
                if (item.material_id == this.chooseMaterialName) {
                    (this.materialStock = []), this.materialStock.push(item);
                }
            }
        },
        cancelSelectMaterial() {
            this.getMaterialAllStock();
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
        getMaterialAllStock() {
            http({
                url: "/getProductionOrderList",
                method: "get",
            })
                .then((res) => {
                    this.allMaterialStock = res.data.data;
                    this.materialStock = res.data.data;
                })
                .catch(function (error) {
                    ElMessage.error(error.message);
                });
        },
        checkType(value) {
            if (value == "同意") {
                return "success";
            }
            if (value == "拒绝") {
                return "error";
            }
            if (value == "未审核") {
                return "info";
            }
        },
    },
};
</script>