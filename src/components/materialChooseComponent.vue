<template>
    <div style="width: 100%">
        <el-row :gutter="20">
            <el-col :span="4">
                <el-select
                    v-model="chooseMaterialName"
                    filterable
                    placeholder="请选择原料名称"
                    @change="toType"
                >
                    <el-option
                        v-for="item in materialNameList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select
                    v-model="chooseMaterialName"
                    filterable
                    placeholder="请选择原料名称"
                    disabled="showType"
                    
                    
                >
                    <el-option
                        v-for="item in materialNameList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select
                    v-model="chooseMaterialName"
                    filterable
                    placeholder="请选择原料名称"
                >
                    <el-option
                        v-for="item in materialNameList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select
                    v-model="chooseMaterialName"
                    filterable
                    placeholder="请选择原料名称"
                >
                    <el-option
                        v-for="item in materialNameList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select
                    v-model="chooseMaterialName"
                    filterable
                    placeholder="请选择原料名称"
                >
                    <el-option
                        v-for="item in materialNameList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import http from "../assets/axios";
import { ElMessage } from "element-plus";
import { ref } from "vue";
export default {
    data() {
        return {
            // 筛选可见
            showType:false,
            /////
            chooseMaterialName: ref(""),
            materialNameList: [],
        };
    },
    created() {
        this.getMaterialName();
    },
    methods: {
        async getMaterialName() {
            await http({
                url: "/getAllMaterialName",
                method: "get",
            })
                .then((res) => {
                    this.materialNameList = res.data.data;
                })
                .catch(function (error) {});
        },
        toType(){
            this.showType=true
        }
    },
};
</script>