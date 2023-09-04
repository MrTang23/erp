<template>
    <div style="width: 100%">
        <el-card
            v-for="item in approvalList"
            :key="item.create_time"
            style="margin-bottom: 20px"
            shadow="hover"
        >
            <template #header>
                <div class="card-header">
                    <span style="color: black; font-weight: 600">{{
                        item.form_name
                    }}</span>
                    <el-button
                        class="button"
                        text
                        type="primary"
                        @click="
                            toApprove(item.id, item.create_time, item.form_name)
                        "
                        >前往审批</el-button
                    >
                </div>
            </template>
            <div style="margin-bottom: 10px">
                申请人：<span style="font-weight: 300">{{
                    item.true_name
                }}</span>
            </div>
            <div>
                申请时间：<span style="font-weight: 300">{{
                    item.create_time
                }}</span>
            </div>
        </el-card>
    </div>
    <el-dialog
        v-model="productionOrderVisible"
        title="生产指令单审批"
        :width="1000"
    >
        <el-steps :space="200" :active="1" simple style="margin-bottom: 20px">
            <el-step title="生管申请" icon="Edit" />
            <el-step title="品控审核" icon="SetUp" />
            <el-step title="厂长确认" icon="checked" />
        </el-steps>
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
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    @click="
                        approveResult(
                            data.form_name,
                            data.production_order_id,
                            -1
                        )
                    "
                    >拒绝</el-button
                >
                <el-button
                    type="primary"
                    @click="
                        approveResult(
                            data.form_name,
                            data.production_order_id,
                            1
                        )
                    "
                >
                    审核通过
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="materialGetNormalVisible"
        title="材料领取申请"
        :width="1000"
    >
        <el-steps :space="200" :active="1" simple style="margin-bottom: 20px">
            <el-step title="生产申请" icon="Edit" />
            <el-step title="厂长审核" icon="checked" />
            <el-step title="仓库确认" icon="UploadFilled" />
        </el-steps>
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
                田建娥
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
            <el-table-column prop="material_weight" label="领取重量(kg)" />
        </el-table>

        <el-image
            :src="'http://127.0.0.1:8000/getImage?url='+data.material_get_img"
            :zoom-rate="1.2"
            :preview-src-list="'http://127.0.0.1:8000/getImage?url='+data.material_get_img"
            fit="cover"
        />
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    @click="
                        approveResult(data.form_name, data.material_get_id, -1)
                    "
                    >拒绝</el-button
                >
                <el-button
                    type="primary"
                    @click="
                        approveResult(data.form_name, data.material_get_id, 1)
                    "
                >
                    审核通过
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="productStorageVisible"
        title="产品入库申请"
        :width="1000"
    >
        <el-steps :space="200" :active="1" simple style="margin-bottom: 20px">
            <el-step title="生产申请" icon="Edit" />
            <el-step title="品控审核" icon="checked" />
            <el-step title="仓库确认" icon="UploadFilled" />
        </el-steps>
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
                田建娥
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
        </el-descriptions>
        <el-divider></el-divider>
        <el-table
            :data="data.product_list"
            border
            style="width: 100%; margin-bottom: 20px"
        >
            <el-table-column prop="product_name" label="产品名称" />
            <el-table-column prop="product_kind" label="产品类型" />
            <el-table-column prop="product_number" label="入库数量" />
        </el-table>

        <el-image
            :src="'http://127.0.0.1:8000/getImage?url='+data.product_storage_img"
            :zoom-rate="1.2"
            :preview-src-list="'http://127.0.0.1:8000/getImage?url='+data.product_storage_img"
            fit="cover"
        />
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    @click="
                        approveResult(data.form_name, data.product_storage_id, -1)
                    "
                    >拒绝</el-button
                >
                <el-button
                    type="primary"
                    @click="
                        approveResult(data.form_name, data.product_storage_id, 1)
                    "
                >
                    审核通过
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="materialPurchaseVisible"
        title="材料入库申请"
        :width="1000"
    >
        <el-steps :space="200" :active="1" simple style="margin-bottom: 20px">
            <el-step title="生管申请" icon="Edit" />
            <el-step title="品控审核" icon="checked" />
            <el-step title="仓库确认" icon="UploadFilled" />
        </el-steps>
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
            <el-table-column prop="material_weight" label="入库重量(kg)" />
            <el-table-column prop="material_from" label="材料来源" />
        </el-table>

        <el-image
            :src="'http://127.0.0.1:8000/getImage?url='+data.material_purchase_img"
            :zoom-rate="1.2"
            :preview-src-list="'http://127.0.0.1:8000/getImage?url='+data.material_purchase_img"
            fit="cover"
        />
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    @click="
                        approveResult(data.form_name, data.material_purchase_id, -1)
                    "
                    >拒绝</el-button
                >
                <el-button
                    type="primary"
                    @click="
                        approveResult(data.form_name, data.material_purchase_id, 1)
                    "
                >
                    审核通过
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="productShipmentVisible"
        title="产品出货申请"
        :width="1000"
    >
        <el-steps :space="200" :active="1" simple style="margin-bottom: 20px">
            <el-step title="生管申请" icon="Edit" />
            <el-step title="品控审核" icon="checked" />
            <el-step title="仓库确认" icon="UploadFilled" />
        </el-steps>
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
        </el-descriptions>
        <el-divider></el-divider>
        <el-table
            :data="data.product_list"
            border
            style="width: 100%; margin-bottom: 20px"
        >
            <el-table-column prop="product_name" label="产品名称" />
            <el-table-column prop="product_kind" label="产品类型" />
            <el-table-column prop="product_number" label="出货数量" />
        </el-table>

        <el-image
            :src="'http://127.0.0.1:8000/getImage?url='+data.product_storage_img"
            :zoom-rate="1.2"
            :preview-src-list="'http://127.0.0.1:8000/getImage?url='+data.product_storage_img"
            fit="cover"
        />
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    @click="
                        approveResult(data.form_name, data.product_shipment_id, -1)
                    "
                    >拒绝</el-button
                >
                <el-button
                    type="primary"
                    @click="
                        approveResult(data.form_name, data.product_shipment_id, 1)
                    "
                >
                    审核通过
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="productRecycleOutVisible"
        title="重工出库申请"
        :width="1000"
    >
        <el-steps :space="200" :active="1" simple style="margin-bottom: 20px">
            <el-step title="生管申请" icon="Edit" />
            <el-step title="品控审核" icon="checked" />
            <el-step title="仓库确认" icon="UploadFilled" />
        </el-steps>
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
        </el-descriptions>
        <el-divider></el-divider>
        <el-table
            :data="data.product_list"
            border
            style="width: 100%; margin-bottom: 20px"
        >
            <el-table-column prop="product_name" label="产品名称" />
            <el-table-column prop="product_kind" label="产品类型" />
            <el-table-column prop="product_number" label="出货数量" />
        </el-table>

        <el-image
            :src="'http://127.0.0.1:8000/getImage?url='+data.product_recycle_img"
            :zoom-rate="1.2"
            :preview-src-list="'http://127.0.0.1:8000/getImage?url='+data.product_storage_img"
            fit="cover"
        />
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    @click="
                        approveResult(data.form_name, data.product_recycle_id, -1)
                    "
                    >拒绝</el-button
                >
                <el-button
                    type="primary"
                    @click="
                        approveResult(data.form_name, data.product_recycle_id, 1)
                    "
                >
                    审核通过
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="materialTestOrderVisible"
        title="试料指令申请"
        :width="1000"
    >
        <el-steps :space="200" :active="1" simple style="margin-bottom: 20px">
            <el-step title="生管申请" icon="Edit" />
            <el-step title="厂长审核" icon="SetUp" />
            <el-step title="仓库确认" icon="checked" />
        </el-steps>
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
                {{ data.material_test_order_id }}
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
                        机种名
                    </div>
                </template>
                {{ data.machine_name }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><Notification /></el-icon>
                        试料原因
                    </div>
                </template>
                {{ data.reason }}
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
            <el-table-column prop="product_number" label="产品数量" />
        </el-table>
        <el-image
            :src="'http://127.0.0.1:8000/getImage?url='+data.production_order_img"
            :zoom-rate="1.2"
            :preview-src-list="'http://127.0.0.1:8000/getImage?url='+data.production_order_img"
            fit="cover"
        />
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    @click="
                        approveResult(
                            data.form_name,
                            data.material_test_order_id,
                            -1
                        )
                    "
                    >拒绝</el-button
                >
                <el-button
                    type="primary"
                    @click="
                        approveResult(
                            data.form_name,
                            data.material_test_order_id,
                            1
                        )
                    "
                >
                    审核通过
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="materialOutFactoryVisible"
        title="材料出厂申请"
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
            <el-table-column prop="material_weight" label="出厂重量(kg)" />
            <el-table-column prop="out_reason" label="出厂备注" />
        </el-table>

        <el-image
            :src="'http://127.0.0.1:8000/getImage?url='+data.material_out_factory_img"
            :zoom-rate="1.2"
            :preview-src-list="'http://127.0.0.1:8000/getImage?url='+data.material_out_factory_img"
            fit="cover"
        />
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    @click="
                        approveResult(data.form_name, data.material_out_factory_id, -1)
                    "
                    >拒绝</el-button
                >
                <el-button
                    type="primary"
                    @click="
                        approveResult(data.form_name, data.material_out_factory_id, 1)
                    "
                >
                    审核通过
                </el-button>
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
            //打开审批弹窗
            productionOrderVisible: false,
            materialGetNormalVisible: false,
            productStorageVisible:false,
            materialPurchaseVisible:false,
            productShipmentVisible:false,
            productRecycleOutVisible:false,
            materialTestOrderVisible:false,
            materialOutFactoryVisible:false,
            data: {},
            //

            ////////////
            approvalList: [],
        };
    },
    created() {
        this.getApprovalList();
    },
    methods: {
        getApprovalList() {
            let user_id = parseFloat(sessionStorage.getItem("user_id"));
            http({
                url: "/getApprovalList",
                method: "post",
                data: {
                    user_id: user_id,
                },
            })
                .then((res) => {
                    this.approvalList = res.data.data;
                })
                .catch(function (error) {
                    ElMessage.error(error.message);
                });
        },
        chooseDialog(status, formName) {
            if (formName == "生产指令单申请") {
                this.productionOrderVisible = status;
            } else if (formName == "材料领取申请") {
                this.materialGetNormalVisible = status;
            }else if (formName == "产品入库申请") {
                this.productStorageVisible = status;
            }
            else if (formName == "材料入库申请") {
                this.materialPurchaseVisible = status;
            }
            else if (formName == "产品出货申请") {
                this.productShipmentVisible = status;
            }
            else if (formName == "重工出库申请") {
                this.productRecycleOutVisible = status;
            }
            else if (formName == "试料指令申请") {
                this.materialTestOrderVisible = status;
            }
            else if (formName == "材料出厂申请") {
                this.materialOutFactoryVisible = status;
            }
        },
        toApprove(id, createTime, formName) {
            this.chooseDialog(true, formName);
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
        approveResult(formName, id, status) {
            let user_id = sessionStorage.getItem("user_id");
            user_id = parseFloat(user_id);
            console.log(formName);
            http({
                url: "/handelApprovalResult",
                method: "post",
                data: {
                    user_id: user_id,
                    id: id,
                    form_name: formName,
                    status: status,
                },
            })
                .then((res) => {
                    if (!res.data.code) {
                        ElMessage.error(res.data.msg);
                    } else {
                        ElMessage.success(res.data.msg);
                    }
                    this.chooseDialog(false, formName);
                    this.getApprovalList();
                })
                .catch(function (error) {
                    ElMessage.error(error.message);
                });
        },
    },
};
</script>
<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>