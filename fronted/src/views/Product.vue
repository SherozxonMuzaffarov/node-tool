<template>
  <div>
    <h5>Tools</h5>
    <!-- v-show="storedUserData.role == 'Admin'"  -->
    <div class="btn-group m-3" role="group" aria-label="Basic radio toggle button group" v-if="userData.role == 'Admin'">
            <div v-for="depo in depos" :key="depo.value">
                <input
                type="radio"
                class="btn-check"
                name="btnradio"
                :id="depo.value"
                :value="depo.value"
                autocomplete="off"
                v-model="selectedDepo"
                :checked="depo.value === defaultDepo"
                />
                <label class="btn btn-outline-success" :for="depo.value">{{ depo.text }}</label>
            </div>
        </div>
    
    <form class="add-product-form mt-3" @submit.prevent="addProduct">
      <div class="row">
        <div class="form-group col-3">
          <label for="name">Instrument nomi:</label>
          <input type="text" class="form-control" v-model="formData.name" required>
        </div>

        <div class="form-group col-3">
          <label for="quantity">Soni:</label>
          <input type="number" class="form-control" v-model="formData.quantity" required>
        </div>

        <div class="form-group col-3">
          <label for="receiver_name">Oluvchi FIO:</label>
          <input type="text" class="form-control" v-model="formData.receiver_name" required>
        </div>
        <div class="form-group col-3">
          <button type="submit" class="btn btn-primary mt-4">Add Product</button>
        </div>
      </div>
    </form>
    <BTableSimple striped hover bordered class="mt-4 product-table">
      <BThead>
        <BTh class="col">ID</BTh>
        <BTh class="col">Berilgan vaqti</BTh>
        <BTh class="col">Image</BTh>
        <BTh class="col">FIO</BTh>
        <BTh class="col">Tools</BTh>
        <BTh class="col">Soni</BTh>
        <BTh class="col">Status</BTh>
        <BTh class="col">Qaytarga vaqti</BTh>
        <BTh class="col">Qolgan vaqti</BTh>
        <BTh class="col">Depo</BTh>
      </BThead>
      <BTbody>
        <BTr v-for="(item, index) in products" :key="item._id">
          <BTh>{{ index + 1 }}</BTh>
          <BTd >{{ item.createdAt}}</BTd>
          <BTd >
            <img @click="showImage(item.receiver_image)" v-if="item.receiver_image" :src="'data:image/jpeg;base64,' + item.receiver_image" :alt="item.receiver_image">
            <BButton v-else @click="openCameraModal(item._id)" class="sm"><i class="bi bi-camera"></i></BButton>
          </BTd>
          <BTd >{{ item.receiver_name }}</BTd>
          <BTd>{{ item?.name }}</BTd>
          <BTd >{{ item?.quantity }}</BTd>
          <BTd class="btns">
            <button v-if="item.is_returned" class="btn btn-success m-0" >
              <i  class="bi bi-person-check-fill"></i>
            </button>
            <button v-else class="btn btn-danger m-0" @click="giveBack(item._id)">
              <i  class="bi bi-person-x-fill"></i>
            </button>
          </BTd>
          <BTd >{{ item?.returned_date }}</BTd>
          <BTd >{{ item?.daysRemaining }} kun</BTd>
          <BTd >{{ item?.depo }}</BTd>
        </BTr>
      </BTbody>
    </BTableSimple>

    <BModal v-model="nestedModal1" size="lg" title="First Modal" ok-only no-stacking>
      <label for="webcam">Take Photo:</label>
      <WebCamera :productId="selectedProductId"  @update-success="handleUpdateSuccess"/>
    </BModal>

    <!-- Image Modal -->
    <BModal v-model="showImageModal" size="md" no-stacking>
      <img :src="selectedImageSrc" class="img-fluid" alt="Product Image">
    </BModal>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import WebCamera from '../components/WebCam.vue';

const products = ref([]);
const selectedProductId = ref('');
const nestedModal1 = ref(false)
const showImageModal = ref(false);
const selectedImageSrc = ref('');

const selectedDepo = ref('');
const defaultDepo = ref('');
const userData = ref({});

let depos = ref([
  {value: 'O\'zvagonta\'mir', text: 'O\'zvagonta\'mir'},
  {value: 'VCHD-3', text: 'VCHD-3'},
  {value: 'VCHD-5', text: 'VCHD-5'},
  {value: 'VCHD-6', text: 'VCHD-6'},
]);

const formData = ref({
  name: '',
  quantity: 0,
  receiver_name: '',
  depo: selectedDepo.value
});

// Define the formatDate function
function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'UTC'
  };

  const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
  return formattedDate;
}

const getAll = async () => {
  try {
    const res = await axios.get(`/product/all?depo=${encodeURIComponent(selectedDepo.value)}`);
    if(res.data){
      products.value = res.data.map(item => {
        item.createdAt = formatDate(item.createdAt);
        item.returned_date = formatDate(item.returned_date);
        return item;   
      });
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
      let res = await axios.put("/product/update/" + id + '/return');
      if (res) {
        alert("Ma'lumot Saqlandi");
        getAll();
      }    
    } catch (error) {
        console.error(error);
    }
};

const openCameraModal = (productId) => {
    selectedProductId.value = productId;
    nestedModal1.value = !nestedModal1.value
};

const handleUpdateSuccess = () => {
  getAll(); // Call the getAll function when the update is successful
};

const showImage = (imageData) => {
  selectedImageSrc.value = `data:image/jpeg;base64,${imageData}`;
  showImageModal.value = true;
}

watch(
  selectedDepo,
  async () => {
    if (selectedDepo.value !== undefined) {
      getAll();
    }
  },
  { deep: true }
);

onMounted(async () => {
  const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    userData.value = JSON.parse(storedUserData);
    selectedDepo.value = userData.value.depo
    defaultDepo.value = userData.value.depo
    formData.value.depo = userData.value.depo
  }
  getAll()
});
</script>

<style scoped>
  .product-table img {
    max-height: 3rem;
  }
</style>
