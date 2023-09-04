<template>
    <div style="width: 100%">
        <el-tabs type="border-card" @tab-click="handleClick">
    <el-tab-pane label="产品入库" name="first">
        <!-- <el-table :data="productList" border style="width: 100%" stripe>
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
        </el-table> -->

    </el-tab-pane>
    <el-tab-pane label="产品出货" name="second">Config</el-tab-pane>
    <el-tab-pane label="重工入库" name="third">Role</el-tab-pane>
    <el-tab-pane label="重工出库" name="fourth">Task</el-tab-pane>
  </el-tabs>

        
    </div>
</template>
<script>
import http from "../../assets/axios";
import { ElMessage } from "element-plus";
import { ref } from "vue";
export default {
    data() {
        return {
            materialStock: [],
            allMaterialStock:[],
            materialNameList: [],
            chooseMaterialName: ref(""),
        };
    },
    created() {
        this.getMaterialNameList();
        this.getMaterialAllStock();
    },
    methods: {
        selectMaterial(){
            let length=this.allMaterialStock.length
            for(let i=0;i<length;i++){
                let item=this.allMaterialStock[i]
                if(item.material_id==this.chooseMaterialName){
                    this.materialStock=[],
                    this.materialStock.push(item)
                }
            }
        },
        cancelSelectMaterial(){
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
                url: "/getMaterialStock",
                method: "get",
            })
                .then((res) => {
                    this.allMaterialStock=res.data.data
                    this.materialStock = res.data.data;
                })
                .catch(function (error) {
                    ElMessage.error(error.message);
                });
        },
    },
};
</script>