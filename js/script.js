// Lấy các phần tử cần thiết từ Html
const video = document.getElementById("videoBackground");
const sound = document.getElementById('sound');
const links = document.querySelectorAll("ul a");
const audioClick = document.getElementById("audioClick");
const audioHover = document.getElementById("audioHover");
const play1PlayerLink = document.getElementById('play1player-link');
const play2PlayerLink = document.getElementById('play2player-link');
const backgroundMusic = document.getElementById('backgroundMusic');
const control = document.getElementById('control-link');
const creditsLink = document.getElementById('credits-link');
const quitLink = document.getElementById('quit-link');
let isMusicPlaying = false;

// Xử lý sự kiện click vào biểu tượng âm thanh để chuyển đổi play/pause background music và cập nhật biểu tượng âm thanh
sound.addEventListener("click", () => {
    sound.classList.toggle("fa-volume-up");
    sound.classList.toggle("fa-volume-mute");
    
    if (isMusicPlaying) {
        backgroundMusic.pause();
        isMusicPlaying = false;
    } else {
        backgroundMusic.play();
        isMusicPlaying = true;
    }
    clickSound();
});

// Thêm sự kiện click và mouseenter (hover) cho từng liên kết trong menu
links.forEach(link => {
    link.addEventListener("click", clickSound);
    link.addEventListener("mouseenter", hoverSound);
});

// Phát âm thanh khi click vào các liên kết
function clickSound() {
    audioClick.play();
}

// Phát âm thanh khi di chuột qua
function hoverSound() {
    audioHover.play();
}

// Xử lý sự kiện khi click vào sẽ dẫn đến liên kết chơi dành cho một người
play1PlayerLink.addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a> để ngăn chặn điều hướng trang
    const nextPage = this.getAttribute('href');// Điều hướng sang trang mới sau khi chờ 0.2 giây (200 milliseconds)
    setTimeout(() => {
        window.location.href = nextPage;
    }, 200);
});

// Xử lý sự kiện khi click vào sẽ dẫn đến liên kết chơi dành cho hai người
play2PlayerLink.addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a> để ngăn chặn điều hướng trang
    const nextPage = this.getAttribute('href');// Điều hướng sang trang mới sau khi chờ 0.2 giây (200 milliseconds)
    setTimeout(() => {
        window.location.href = nextPage;
    }, 200);
});

// Xử lý sự kiện khi click vào Controls
control.addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a> để ngăn chặn điều hướng trang
    document.getElementById('fullscreen-image-container').style.display = 'flex';// Hiển thị hình ảnh phóng toàn màn hình
    clickSound();
});
// Đóng ảnh phóng toàn màn hình khi nhấp vào nút đóng
function closeFullscreenImage() {
    document.getElementById('fullscreen-image-container').style.display = 'none';
    clickSound();
}

// Xử lý sự kiện khi click Credits
creditsLink.addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>

    // Hiển thị slide credits
    document.getElementById('credits-slide').style.display = 'flex';
    clickSound();
});

// JavaScript để đóng slide credits khi nhấp vào nút đóng
function closeCreditsSlide() {
    document.getElementById('credits-slide').style.display = 'none';
    clickSound();
}

// Xử lý sự kiện khi click vào Quit
quitLink.addEventListener('click', function(event) {
    //Chưa Phát Triển :)))
});
