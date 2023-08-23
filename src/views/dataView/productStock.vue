<template>
    <div style="width: 100%">
        <el-select
            v-model="chooseMaterialName"
            filterable
            placeholder="请选择原料"
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
        <el-divider></el-divider>
        <el-table :data="materialStock" border style="width: 100%">
            <el-table-column prop="product_id" label="编号" width="100" />
            <el-table-column prop="product_name" label="产品名称" />
            <el-table-column prop="product_number" label="成品数量" />
            <el-table-column prop="product_semi_finished_number" label="半成品数量" />
            <el-table-column prop="shelf_number" label="货架编号" />
            
        </el-table>
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
                if(item.material_name==this.chooseMaterialName){
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
                url: "/getProductStock",
                method: "get",
            })
                .then((res) => {
                    this.materialNameList = res.data.data;
                })
                .catch(function (error) {});
        },
        getMaterialAllStock() {
            http({
                url: "/getProductStock",
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