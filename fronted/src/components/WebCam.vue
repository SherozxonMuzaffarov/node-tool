<template>
  <div class="web-camera-container">
    <div class="camera-button">
      <button type="button" class="btn is-rounded btn-info" @click="toggleCamera">
        <span v-if="!isCameraOpen">Open camera</span>
        <span v-else>Close camera</span>
      </button>
    </div>

    <div class="camera-loading" v-show="isCameraOpen && isLoading">
      <ul class="loader-circle">
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
    <div
      v-if="isCameraOpen"
      v-show="!isLoading"
      class="camera-box"
      :class="{ flash: isShotPhoto }"
    >
      <div class="camera-shutter" :class="{ flash: isShotPhoto }"></div>
      <video
        v-show="!isPhotoTaken"
        ref="camera"
        :width="450"
        :height="337.5"
        autoplay
      ></video>
      <canvas
        v-show="isPhotoTaken"
        id="photoTaken"
        ref="canvas"
        :width="450"
        :height="337.5"
      ></canvas>
    </div>

    <div v-if="isCameraOpen && !isLoading" class="camera-shoot">
      <button type="button" class="btn btn-danger" @click="takePhotoAndSend">
        <i class="bi bi-camera"> </i>
      </button>
    </div>
    <div class="camera-download" v-if="isPhotoTaken && isCameraOpen">
      <a
        role="button"
        id="downloadPhoto"
        download="my-photo.jpeg"
        class="button"
        @click="downloadImage"
      >
        Download
      </a>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  productId: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['update-success']);

const isCameraOpen = ref(false);
const isPhotoTaken = ref(false);
const isShotPhoto = ref(false);
const isLoading = ref(false);
let camera = ref(null);
let canvas = ref(null);

const toggleCamera = () => {
  if (isCameraOpen.value) {
    isCameraOpen.value = false;
    isPhotoTaken.value = false;
    isShotPhoto.value = false;
    stopCameraStream();
  } else {
    isCameraOpen.value = true;
    createCameraElement();
  }
};

const createCameraElement = () => {
  isLoading.value = true;
  const constraints = { audio: false, video: true };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      isLoading.value = false;
      camera.value.srcObject = stream;
    })
    .catch((error) => {
      isLoading.value = false;
      alert("The browser may not support or there is an error: " + error);
    });
};

const stopCameraStream = () => {
  let tracks = camera.value.srcObject.getTracks();

  tracks.forEach((track) => {
    track.stop();
  });
};

const takePhoto = () => {
  isPhotoTaken.value = true;
  const FLASH_TIMEOUT = 5;
  setTimeout(() => {
    isShotPhoto.value = false;
  }, FLASH_TIMEOUT);

  const context = canvas.value.getContext("2d");
  context.drawImage(camera.value, 0, 0, 450, 337.5);
};

const downloadImage = () => {
  const download = document.getElementById("downloadPhoto");
  const canvasData = canvas.value
    .toDataURL("image/jpeg")
    .replace("image/jpeg", "image/octet-stream");
  download.setAttribute("href", canvasData);
};

const takePhotoAndSend = async () => {
  // Take a photo
  takePhoto();

  // Convert base64 to Blob
  const base64Data = canvas.value.toDataURL("image/jpeg");
  const blob = await fetch(base64Data).then((res) => res.blob());
  
  const formData = new FormData();
  formData.append("image", blob, "my-photo.jpeg"); // Use the same field name as in upload.single('image')

  // Send the FormData to the server
  try {
    const res = await axios.put(`/product/update/${props.productId}` , formData);
    if (res.data) {
      emits('update-success');
      toggleCamera();
      stopCameraStream();
    }
  } catch (error) {
    console.error("Error sending image to the server:", error);
  }
};
</script>

<style scoped>
  .web-camera-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .camera-button {
    margin-bottom: 10px;
  }

  .camera-loading {
    margin-bottom: 10px;
  }

  .loader-circle {
    list-style-type: none;
    padding: 0;
    display: flex;
  }

  .loader-circle li {
    width: 10px;
    height: 10px;
    background-color: #333;
    border-radius: 50%;
    margin-right: 5px;
    animation: loader 0.8s infinite ease-in-out;
  }

  @keyframes loader {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  .camera-box {
    position: relative;
  }

  .camera-shutter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 10;
    display: none;
  }

  .camera-box.flash .camera-shutter {
    display: block;
    animation: flash 0.3s;
  }

  @keyframes flash {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  video {
    border-radius: 5px;
  }

  canvas {
    border-radius: 5px;
    margin-top: 10px;
  }

  .camera-shoot,
  .camera-download {
    margin-top: 10px;
  }
</style>
