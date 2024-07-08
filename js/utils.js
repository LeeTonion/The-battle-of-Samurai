
let pause = false;
let time = true;
// Hàm kiểm tra va chạm hình chữ nhật giữa hai đối tượng
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

// Hàm xác định người chiến thắng
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId); // Dừng đếm ngược
  document.querySelector('#displayText').style.display = 'flex'; // Hiển thị kết quả

  // Xác định người chiến thắng dựa trên sức khỏe của người chơi và địch
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'; // Hòa

    startmenu(); // Hiển thị menu bắt đầu lại
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'; // Người chơi 1 thắng

    startmenu(); // Hiển thị menu bắt đầu lại
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'; // Người chơi 2 thắng

    startmenu(); // Hiển thị menu bắt đầu lại
    
  }
}

let timer = 105; // Thời gian ban đầu
let timerId; // ID của hàm đếm ngược

// Hàm giảm thời gian đếm ngược
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000); // Gọi lại hàm sau mỗi giây
    if (time){timer--;} // Giảm thời gian
    if (timer <= 100) {
      document.querySelector('#timer').innerHTML = timer; // Cập nhật hiển thị thời gian
    }
  }

  // Nếu hết thời gian, xác định người chiến thắng
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

// Sự kiện DOMContentLoaded để bắt đầu khi tài liệu HTML đã tải xong
document.addEventListener("DOMContentLoaded", function() {
  var countdownContainer = document.getElementById("countdownContainer"); // Lấy container đếm ngược
  var countdownElement = document.getElementById("countdownTimer"); // Lấy phần tử hiển thị thời gian đếm ngược
  var alertMessage = document.getElementById("alertMessage"); // Lấy thông báo cảnh báo
  var countdownValue = 3; // Thời gian đếm ngược ban đầu với 3 giây

  // Hàm cập nhật đếm ngược
  function updateCountdown() {
    countdownElement.textContent = countdownValue; // Hiển thị giá trị đếm ngược
    if (countdownValue > 0) {
      countdownValue--; // Giảm giá trị đếm ngược
    } else {
      clearInterval(interval); // Dừng đếm ngược
      countdownContainer.style.display = "none"; // Ẩn container đếm ngược
      showEndAlert(); // Hiển thị thông báo tương ứng
    }
  }

  // Hàm hiển thị thông báo và tự động ẩn sau một khoảng thời gian
  function showEndAlert() {
    alertMessage.style.display = "block"; // Hiển thị thông báo
    setTimeout(function() {
      alertMessage.style.display = "none"; // Tự động ẩn thông báo sau 2 giây 
    }, 2000); // Hiển thị thông báo trong 2 giây 
  }

  // Gọi hàm bắt đầu đếm ngược khi bắt đầu trận đấu
  countdownContainer.style.display = "flex"; // Hiển thị container đếm ngược
  var interval = setInterval(updateCountdown, 1000); // Gọi updateCountdown mỗi giây (1000 mili giây)

});

// Hàm hiển thị menu game over
function showGameOverMenu() {
  document.getElementById("gameOverMenu").style.display = "block"; // Hiển thị menu game over

}
// Hàm hiển thị menu game over
function showPauseMenu() {
  var gamePauseMenu = document.getElementById("gameOverMenu");

  // Nếu menu game over đang hiển thị, ẩn nó đi
  if (pause) {
    gamePauseMenu.style.display = "none";
    pause = false;
    time= true
    enemyMove =true;
    
  } else { // Nếu menu game over đang ẩn, hiển thị nó lên
    gamePauseMenu.style.display = "block";
    pause = true;
    time = false;
    enemyMove =false;
    player.velocity.x = 0;
    enemy.velocity.x = 0;
    start = false
  }
}

// Hàm khởi động lại trò chơi
function restartmenu() {
  window.location.href = "index.html"; // Chuyển hướng đến trang menu (thay đổi đường dẫn nếu cần thiết)
}

// Hàm tải lại trang để khởi động lại trò chơi
function restartgame() {
  location.reload(); // Tải lại trang
}
// Hàm hiển thị menu bắt đầu lại sau 3 giây
function startmenu() {
  setTimeout(() => {
    showGameOverMenu(); // Hiển thị menu game over
  }, 3000); // Hiển thị menu sau 3 giây
}


