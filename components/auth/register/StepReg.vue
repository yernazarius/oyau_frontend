<script lang="ts">
  import axios from 'axios';

  const nameRef = ref('');
  const emailRef = ref('');
  const passwordRef = ref('');
  const phoneRef = ref('');
  const is_ownerRef = ref(true);

  const user = reactive({
    name: nameRef,
    email: emailRef,
    password: passwordRef,
    phone: phoneRef,
    is_owner: is_ownerRef,
  });

  const register = async () => {
    try {
      const response = await axios.post('http://localhost:9999/api/auth/register', user);
      console.log('Registration successful', response.data);
      login(user.email, user.password);
    } catch (error: any) {
      console.error('Registration failed', error.response.data);
    }
  };

  const requestVerifyToken = async (email:string) => {
    try {
      const verifyTokenResponse = await axios.post('http://localhost:9999/api/auth/request-verify-token', { email });
      console.log('Token sent successful', verifyTokenResponse);
    } catch (error: any) {
      console.error('Token sending failed', error.response.data);
    }
  };

  const login = async (email:string, password:string) => {
    try {
      const loginParams = new URLSearchParams();
      loginParams.append('username', email);
      loginParams.append('password', password);
      const loginResponse = await axios.post('http://localhost:9999/api/auth/jwt/login', loginParams, { withCredentials: true });
      console.log('Login successful', loginResponse);
      requestVerifyToken(user.email);
    } catch (error: any) {
      console.error('Login failed', error.response.data);
    }
  };


  export default {
    name: 'StepReg',
    setup() {
      return {
        nameRef,
        emailRef,
        passwordRef,
        phoneRef,
        is_ownerRef,
        register,
        login,
      };
    },
  };
</script>


<template>
  <div class="min-h-[20vh]">
    <!-- Name Field -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Имя:</span>
      </label>
      <input type="text" required placeholder="Введите ваше имя" class="input input-bordered w-full" v-model="nameRef" />
    </div>

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

    <!-- Phone Field -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Телефонный номер:</span>
      </label>
      <input type="text" required placeholder="Введите ваш номер" class="input input-bordered w-full" v-model="phoneRef" />
    </div>

    <!-- Is Owner Field -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Вы владелец?</span>
      </label>
      <select class="select select-bordered w-full" v-model="is_ownerRef">
        <option :value="true">Да</option>
        <option :value="false">Нет</option>
      </select>
    </div>

    <!-- Submit Button -->
    <div class="form-control w-full pt-4">
      <button class="btn btn-primary" @click="register">Зарегистрироваться</button>
    </div>
  </div>
</template>
