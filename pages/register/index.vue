<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <!-- @vue-ignore -->
        <AuthRegister :forms="forms" :steps="['Регистрация','Подтверждение почты','Создание бизнеса']" :submit-action="submitAction" />
    </div>
</template>

<script lang="ts" setup>
 import StepReg from "@/components/auth/register/StepReg.vue";
 import StepConfirmation from "@/components/auth/register/StepConfirmation.vue";
 import StepBusiness from "@/components/auth/register/StepBusiness.vue";

 const forms = [StepReg,StepConfirmation,StepBusiness ]
 const submitAction = () => {console.log("submitting form...")}
</script>
