<template>
  <div>
    <h1>Add Product</h1>
    <form @submit.prevent="addProduct">
      <label for="name">Name:</label>
      <input type="text" v-model="FormData.name" required>

      <label for="quantity">Quantity:</label>
      <input type="number" v-model="FormData.quantity" required>

      <label for="receiver_name">Receiver Name:</label>
      <input type="text" v-model="FormData.receiver_name" required>

      <label for="webcam">Take Photo:</label>
      <WebCamera @photoCaptured="onPhotoCaptured" />

      <button type="submit">Add Product</button>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import WebCamera from '../../components/WebCam.vue';

const FormData = ref({
  name: '',
  quantity: 0,
  receiver_name: '',
  capturedImage: null,
});

const addProduct = async () => {
  try {
    const res = await axios.post('/product/create', FormData.value);

    if (res.data) {
      getAll();
      FormData.value.name = '';
      FormData.value.quantity = 0;
      FormData.value.receiver_name = '';
      FormData.value.capturedImage = null;
    }
  } catch (error) {
    console.error(error);
  }
};

const onPhotoCaptured = (imageData) => {
  FormData.value.capturedImage = imageData;
};
</script>
