<template>
    <div id="dplayer"></div>
</template>

<script lang="ts" setup>
    import {reactive,onMounted} from "vue"
    //import hlsjs from 'hls.js'
    // import "videojs-contrib-hls"
    //const props =  defineProps<{options:Item}>() //没有默认值
    interface Videoinfo{
        url:string,//视频链接
            pic?:string,//视频封面
            thumbnails?:string,//视频缩略图
            type?:string,//可选值: 'auto', 'hls', 'flv', 'dash', 'webtorrent', 'normal'
    }
    interface Subtitleinfo{
        url:string,//字幕链接
            type?:string,//字幕类型，可选值: 'webvtt', 'ass'，目前只支持 webvtt
            fontSize?:string,//字幕字号
            bottom?:string,//字幕距离播放器底部的距离，取值形如: '10px' '10%'
            color?:string,//字幕颜色
    }
    interface Danmakuinfo{
        id:string,//弹幕池 id，必须唯一
            api:string,//
            token?:string,//弹幕后端验证 token
            maximum?:number,//弹幕最大数量
            user?:string,//弹幕用户名
    }
    interface Menu{
        text:string,
            link?:string,
            click?:()=>void
    }
    interface Item{
        container:string,
            live?:boolean,
            autoplay?:boolean,
            theme?:string,//主题色
            loop?:boolean,//视频循环播放
            lang?:string,
            screenshot?:boolean,
            hotkey?:boolean,//开启热键，支持快进、快退、音量控制、播放暂停
            preload?:string,//视频预加载，可选值: 'none', 'metadata', 'auto'
            volume?:number,
            playbackSpeed?:Array<number>,
            logo?:string,
            video:Videoinfo,
            subtitle?:Subtitleinfo,
            danmaku?:Danmakuinfo,
            contextmenu?:Array<Menu>
    }
    // const props=defineProps({
    //     options:{
    //         type:Object,
    //         required:true,
    //         default:()=>({
    //             video: {
    //                 url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4'//'http://localhost:4000/welcomeHome.mp4',
    //                 //url:'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    //                 //type: 'customHls',
    //                 //type: 'hls'
    //             },
    //         })
    //     }
    // })
    let dp:any;
    onMounted(():void=>{
        //const dp = new DPlayer(Object.assign({container: document.getElementById('dplayer')},props.options));
    })
    const init=()=>{
        dp.switchVideo({
            url:'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
            type: 'hls',
        })
    }
    //创建直播
    const builtZb=(url)=>{
      new DPlayer({
        container: document.getElementById('dplayer'),
        live:true,
        video:{
          url,
          type:"customHls",
          customType:{
            customHls:(video,player)=>{
              video.srcObject=url
              video.onloadedmetadata=()=>{
                video.play()
              }
            }
          }
        }
      })
    }
    //创建点播
    const builtDb=()=>{
        dp=new DPlayer({
            container: document.getElementById('dplayer'),
            live:false,
            video:{
                url:'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
            }
        })
    }
    //暂停、播放
    const toggle=()=>{
        dp.toggle()
    }
    //跳转指定时间
    const seek=(time:number)=>{
        dp.seek(time)
    }
    //返回当前播放时间
    const currentTime=()=>{
        console.log(dp.video.currentTime)
    }
    defineExpose(
        {
            init,
            builtZb,
            builtDb,
            toggle,
            seek,
            currentTime
        }
    )

</script>

<style scoped lang="less">
    #dplayer{
        margin:0 auto;
        width:500px;
        height:300px;
    }
</style>