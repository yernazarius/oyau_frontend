<script lang="ts">
    import axios from 'axios';

    const emailRef = ref('');
    const passwordRef = ref('');

    const login = async () => {
        try {
            const loginParams = new URLSearchParams();
            loginParams.append('username', emailRef.value);
            loginParams.append('password', passwordRef.value);
            console.log('loginParams', loginParams.toString());
            const loginResponse = await axios.post('http://localhost:9999/api/auth/jwt/login', loginParams, { withCredentials: true });
            console.log('Login successful', loginResponse);
            } catch (error: any) {
            console.error('Login failed', error.response.data);
        }
    };

    export default {
        name: 'Login',
        setup() {
        return {
            emailRef,
            passwordRef,
            login,
        };
        },
    };

</script>


<template>
    <div class="w-6/12">
        <ul class=" min-w-full">
            <li class="text-center font-semibold text-xl" >
                Вход в аккаунт
            </li>
        </ul>
        <div class="py-3"></div> 
        <form  class="min-w-full px-6"> 
            <div class="min-h-[20vh]">
                <!-- Email Field -->
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">Почта:</span>
                    </label>
                    <input type="email" required placeholder="Введите вашу почту" class="input input-bordered w-full" v-model="emailRef" />
                </div>
            
                <!-- Password Field -->
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">Пароль:</span>
                    </label>
                    <input type="password" required placeholder="Введите ваш пароль" class="input input-bordered w-full" v-model="passwordRef" />
                </div>
            
                <!-- Submit Button -->
                <div class="form-control w-full pt-4">
                    <button class="btn btn-primary" type="button" @click="login">Войти</button>
                </div>
            </div>
            <div class="py-4"></div> 
            <div class="flex justify-end">
                
                <NuxtLink to="/app/" class="btn btn-primary" type="submit">Перети в календарь</NuxtLink>
            </div>
            
        </form>
    </div>
    
</template>