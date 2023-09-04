<template>
    <div class="main">
        <el-container style="height: 100%" direction="vertical">
            <el-header class="header" height="80px">
                <el-menu
                    class="menu-head"
                    mode="horizontal"
                    :ellipsis="false"
                    @select="selectHeadMenuItem"
                    background-color="rgb(53, 64, 85)"
                    :default-active="router"
                    text-color="white"
                >
                    <el-menu-item index="0"
                        ><span style="font-size: 25px"
                            >易 鑫</span
                        ></el-menu-item
                    >
                    <div class="flex-grow" />
                    <el-menu-item index="approve">
                        <el-badge
                            :value="approvalNumber"
                            class="badge"
                            v-if="showApproval"
                        >
                            <span>我的待办</span>
                        </el-badge>
                        <span v-if="!showApproval">我的待办</span>
                    </el-menu-item>
                    <el-menu-item index="apply-list">我发起的</el-menu-item>
                    <el-menu-item index="after-approve">我处理的</el-menu-item>
                    <div class="flex-grow" />
                    <el-sub-menu index="2">
                        <template #title>{{ username }}</template>
                        <el-menu-item index="personal">个人设置</el-menu-item>
                        <el-menu-item index="logout">退出登陆</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-header>
            <el-container>
                <el-aside width="250px" style="border-right: 1px solid #dcdfe6">
                    <div v-for="item in menuList" :key="item.id" class="aside">
                        <el-menu
                            class="menu-aside"
                            @select="selectAsideMenuItem"
                            :unique-opened="true"
                            :default-active="router"
                        >
                            <!-- 叶子结点 -->
                            <template v-if="!item.haveChild">
                                <el-menu-item :key="item.id" :index="item.path">
                                    <el-icon><Odometer /></el-icon>
                                    {{ item.name }}
                                </el-menu-item>
                            </template>
                            <!-- 父节点 -->
                            <el-sub-menu v-if="item.haveChild">
                                <template #title>
                                    <el-icon><location /></el-icon>
                                    <span>{{ item.name }}</span>
                                </template>

                                <el-menu-item
                                    :index="child.path"
                                    v-for="child in item.children"
                                    :key="child.id"
                                >
                                    {{ child.name }}
                                </el-menu-item>
                            </el-sub-menu>
                        </el-menu>
                    </div></el-aside
                >
                <el-container>
                    <div class="bread-crumb">
                        <el-breadcrumb
                            separator="/"
                            style="margin: 13px 0 13px 25px"
                        >
                            <el-breadcrumb-item :to="{ path: '/home' }"
                                >首页</el-breadcrumb-item
                            >
                            <el-breadcrumb-item>{{
                                content
                            }}</el-breadcrumb-item>
                            <el-breadcrumb-item>{{
                                contentName
                            }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <el-main class="main-content">
                        <div
                            class="main-content-router"
                            :style="{
                                height: screenHeight - 200 + 'px',
                                width: screenWidth - 250 - 80 + 'px',
                            }"
                            id="left"
                        >
                            <router-view></router-view></div
                    ></el-main>
                    <el-footer height="40px" class="footer"
                        >Copyright © 2023-present 汤宗朔, All rights
                        reserved.</el-footer
                    >
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import http from "../assets/axios";
import { ElMessage } from "element-plus";
import { ref } from "vue";
export default {
    data() {
        return {
            showApproval: false,
            approvalNumber: "",
            menuList: {}, //菜单列表
            username: sessionStorage.getItem("username"), //用户名
            content: "", //面包屑
            contentName: "",
            screenHeight: document.documentElement.clientHeight,
            screenWidth: document.documentElement.clientWidth, // 屏幕高度
            router: sessionStorage.getItem("router"),
        };
    },
    watch: {
        screenWidth: function (val) {
            // 监听屏幕宽度变化
            var oIframe = document.getElementById("maindiv");
            //oIframe.style.width = Number(val) + "px"; // '120'是页面布局调整，可去除
        },
        screenHeight: function (val) {
            // 监听屏幕高度变化
            var oIframe = document.getElementById("left");
            // alert(this.$store.getters.screenHeight)
            //oIframe.style.height = Number(val) - 140 + "px";
        },
    },
    mounted() {
        var _this = this;
        window.onresize = function () {
            // 定义窗口大小变更通知事件
            _this.screenWidth = document.documentElement.clientWidth; // 窗口宽度
            _this.screenHeight = document.documentElement.clientHeight; // 窗口高度
        };
    },
    created() {
        this.getMenuList();
        this.getApprovalNumber();
        this.setBreadCrumb(sessionStorage.getItem("router"));
    },
    methods: {
        getApprovalNumber() {
            let user_id = parseFloat(sessionStorage.getItem("user_id"));
            http({
                url: "/getApprovalNumber",
                method: "post",
                data: {
                    user_id: user_id,
                },
            })
                .then((res) => {
                    this.approvalNumber = res.data.data;
                    if (!res.data.data) {
                        this.showApproval = false;
                    } else {
                        this.showApproval = true;
                    }
                })
                .catch(function (error) {
                    ElMessage.error(error.message);
                });
        },
        selectAsideMenuItem(index) {
            this.setBreadCrumb(index);
            sessionStorage.setItem("router", index);
            this.$router.push(index);
        },
        setBreadCrumb(index) {
            if (index == "/material-purchase") {
                this.content = "材料";
                this.contentName = "材料入库";
            }
            if (index == "/material-stock") {
                this.content = "数据汇总";
                this.contentName = "材料库存";
            }
            if (index == "/material-back") {
                this.content = "材料";
                this.contentName = "材料退库";
            }
            if (index == "/production-order") {
                this.content = "指令";
                this.contentName = "生产指令";
            }
            if (index == "/material-delivery") {
                this.content = "材料";
                this.contentName = "材料出厂";
            }
            if (index == "/production-receipt") {
                this.content = "材料";
                this.contentName = "材料领取";
            }
            if (index == "/product-warehousing") {
                this.content = "产品";
                this.contentName = "产品入库";
            }
            if (index == "/product-shipment") {
                this.content = "产品";
                this.contentName = "产品出货";
            }
            if (index == "/approve") {
                this.content = "菜单";
                this.contentName = "我的待办";
            }
            if (index == "/after-approve") {
                this.content = "菜单";
                this.contentName = "我处理的";
            }
            if (index == "/production-order-list") {
                this.content = "数据汇总";
                this.contentName = "生产指令单";
            }
            if (index == "/production-order-list") {
                this.content = "数据汇总";
                this.contentName = "生产指令单";
            }
            if (index == "/test-material-order") {
                this.content = "指令";
                this.contentName = "试料指令单";
            }
            if (index == "/product-recycle-out") {
                this.content = "产品";
                this.contentName = "重工出库";
            }
        },
        selectHeadMenuItem(index) {
            if (index == "logout") {
                sessionStorage.clear();
                localStorage.clear();
                this.$router.push("/login");
            } else {
                this.setBreadCrumb("/" + index);
                sessionStorage.setItem("router", index);
                this.$router.push(index);
            }
        },
        getMenuList() {
            let roleId = sessionStorage.getItem("role_id");
            if (roleId == "1") {
                this.menuList = require("../assets/menuJson/first.json");
            }
            if (roleId == "2") {
                this.menuList = require("../assets/menuJson/second.json");
            }
            if (roleId == "3") {
                this.menuList = require("../assets/menuJson/third.json");
            }
            if (roleId == "4") {
                this.menuList = require("../assets/menuJson/forth.json");
            }
            if (roleId == "5") {
                this.menuList = require("../assets/menuJson/fifth.json");
            }
            if (roleId == "6") {
                this.menuList = require("../assets/menuJson/sixth.json");
            }
            if (roleId == "7") {
                this.menuList = require("../assets/menuJson/seventh.json");
            }
        },
    },
};
</script>
<style scoped>
#app,
.main,
.el-container {
    padding: 0;
    margin: 0;
    height: 100%;
}
.header {
    background-color: rgb(53, 64, 85);
    color: white;
    line-height: 80px;
}
.flex-grow {
    flex-grow: 2;
}
.menu-head {
    height: 81px;
}
.menu-aside {
    border: 0 !important;
}
.footer {
    line-height: 40px;
    text-align: center;
    background-color: rgb(230, 233, 241);
}
.main-content {
    background-color: rgb(230, 233, 241);
    padding-bottom: 0;
    padding-top: 0;
    overflow: hidden;
}
.main-content-router {
    background-color: white;
    border-radius: 15px;
    width: 100%;
    padding: 20px;
    overflow-y: auto;
}
.main-content-router::-webkit-scrollbar {
    width: 0 !important;
}
.bread-crumb {
    background-color: rgb(230, 233, 241);
    height: 40px;
}
</style>
