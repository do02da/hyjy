const galleryImages = [];
const carouselModal = new bootstrap.Modal(document.getElementById('carousel-modal'));
const carousel = new bootstrap.Carousel(document.querySelector('#gallery-carousel'));

window.addEventListener('DOMContentLoaded', () => {
  // const autoplayVideoInterval = setInterval("autoplayVideo()", 200);

  init();
});

function init() {
  setGalleryImage();
  setMap();

  Kakao.init('2a9240996f44230b0d80348a3d797d99');

  setEvents();
}

/*
function autoplayVideo() {
  const promise = document.getElementById('bgm').play();
  if (promise !== undefined) {
    promise.then(function () {
      clearInterval(autoplayVideoInterval);
    }).catch(function (error) {});
  }
}
*/

async function setGalleryImage() {
  await fetch("./batch/fileList.json")
    .then((res) => res.json())
    .then((files) => {
      for (file of files) {
        const img = new Image();
        img.src = "./img/gallery/" + file.name;
        img.dataset.index = galleryImages.length;

        galleryImages.push(file.name);

        img.addEventListener('load', function() {
          if (this.naturalHeight > this.naturalWidth) {
            // 세로 이미지
            img.classList.add("grid-vertical");
          } else {
            // 가로 이미지
            img.classList.add("grid-horizontal");
          }
        });

        if (img.dataset.index >= 6 && img.dataset.index <= 8) img.classList.add("gradation");
        document.getElementById("gallery").appendChild(img);

        // 자세히 보기 Carousel 생성
        const carouselItem = document.createElement("div");
        carouselItem.dataset.imgIndex = img.dataset.index;
        carouselItem.classList = "carousel-item";
      
        const carouselImg = document.createElement("img");
        carouselImg.classList = "carousel-img";
        carouselImg.src = img.src;
        carouselItem.appendChild(carouselImg);

        document.getElementById("carousel-inner").appendChild(carouselItem);
      }

      /*
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5
      }; 
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fadeIn");
          }
        });
      }, options);
      
      const imageList = document.querySelectorAll(".gallery-grid img");
      imageList.forEach((el) => observer.observe(el));
      */
    });
}

function setMap() {
  const placePosition = new naver.maps.LatLng(37.5748439, 126.9790021);
  const mapOptions = {
    center: placePosition,
    zoom: 14,
    mapDataControl: false,
    scaleControl: false,

    draggable: !isMobile(),
    scrollWheel: !isMobile(),
    pinchZoom: false,
    keyboardShortcuts: false,
  };
  
  const map = new naver.maps.Map('map', mapOptions);
  new naver.maps.Marker({
    position: placePosition,
    map: map
  });
}

function setEvents() {
  /*
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("slide");
      }
    });
  }, options);
  
  const slideInList = document.querySelectorAll(".slideIn");
  slideInList.forEach((el) => observer.observe(el));
  */

  /*
  const audioButton = document.getElementById("audio-button");
  // BGM 음소거 On/Off 버튼
  audioButton.addEventListener("click", () => {
    const bgm = document.getElementById("bgm")

    const audioIcon = audioButton.querySelector("i");
    if (audioIcon.classList.contains("bi-volume-up")) {
      audioIcon.classList.remove("bi-volume-up");
      audioIcon.classList.add("bi-volume-mute");
      bgm.muted = true;
    } else {
      audioIcon.classList.remove("bi-volume-mute");
      audioIcon.classList.add("bi-volume-up");      
      bgm.muted = false;
    }
  });
  */

  // 갤러리 이미지 클릭 이벤트
  document.getElementById("gallery").addEventListener("click", (e) => {
    if (e.target.nodeName.toUpperCase() === "IMG") openGalleryModal(e.target.dataset.index);
  });

  // 사진 더 보기 버튼 클릭 이벤트
  document.getElementById("gallery-more-picture").addEventListener("click", (e) => {
    document.getElementById("gallery").classList.remove("preview");
    document.querySelectorAll(".gradation").forEach((img) => {
      img.classList.remove("gradation");
    });

    e.currentTarget.remove();
  });

  // 계좌 번호 복사
  document.getElementById("account-wrapper").addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("copy-account") || target.parentNode.classList.contains("copy-account")) {
      const accountNumber = target.closest(".account").getElementsByClassName("account-number")[0].innerText;

      window.navigator.clipboard.writeText(accountNumber);
      document.getElementById("confirm-modal-body").innerText = "계좌번호가 복사되었습니다.";
      new bootstrap.Modal(document.getElementById('confirm-modal'), {}).show();
      
    } else return;
  }, false);

  // 카카오톡 공유하기
  document.getElementById("share-kakao").addEventListener("click", () => {
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '혜연 ♥ 주영',
        description: '2024년 12월 7일 오전 11시\n아펠가모 광화문',
        imageUrl: 'https://do02da.github.io/hyjy/img/main-thumbnail.jpg',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [{
        title: '모바일 청첩장 보기',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      }],
    });
  });

  // 링크주소 공유하기
  document.getElementById("share-link").addEventListener("click", () => {
    window.navigator.clipboard.writeText(window.location.href);
    
    document.getElementById("confirm-modal-body").innerText = "링크주소가 복사되었습니다.";
    new bootstrap.Modal(document.getElementById('confirm-modal'), {}).show();
  });

  // 갤러리 모달 닫기
  document.querySelector(".carousel-modal-close").addEventListener("click", () => closeGalleryModal());
  document.getElementById("carousel-modal").addEventListener("click", (e) => {
    if (e.target.nodeName === "DIV") closeGalleryModal();
  });
}

function openGalleryModal(index) {
  document.querySelector(`.carousel-item[data-img-index='${index}']`).classList.add("active");;
  carouselModal.show();

  window.addEventListener("keydown", keyboardEvent);
}

function closeGalleryModal() {
  carouselModal.hide();

  document.querySelectorAll(".carousel-item").forEach((item) => item.classList.remove("active"));
  window.removeEventListener("keydown", keyboardEvent);
}

function keyboardEvent(e) {
  if (e.key === "ArrowLeft") {
    carousel.prev();
  } else if (e.key === "ArrowRight") {
    carousel.next();
  }
}

function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}