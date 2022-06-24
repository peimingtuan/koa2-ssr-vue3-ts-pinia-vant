<template>
    <h1> 测试 vueUse 的鼠标坐标 </h1>
    <h3>Mouse: {{ x }} x {{ y }}</h3><br /><br />
    <van-button type="primary" size="small" @click="back">点击跳转至首页</van-button>
</template>

<script lang="ts" setup>
    import { useRouter } from "vue-router";
    import { useMouse } from '@vueuse/core';
    const { x, y } = useMouse();
    let router=useRouter()
    const back=()=>{
        router.push('/')
    }
</script>
