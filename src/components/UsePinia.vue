<template>
    <h2>欢迎使用vite+vue3+ts+pinia+router4+vant3</h2>
    <div>{{ userStore.name }}的年龄： {{ userStore.age }}</div
    ><br />
    <van-button plain type="primary" size="small" @click="addAge">点击给{{ userStore.name }}的年龄增加一岁</van-button>
    <br />
</template>

<script lang="ts" setup>
    import useUserStore from '@/store/user';
    const userStore = useUserStore();
    const addAge = () => {
        userStore.updateAge(++userStore.age);
    };
</script>
