import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // State
    const currentUser = ref({
        id: 1,
        name: 'Nguyễn Hoàng Long',
        role: 'Admin'
    });

    // Getters
    const isAuthenticated = computed(() => !!currentUser.value.id);

    // Actions
    function updateProfile(newName: string) {
        currentUser.value.name = newName;
    }

    return { currentUser, isAuthenticated, updateProfile };
});