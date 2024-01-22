<script>
export default {
  data() {
    return {
        menuItems: ['О нас', 'Цены', 'Контакты']
    }
  }
}
</script>

<template>
<div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li v-for="(item, index) in menuItems" :key="index" ><a>{{ item }}</a></li>
        </ul>
      </div>
      <a class="btn text-3xl btn-ghost bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">OYAU</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 text-xl">
        <li v-for="(item, index) in menuItems" :key="index" ><a> {{ item }} </a></li>
      </ul>
    </div>
    <div class="navbar-end gap-3">

      <NuxtLink to="register" class="btn btn-neutral">Регистрация</NuxtLink>
      <NuxtLink to="login" class="btn ">Логин</NuxtLink>
    </div>
  </div>
</template>
