let videoStream;

const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function initVideo(constraints) {
  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      startStream(stream);
    })
    .catch(logError);
}

function startStream(stream) {
  videoStream = stream;

  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    video.src = window.URL.createObjectURL(stream);
  }

  video.play();
}

function stopStream() {
  if (videoStream) {
    videoStream.getTracks()[0].stop();
  }
}

function logError(error) {
  alert('Camera initialization failed. Make sure that your camera supports HD resolution.')
  console.log(error.name + ": " + error.message);
}

function getFrame(callback) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(callback, 'image/png', 1.0);
}

function checkLiveness(image) {
  let dict = new FormData();
  dict.append('image', image);

  let req = new XMLHttpRequest();
  req.open('POST', 'https://******/check_liveness', true)
  req.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      alert(req.responseText);
    }
  }

  req.send(dict);
}



const constraints = {
  audio: false,
  video: {
    facingMode: "user",
    width: { min: 720, ideal: 1280, max: 1280 },
    height: { min: 720, ideal: 720, max: 1280 }
  }
};

window.onload = function() {
  initVideo(constraints);
}

const button = document.querySelector('button');
button.addEventListener('click', function() {
  getFrame(function(frame) {
    checkLiveness(frame);
  })
});
