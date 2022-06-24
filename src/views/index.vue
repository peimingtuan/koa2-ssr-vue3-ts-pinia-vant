<template>
    <img alt="Vue logo" src="./../assets/logo.png" />
    <UsePinia /><br />
    <van-button type="primary" size="small" @click="goTest">点击跳转至测试页</van-button> <br /><br />
    <van-button type="primary" size="small" @click="goZb">跳转Dplayer直播页</van-button><br/><br/>
    <van-button type="primary" size="small" @click="goPlayer">跳转Dplayer点播页</van-button>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { useRouter } from "vue-router";
    import UsePinia from '@/components/UsePinia.vue';

    export default defineComponent({
        name: 'IndexPage',
        components: {
            UsePinia
        },
        setup(){
            let router=useRouter()
            const goTest=()=>{
                router.push('vueuse')
            }
            const goZb=()=>{
                //router.push('zb')
            }
            const goPlayer=()=>{
                //router.push('Dplayer')
            }
            return{
                goTest,
                goZb,
                goPlayer
            }
        }
    });
</script>
