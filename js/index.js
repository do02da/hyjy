const galleryImages = [];
let isCanCarouselMove = true;

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
      }

      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5
      }; 
      

      /*
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
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5
  }; 
  /*
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
    if (target.classList.contains("copy-account")) {
      const accountNumber = target.parentNode.getElementsByClassName("account-number")[0].innerText;

      window.navigator.clipboard.writeText(accountNumber);
    } else return;
  });

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
    alert("주소가 복사되었습니다.");
  });

  // 갤러리 모달 닫기
  document.querySelector(".carousel-modal-close").addEventListener("click", () => closeGalleryModal());
  document.querySelector(".carousel-modal").addEventListener("click", (e) => {
    if (e.target.nodeName === "DIV") closeGalleryModal();
  });

  document.querySelector(".carousel-control-prev").addEventListener("click", () => moveCarousel("prev"));
  document.querySelector(".carousel-control-next").addEventListener("click", () => moveCarousel("next"));
  document.querySelector('#gallery-carousel').addEventListener('slid.bs.carousel', event => {
    document.querySelector(".carousel-item:not(.active)").remove();
    isCanCarouselMove = true;
  });
  // 터치 이벤트
  let startX = 0;
  document.querySelector('#gallery-carousel').addEventListener('touchstart', event => {
    if (event.target.classList.contains("carousel-img")) startX = event.touches[0].pageX;
  });
  document.querySelector('#gallery-carousel').addEventListener('touchend', event => {
    if (event.target.classList.contains("carousel-img")) {
      let endX = event.changedTouches[0].pageX;
      
      if (startX < endX) moveCarousel("prev");
      else moveCarousel("next");
    }
  });
}

function openGalleryModal(index) {
  document.querySelector(".carousel-modal").classList.add("show");
  document.body.classList.add("carousel-modal-open");

  const carouselItem = document.createElement("div");
  carouselItem.classList = "carousel-item active";

  const carouselImg = document.createElement("img");
  carouselImg.classList = "carousel-img";
  carouselImg.src = "./img/gallery/" + galleryImages[index];
  carouselImg.dataset.imgIndex = index;
  carouselItem.appendChild(carouselImg);

  document.querySelector(".carousel-inner").appendChild(carouselItem);

  window.addEventListener("keydown", (e) => keyboardEvent(e));
}

function closeGalleryModal() {
  document.querySelector(".carousel-modal").classList.remove("show");
  document.body.classList.remove("carousel-modal-open");

  document.querySelector(".carousel-inner").textContent = "";

  window.removeEventListener("keydown", keyboardEvent);
}

function moveCarousel(direction) {
  if (isCanCarouselMove) {
    isCanCarouselMove = false;

    let index = Number(document.querySelector(".carousel-item.active img").dataset.imgIndex);
    if (direction === "prev") {
      if (index === 0) index = galleryImages.length - 1;
      else index -= 1;
    } else if (direction === "next") {
      if (index === galleryImages.length - 1) index = 0;
      else index += 1;
    }
  
    const carouselItem = document.createElement("div");
    carouselItem.classList = "carousel-item";
  
    const carouselImg = document.createElement("img");
    carouselImg.classList = "carousel-img";
    carouselImg.src = "./img/gallery/" + galleryImages[index];
    carouselImg.dataset.imgIndex = index;
    carouselItem.appendChild(carouselImg);
  
    const bsCarousel = new bootstrap.Carousel(document.querySelector('#gallery-carousel'))
    const activeCarouselItem = document.querySelector(".carousel-item.active");
    if (direction === "prev") {
      document.querySelector(".carousel-inner").insertBefore(carouselItem, activeCarouselItem);
      bsCarousel.prev();
    } else if (direction === "next") {
      document.querySelector(".carousel-inner").appendChild(carouselItem);
      bsCarousel.next();
    }
  }
}

function keyboardEvent(e) {
  if (e.key === "ArrowLeft") {
    moveCarousel("prev")
  } else if (e.key === "ArrowRight") {
    moveCarousel("next")
  } else if (e.key === "Escape") {
    closeGalleryModal();
  }
}

function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}