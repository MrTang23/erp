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
                    text-color="white"
                >
                    <el-menu-item index="0"
                        ><span style="font-size: 25px;"
                            >易 鑫</span
                        ></el-menu-item
                    >
                    <div class="flex-grow" />
                    <el-menu-item index="1">我的待办</el-menu-item>
                    <el-menu-item index="2">我发起的</el-menu-item>
                    <el-menu-item index="3">我处理的</el-menu-item>
                    <div class="flex-grow" />
                    <el-sub-menu index="2">
                        <template #title>名字</template>
                        <el-menu-item index="2-1">个人设置</el-menu-item>
                        <el-menu-item index="2-2">退出登陆</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-header>
            <el-container>
                <el-aside width="200px" style="border-right: 1px solid #dcdfe6">
                    <div v-for="item in menuList" :key="item.id">
                        <el-menu class="menu-aside">
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
                                <template
                                    v-for="child in item.children"
                                    :key="child.id"
                                >
                                    <el-menu-item :index="child.path">
                                        {{ child.name }}
                                    </el-menu-item>
                                </template>
                            </el-sub-menu>
                        </el-menu>
                    </div></el-aside
                >
                <el-container>
                    <div class="bread-crumb"> <el-breadcrumb separator="/" style="margin: 13px 0 13px 25px;">
    <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
    <el-breadcrumb-item
      ><a href="/">promotion management</a></el-breadcrumb-item
    >
    <el-breadcrumb-item>promotion list</el-breadcrumb-item>
    <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
  </el-breadcrumb></div>
                    <el-main class="main-content"
                        >
                        
                        <div class="main-content-router"></div
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
export default {
    data() {
        return {
            menuList: {},
        };
    },
    created() {
        this.getMenuList();
    },
    methods: {
        getMenuList() {
            this.menuList = require("../assets/menuJson/first.json");
            console.log(this.menuList);
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
}
.main-content-router {
    background-color: white;
    border-radius: 15px;
    width: 100%;
    height: 100%;
}
.bread-crumb{
    background-color: rgb(230, 233, 241);
    height: 40px;
}
</style>
