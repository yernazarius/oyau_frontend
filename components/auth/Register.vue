<script lang="ts" setup>
    import { ref } from "vue";
    import StepReg from "@/components/auth/register/StepReg.vue";

    let step = ref(0);
    const props = defineProps<{
        forms:typeof StepReg[],
        steps:string[],
        submitAction: () => void;
    }>()

    const formAction = () => {
        if (step.value !== props.steps.length - 1) return step.value++;
        props.submitAction();
    };
    
</script>

<template>
    <div class="w-6/12">
        <ul class="steps min-w-full">
            <li v-for="(stepText,index) in props.steps" class="step" :class="index<=step ? 'step-primary' : ''">
                {{stepText}}
            </li>
        </ul>
        <div class="py-3"></div> 
        <form @submit.prevent="formAction" class="min-w-full px-6"> 
        <component class="min-h-[30vh]" :is="props.forms[step]"></component>
            <div class="py-4"></div> 
            <div class="flex justify-end">
                <button class="btn btn-ghost" type="button" v-if="step!==0" @click="step--">Back</button>
                <button class="btn btn-primary" type="submit" v-if="step!==props.steps.length-1">Next</button>
                
                <NuxtLink to="/app/" class="btn btn-primary" type="submit"  v-if="step==props.steps.length-1" @click="">Submit</NuxtLink>
            </div>
            
        </form>
    </div>
    
</template>