<template>
    <h1>点播</h1>
    <video-demo ref="videoDemo"/>
    <div class="opera-btn">
        <van-button type="primary" size="mini" @click="setPlayer">暂停播放</van-button>
        <van-button type="primary" size="mini" @click="seekTime">跳转到指定时间</van-button>
        <van-button type="primary" size="mini" @click="returnPlayTime">返回当前播放时间</van-button>
        <van-button type="primary" size="mini" @click="changeVideo">切换m3u8视频</van-button>
        <van-button type="primary" size="mini" @click="goLogin">返回首页</van-button>
    </div>
</template>
<script lang="ts" setup="props">
    import {reactive,ref} from "vue"
    import { useRouter } from "vue-router";
    import VideoDemo from "@/components/video.vue"
    const router = useRouter();
    const goLogin = () => {
        router.push("/");
    };
    const videoDemo=ref(null)
    let options=reactive({
        container:'',
        live:false,
        autoplay:true,
        theme:'#b7daff',
    })
    //切换视频
    const changeVideo=()=>{
        videoDemo.value.init()
    }
    //暂停、播放
    const setPlayer=()=>{

    }
    //跳转指定时间
    const seekTime=()=>{

    }
    //返回当前播放时间
    const returnPlayTime=()=>{

    }
</script>
<style lang="less" scoped>
    .opera-btn{
        width:500px;
        margin:5px auto;
        text-align: left;
    }
</style>