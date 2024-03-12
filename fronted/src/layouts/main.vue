<template>
    <div class="container-fluid pt-1">
      <!-- Toggle button with house door icon -->
      <button class="btn btn-light btn-lg border-2 rounded-circle text-danger" @click="click">
        <i class="bi bi-list"></i>
    </button>
  
      <!-- Sidebar Offcanvas -->
      <BOffcanvas v-model="show">
        <!-- Sidebar Content -->
        <div class="sidebar-content">
          
          <BButton variant="primary w-100" class="mt-2" @click="click" :disabled="userData.role == 'User'">
            <router-link to="/user" class="text-decoration-none w-100 text-white"> 
              <i class="bi bi-box"></i>Foydalanuvchilar
            </router-link>
          </BButton>

          <BButton variant="primary w-100" class="mt-2" @click="click">
            <router-link to="/product" class="text-decoration-none w-100 text-white">
              <i class="bi bi-box"></i>Tools
            </router-link>
          </BButton>
  
  
          <!-- Logout Button -->
          <BButton class="mt-5" variant="primary w-100" @click="logout">
            <i class="bi bi-box-arrow-right"></i> Tizimdan chiqish
          </BButton>
        </div>
      </BOffcanvas>
  
      <!-- Main Content -->
      <RouterView />
    </div>
  </template>
  
  <script setup>
  import { RouterView, useRouter } from "vue-router";
  import { ref } from "vue";
  
  const show = ref(false);
  const router = useRouter();
  
  const userData = ref({});

  const storedUserData = localStorage.getItem("userData");
  try {
    if (storedUserData) {
      userData.value = JSON.parse(storedUserData);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
  
  const click = () => {
    show.value = !show.value;
  };
  
  const logout = () => {
    localStorage.clear();
    router.push("/login");
    // Reload the entire page after logout
    window.location.reload();
  };
  </script>
  
  <style lang="scss">
  .container-fluid {
    background-color: #f8f9fa; /* Light background color */
  }
  
  .sidebar-content {
    background-color: #343a40; /* Dark sidebar background color */
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar-content .card {
    background-color: #495057; /* Dark card background color */
  }
  
  .sidebar-link {
    color: #fff; /* White text color for links */
  }
  
  /* Add more custom styles as needed */
  </style>
  