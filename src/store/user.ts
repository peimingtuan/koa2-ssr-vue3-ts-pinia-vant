import { defineStore } from 'pinia';

export default defineStore('user', {
    state: () => {
        return {
            name: 'Evan-Pei',
            age: 20
        };
    },
    actions: {
        updateName(name: string) {
            this.name = name;
        },
        updateAge(age: number) {
            this.age = age;
        }
    }
});
