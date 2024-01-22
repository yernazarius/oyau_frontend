<template>
    <div class="min-h-screen">
      <div class="flex">
    <div class="pl-5 pt-6  shadow overflow-hidden rounded-lg pr-3">
        <div class="flex flex-col text-neutral-content mt-20 gap-4">
          <div v-for="(time, index) in times_column" :key="index">
            <div class="font-bold text-2xl leading-none">
              {{ time.hour }}
            </div>
            <div class="text-lg leading-tight mt-2">
              {{ time.half }}
            </div>
        </div>
        </div>
      </div>
  
        <div class="flex-1 flex overflow-auto">
          <div class="flex flex-col">
            <div class="flex gap-8 py-4 sticky top-0 z-1">
              <div v-for="resource in resources" :key="resource.id" class="flex flex-col items-center" style="min-width: 150px;">
                <div class="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mb-2">
                  <span class="text-sm">{{ resource.shortName }}</span>
                </div>
                <div class="text-sm">{{ resource.name }}</div>
                <div class="text-xs text-gray-400">{{ resource.specialization }}</div>
              </div>
            </div>
            <div class="flex gap-8">
                <div v-for="resource in resources" :key="resource.id">
                  <div v-for="hour in times" :key="`${resource.id}-${hour}`" class="slot flex-col ">
                    <button class="quarter-slot " @click="openBookingModal(hour, resource, '00')" :data-time="`${hour}:00 New Booking`">{{hour}}:00 New Booking</button>
                    <button class="quarter-slot " @click="openBookingModal(hour, resource, '15')" :data-time="`${hour}:15 New Booking`">{{hour}}:15 New Booking</button>
                    <button class="quarter-slot" @click="openBookingModal(hour, resource, '30')" :data-time="`${hour}:30 New Booking`">{{hour}}:30 New Booking</button>
                    <button class="quarter-slot" @click="openBookingModal(hour, resource, '45')" :data-time="`${hour}:45 New Booking`">{{hour}}:45 New Booking</button>
                  </div>
                </div>
              </div>
            <!-- end -->
          </div>
        </div>
      </div>
      <AppAppointmentModal v-if="showModal" :selected-time="selectedTime" :selected-resource="selectedResource" @close-modal="showModal = false"/>
    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      showModal: false,
      selectedTime: null,
      selectedResource: null,
      times: this.generateQuarterHourTimes(),
      times_column: [
        { hour: '00 00', half: '30' },
        { hour: '01 00', half: '30' },
        { hour: '02 00', half: '30' },
        { hour: '03 00', half: '30' },
        { hour: '04 00', half: '30' },
        { hour: '05 00', half: '30' },
        { hour: '06 00', half: '30' },
        { hour: '07 00', half: '30' },
        { hour: '08 00', half: '30' },
        { hour: '09 00', half: '30' },
        { hour: '10 00', half: '30' },
        { hour: '11 00', half: '30' },
        { hour: '12 00', half: '30' },
        { hour: '13 00', half: '30' },
        { hour: '14 00', half: '30' },
        { hour: '15 00', half: '30' },
        { hour: '16 00', half: '30' },
        { hour: '17 00', half: '30' },
        { hour: '18 00', half: '30' },
        { hour: '19 00', half: '30' },
        { hour: '20 00', half: '30' },
        { hour: '21 00', half: '30' },
        { hour: '22 00', half: '30' },
        { hour: '23 00', half: '30' },
      ],

      resources: [
        { id: 1, shortName: 'M1', name: 'Малая 1', specialization: 'Малый гостевой дом' },
        { id: 2, shortName: 'M2', name: 'Малая 2', specialization: 'Малый гостевой дом 2' },
        // ... other resources
      ]
    };
  },
  methods: {
    openBookingModal(time, resource, quarter) {
      this.selectedTime = `${time}:${quarter}`;
      this.selectedResource = resource;
      this.showModal = true;
    },
    generateQuarterHourTimes() {
      let times = [];
      for (let hour = 0; hour < 24; hour++) {
        let hourPadded = hour.toString().padStart(2, '0');
        times.push(hourPadded); // Just push hours, not minutes
      }
      return times;
    },
  }

};
function generateQuarterHourTimes() {
      let times = [];
      for (let hour = 0; hour < 24; hour++) {
        let hourPadded = hour.toString().padStart(2, '0');
        times.push(`${hourPadded}:00`, `${hourPadded}:15`, `${hourPadded}:30`, `${hourPadded}:45`);
      }
      return times;
    };
console.log(generateQuarterHourTimes());
</script>
<style scoped>
.slot {
  width: 150px;
  height: 70px; /* Adjusted for four quarter-hour slots */
  border-bottom: 1px solid #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.quarter-slot {
  width: 100%;
  height: 25%; /* Quarter of the slot height */
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  font-size: 10px; /* Smaller font size for quarter slots */
  text-align: center;
  opacity: 0; /* Hide text initially */
}

.quarter-slot:hover {
  opacity: 1; /* Show text on hover */
  background-color: #4A90E2;
  transform: scale(1.1);
  color: white; /* Text color */
}

.slot:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
