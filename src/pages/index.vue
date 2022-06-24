<template>
    <img alt="Vue logo" src="./../assets/logo.png" />
    <UsePinia />
    <br />
    <button @click="go">点击跳转至login</button>
    <router-link to="/login">点击跳转至login</router-link>
    <br /><br />
    <router-link to="/user">点击跳转至user页面</router-link>
    <br /><br />
    <router-link to="/vueuse">点击跳转至vueuse页面</router-link>
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
            const go=()=>{
                console.log(5555)
                router.push('login')
            }
            return{
                go
            }
        }
    });
</script>
