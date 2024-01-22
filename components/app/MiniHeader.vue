<template>
    <div class="p-0 m-0 flex items-center py-3">

                <!-- Sidebar -->
                <div class="drawer z-20 w-24">
                  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
                  <div class="drawer-content">
                    <!-- Page content here -->
                    <button for="my-drawer" class="relative group ml-3 ">
                    <label for="my-drawer">

                      <div class="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
                        <div class="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
                          <div class="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:translate-y-6 delay-100"></div>
                          <div class="bg-white h-[2px] w-7 rounded transform transition-all duration-300 group-focus:translate-y-6 delay-75"></div>
                          <div class="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:translate-y-6"></div>
              
                          <div class="absolute items-center justify-between transform transition-all duration-500 top-2.5 -translate-x-10 group-focus:translate-x-0 flex w-0 group-focus:w-12">
                            <div class="absolute bg-white h-[2px] w-5 transform transition-all duration-500 rotate-0 delay-300 group-focus:rotate-45"></div>
                            <div class="absolute bg-white h-[2px] w-5 transform transition-all duration-500 -rotate-0 delay-300 group-focus:-rotate-45"></div>
                          </div>
                        </div>
                      </div>
                    </label>
                    </button>
                  </div> 
                  <div class="drawer-side">
                    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                      <!-- Sidebar content here -->
                      <li><a>Sidebar Item 1</a></li>
                      <li><a>Sidebar Item 2</a></li>
                      
                    </ul>
                  </div>
                </div>




                
        <button class="btn btn-outline btn-sm mr-3 h-8">Today</button>
            <!-- Icon 7 -->
        <div class="border rounded-lg flex items-center mr-8 h-8">
            <button 
                type="button"
                class="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer  p-1 hover:bg-accent-content hover:text-neutral-content
                ">
                <svg class="h-6 w-6 inline-flex leading-none 
                " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>  
            </button>
            <div class="border-r inline-flex h-6"></div>		
            <button 
                type="button"
                class="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer  p-1 hover:bg-accent-content hover:text-neutral-content
                ">
                <svg class="h-6 w-6 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>									  
            </button>
        </div>
        <p class="text-2xl font-medium">
            {{ currentDate }}
        </p>
        
    </div>

</template>

<script>
var datetime = new Date();
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var day = days[datetime.getDay()];
var date = datetime.getDate();
var month = months[datetime.getMonth()];
let currentDate = date + " " + month + ", " + day;
export default {
    data() {
        return {
            currentDate: currentDate,


        }
    },
}
</script>