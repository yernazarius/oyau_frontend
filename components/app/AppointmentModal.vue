<template>
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div class="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
        <!-- Appointment Details Form -->
        <div class="text-center mb-4">
          <span class="text-lg font-bold">New Booking for {{ selectedTime.display }}</span>
        </div>
        <div class="mb-4">
          <!-- Form fields -->
          <input type="text" placeholder="Client name" class="input input-bordered w-full mb-3" />
          <input type="text" placeholder="Phone number" class="input input-bordered w-full mb-3" />
          <input type="email" placeholder="Email" class="input input-bordered w-full mb-3" />
          <!-- Add more form fields as required -->
        </div>
        
        <!-- Close Modal Button -->
        <div class="text-right">
          <button 
            class="btn btn-primary" 
            @click="$emit('close-modal')"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      selectedTime: Object,
      selectedResource: Object
    }
  };
  </script>
  