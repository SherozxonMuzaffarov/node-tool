<template>
  <div>
    <h1>Add Product</h1>
    <form @submit.prevent="addProduct">
      <label for="name">Name:</label>
      <input type="text" v-model="formData.name" required>

      <label for="quantity">Quantity:</label>
      <input type="number" v-model="formData.quantity" required>

      <label for="receiver_name">Receiver Name:</label>
      <input type="text" v-model="formData.receiver_name" required>

      <button type="submit">Add Product</button>
    </form>
    <h1>Product List</h1>
    <div class="d-flex align-items-center column-gap-2">
      <p class="lead m-0">
        <i class="bi bi-house-door-fill"></i>Sexdagi mavjud shablonlar
      </p>
      <button class="btn btn-success" @click="$router.push('/product/create')">
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>
    <h2>Product List</h2>
    <BTableSimple striped hover bordered class="mt-4">
      <BThead>
        <BTh>ID</BTh>
        <BTh>FIO</BTh>
        <BTh>Soni</BTh>
        <BTh>PRODUCT NAME</BTh>
        <BTh class="btns"></BTh>
        <BTh class="btns"></BTh>
      </BThead>
      <BTbody>
        <BTr v-for="(item, index) in products" :key="item._id">
          <BTh>{{ index + 1 }}</BTh>
          <BTd>{{ item.receiver_name }}</BTd>
          <BTd>{{ item?.quantity }}</BTd>
          <BTd>{{ item?.name }}</BTd>
          <BTd class="btns">
            <BButton @click="nestedModal1 = !nestedModal1">open Camera</BButton>
            <!-- <WebCamera @photoCaptured="onPhotoCaptured" /> -->
            <!-- <button @click="getOne(item._id)" class="btn btn-primary m-0">
              <i class="bi bi-pen-fill"></i>
            </button> -->
          </BTd>
          <BTd class="btns">
            <button @click="deleteItem(item._id)" class="btn btn-danger m-0">
              <i class="bi bi-trash-fill"></i>
            </button>
          </BTd>
        </BTr>
      </BTbody>
    </BTableSimple>

    <BModal v-model="nestedModal1" size="lg" title="First Modal" ok-only no-stacking>
      <label for="webcam">Take Photo:</label>
      <WebCamera />
    </BModal>

  </div>
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

// getOne;
let getOne = async (id) => {
    try {
        let res = await axios.put("/product/update/" + id, );
        if (res.data) {
            FormData.value = res.data;
            modalUpdate.value = !modalUpdate.value;
        }
    } catch (error) {
        console.error(error);
    }
};

// update
const handleUpdate = async () => {
    let id = formData.value._id;
    try {
        let res = await axios.patch("/product/update/" + id, formData.value);
        if (res) {
            getAll();
            modalUpdate.value = !modalUpdate.value;
            formData.value.id = null;
            formData.value.name = null;
            formData.value.region_id = null, 
            formData.value.depo_boss_id = null,
            formData.value.depo_sklad_xodim_id = null
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

onMounted(async () => {
  getAll()
});
</script>
