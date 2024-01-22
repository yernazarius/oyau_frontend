<script lang="ts">
  import axios from 'axios';

  const tokenRef = ref('');

  const verify = async () => {
  try {
    const token = tokenRef.value.trim();
    if (!token) {
      console.error('Token is empty');
      return;
    }

    const verifyParams = new URLSearchParams();
    verifyParams.append('token', token);
    console.log('verifyParams', verifyParams.getAll('token'));

    const verifyTokenResponse = await axios.post('http://localhost:9999/api/auth/verify', 
      {
        token: tokenRef.value,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Token verified successfully', verifyTokenResponse);
  } catch (error: any) {
    console.error('Token verifying failed', error.response ? error.response.data : error.message);
  }
};

  export default {
    name: "StepConfirmation",
    setup() {
      return {
        tokenRef,
        verify,
      };
    },
  };
</script>
<template>
    <div class="form-control w-full">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Введите код подтвеждения<span class="font-bold">, проверьте пожалуйста почту</span></span>
        </label>
        <input type="text" required placeholder="Код подтвеждения" class="input input-bordered w-full" v-model.trim="tokenRef" />
      </div>
          <!-- Submit Button -->
      <div class="form-control w-full pt-4">
        <button class="btn btn-primary" @click="verify">Подтвердить код подтвеждения</button>
      </div>
    </div>
</template>
