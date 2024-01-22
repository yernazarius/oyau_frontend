<script lang="ts">
  import axios from 'axios';

  const business = reactive({
    name: '',
    country: '',
    city: '',
    address: '',
  });

  const createBusiness = async () => {
    try {
      const response = await axios.post('http://localhost:9999/business/create_business', business);
      console.log('Business created successfully', response.data);
    } catch (error: any) {
      console.error('Business creating failed', error.response.data);
    }
  };

  export default {
    name: 'StepBusiness',
    setup() {
      return {
        business,
        createBusiness,
      };
    },
  };
</script>

<template>
    <div class="form-control w-full flex items-center justify-center">
    <h2 class="text-xl py-3">Введите информацию о вашем бизнесе</h2>
      <div class="w-full">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Название бизнеса</span>
          </label>
          <input type="text" required placeholder="Enter name" class="input input-bordered w-full" v-model="business.name" />
        </div>
    
        <div class="form-control w-full mt-4">
          <label class="label">
            <span class="label-text">Страна</span>
          </label>
          <input type="text" required placeholder="Enter country" class="input input-bordered w-full" v-model="business.country" />
        </div>
    
        <div class="form-control w-full mt-4">
          <label class="label">
            <span class="label-text">Город</span>
          </label>
          <input type="text" required placeholder="Enter city" class="input input-bordered w-full" v-model="business.city" />
        </div>
    
        <div class="form-control w-full mt-4">
          <label class="label">
            <span class="label-text">Адресс</span>
          </label>
          <input type="text" required placeholder="Enter address" class="input input-bordered w-full" v-model="business.address" />
        </div>
    
        <div class="form-control w-full mt-4">
          <button class="btn btn-primary" @click="createBusiness">Создать бизнес</button>
        </div>
      </div>
    
    </div>
</template>