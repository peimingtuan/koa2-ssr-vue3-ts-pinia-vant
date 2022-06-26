<template>
    <h1>点播</h1>
    <video-demo ref="videoDemo"/>
    <div class="opera-btn">
        <van-button type="primary" size="mini" @click="setPlayer">暂停/播放</van-button>
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
        theme:'#b7daff',//#FADFA3
        lang:"zh-cn",
        screenshot:true,
        hotkey:true,
        logo:"www.persagy.com/img/index/logo_header.png",
        volume:.7,
        playbackSpeed:[.5,.75,1,1.25,1.5,2,2.5],
        vide:{
          url:'',
          pic:'',
        },
        //自定义进度条提示点
        heighlight:[
          {
            time:8,
            text:'这是第8秒'
          },
          {
            time:13,
            text:'这是第13秒'
          }
        ],
      //自定义右键菜单
      contextmenu:[
        {
          text:'custom1',
          link:'https:www.baidu.com'
        },
        {
          text:'custom2',
          click:(player)=>{
            console.log('点击:',player)
          }
        }
      ]
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