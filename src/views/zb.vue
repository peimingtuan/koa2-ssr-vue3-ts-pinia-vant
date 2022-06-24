<template>
    <h1>直播</h1>
    <video-demo ref="videoDemo"/>
    <div class="opera-btn">
        <van-button type="primary" size="mini" @click="openCamera">打开摄像头</van-button>
        <van-button type="primary" size="mini" @click="closeCamera">关闭摄像头</van-button>
        <van-button type="primary" size="mini" @click="goPortal">返回首页</van-button>
    </div>
</template>
<script lang="ts" setup="props">
    import {reactive,ref} from "vue"
    import { useRouter } from "vue-router";
    import VideoDemo from "@/components/video.vue"
    const router = useRouter();
    const goPortal = () => {
        router.push("/");
    };
    const videoDemo=ref(null)
    let options=reactive({
        container:'',
        live:false,
        autoplay:true,
        theme:'#b7daff',
    })
    //打开摄像头
    const openCamera=()=>{

    }
    //关闭摄像头
    const closeCamera=()=>{

    }
</script>
<style lang="less" scoped>
    .opera-btn{
        width:500px;
        margin:5px auto;
        text-align: left;
    }
</style>