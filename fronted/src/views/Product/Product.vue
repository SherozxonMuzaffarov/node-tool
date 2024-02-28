<template>
  <div>
    <h5>Add Product</h5>
    <form @submit.prevent="addProduct">
      <label for="name">Name:</label>
      <input type="text" v-model="formData.name" required>

      <label for="quantity">Quantity:</label>
      <input type="number" v-model="formData.quantity" required>

      <label for="receiver_name">Receiver Name:</label>
      <input type="text" v-model="formData.receiver_name" required>

      <button type="submit">Add Product</button>
    </form>
    
    <h4>Product List</h4>
    <BTableSimple striped hover bordered class="mt-4 product-table">
      <BThead>
        <BTh class="col-1">ID</BTh>
        <BTh class="col-1">Berilgan vaqti</BTh>
        <BTh class="col-1">Image</BTh>
        <BTh class="col-2">FIO</BTh>
        <BTh class="col-2">PRODUCT NAME</BTh>
        <BTh class="col-1">Soni</BTh>
        <BTh class="col-1">status</BTh>
        <BTh class="col-1">Qaytarga vaqti</BTh>
        <BTh class="col-1">Qolgan vaqti</BTh>
        <BTh class="btns"></BTh>
        <BTh class="btns"></BTh>
      </BThead>
      <BTbody>
        <BTr v-for="(item, index) in products" :key="item._id">
          <BTh>{{ index + 1 }}</BTh>
          <BTd class="col-1">{{ item.createdAt}}</BTd>
          <BTd class="col-1">
            <img v-if="item.receiver_image" :src="'data:image/jpeg;base64,' + item.receiver_image" :alt="item.receiver_image">
            <BButton v-else @click="nestedModal1 = !nestedModal1" class="sm"><i class="bi bi-camera"></i></BButton>
          </BTd>
          <BTd class="col-2">{{ item.receiver_name }}</BTd>
          <BTd>{{ item?.name }}</BTd>
          <BTd class="col-1">{{ item?.quantity }}</BTd>
          <BTd class="btns">
            <button v-if="item.is_returned" class="btn btn-success m-0" >
              <i  class="bi bi-person-check-fill"></i>
            </button>
            <button v-else class="btn btn-danger m-0" @click="giveBack(item._id)">
              <i  class="bi bi-person-x-fill"></i>
            </button>
          </BTd>
          <BTd class="col-1">{{ item?.returned_date }}</BTd>
          <BTd class="col-1">{{ item?.daysRemaining }} kun</BTd>
          <!-- <BTd class="btns">
            <button @click="deleteItem(item._id)" class="btn btn-danger m-0">
              <i class="bi bi-trash-fill"></i>
            </button>
          </BTd> -->
        </BTr>
      </BTbody>
    </BTableSimple>

    <BModal v-model="nestedModal1" size="lg" title="First Modal" ok-only no-stacking>
      <label for="webcam">Take Photo:</label>
      <WebCamera />
    </BModal>
  </div>
  {{ products }}
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import WebCamera from '../../components/WebCam.vue';

const products = ref([]);
const nestedModal1 = ref(false)

const formData = ref({
  name: '',
  quantity: 0,
  receiver_name: '',
});

const getAll = async () => {
  try {
    const res = await axios.get('/product/all');
    if(res.data){
      console.log(res.data);
      products.value = res.data;
    }
  } catch (error) {
    console.error(error);
  }
}

const addProduct = async () => {
  try {
    const res = await axios.post('/product/create', formData.value);

    if (res.data) {
      getAll()
      formData.value.name = '';
      formData.value.quantity = 0;
      formData.value.receiver_name = '';
    }
  } catch (error) {
    console.error(error);
  }
};

//delete
const deleteItem = async (id) => {
    try {
        if (!id) return;
        let confirmDelete = confirm("Tasdiqlaysizmi?");
        if (confirmDelete) {
            try {
                let res = await axios.delete("/product/delete/" + id);
                alert("Ma'lumot o'chirildi");
                getAll();
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("Delete cancelled");
        }
    } catch (error) {
        console.error(error);
    }
};

//giveBack
const giveBack = async (id) => {
    try {
        if (!id) return;
        let confirmDelete = confirm("Vaqtida qaytarildimi?");
        if (confirmDelete) {
            try {
                let res = await axios.put("/product/update/" + id + '/return');
                alert("Ma'lumot Saqlandi");
                getAll();
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("Delete cancelled");
        }
    } catch (error) {
        console.error(error);
    }
};

onMounted(async () => {
  getAll()
});
</script>

<style scoped>
  .product-table img {
    max-height: 3rem /* Set the maximum height of the image to 100% of its container */
  }
</style>
