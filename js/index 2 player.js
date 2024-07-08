// Lấy canvas và context từ HTML
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Lấy các âm thanh từ HTML
const attacksound = document.getElementById('attacksound');
const attacksound1 = document.getElementById('attacksound1');
const jumpsound = document.getElementById('jumpsound')
const jumpsound1 = document.getElementById('jumpsound1')
const runsound = document.getElementById('runsound')
const runsound1 = document.getElementById('runsound1')
const soundingame = document.getElementById('soundingame')

// Thiết lập kích thước của canvas
canvas.width = 1520
canvas.height = 845

// Đổ màu nền cho canvas
c.fillRect(0, 0, canvas.width, canvas.height)

// Định nghĩa trọng lực
const gravity = 0.7

// Background
const background = new Sprite({
  position: { x: 0, y: 61 },
  imageSrc: './img/background.png',
  scale: 0.631
})

// Tạo nhân vật người chơi (samuraiMack)
const player = new Fighter({
  position: { x: 380, y: 30 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2,
  offset: { x: 215, y: 157 },
  sprites: {
    idle: { imageSrc: './img/samuraiMack/Idle.png', framesMax: 8 },
    run: { imageSrc: './img/samuraiMack/Run.png', framesMax: 8 },
    jump: { imageSrc: './img/samuraiMack/Jump.png', framesMax: 2 },
    fall: { imageSrc: './img/samuraiMack/Fall.png', framesMax: 2 },
    attack1: { imageSrc: './img/samuraiMack/Attack1.png', framesMax: 6 },
    takeHit: { imageSrc: './img/samuraiMack/Take Hit - white silhouette.png', framesMax: 4 },
    death: { imageSrc: './img/samuraiMack/Death.png', framesMax: 6 },
    idle1: { imageSrc: './img/samuraiMack/Idle1.png', framesMax: 8 },
    run1: { imageSrc: './img/samuraiMack/Run1.png', framesMax: 8 },
    jump1: { imageSrc: './img/samuraiMack/Jump1.png', framesMax: 2 },
    fall1: { imageSrc: './img/samuraiMack/Fall1.png', framesMax: 2 },
    attack11: { imageSrc: './img/samuraiMack/Attack11.png', framesMax: 6 },
    takeHit1: { imageSrc: './img/samuraiMack/Take Hit - white silhouette1.png', framesMax: 4 },
    death1: { imageSrc: './img/samuraiMack/Death1.png', framesMax: 6 }
  },
  attackBox: {
    offset: { x: 100, y: 50 },
    width: 160,
    height: 50
  }
})

// Tạo nhân vật kẻ thù (kenji)
const enemy = new Fighter({
  position: { x: 1000, y: 100 },
  velocity: { x: 0, y: 0 },
  color: 'blue',
  offset: { x: -50, y: 0 },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2,
  offset: { x: 215, y: 167 },
  sprites: {
    idle: { imageSrc: './img/kenji/Idle.png', framesMax: 4 },
    run: { imageSrc: './img/kenji/Run.png', framesMax: 8 },
    dash: { imageSrc: './img/kenji/Run.png', framesMax: 8 },
    jump: { imageSrc: './img/kenji/Jump.png', framesMax: 2 },
    fall: { imageSrc: './img/kenji/Fall.png', framesMax: 2 },
    attack1: { imageSrc: './img/kenji/Attack1.png', framesMax: 4 },
    takeHit: { imageSrc: './img/kenji/Take hit.png', framesMax: 3 },
    death: { imageSrc: './img/kenji/Death.png', framesMax: 7 },
    idle1: { imageSrc: './img/kenji/Idle1.png', framesMax: 4 },
    run1: { imageSrc: './img/kenji/Run1.png', framesMax: 8 },
    dash1: { imageSrc: './img/kenji/Run1.png', framesMax: 8 },
    jump1: { imageSrc: './img/kenji/Jump1.png', framesMax: 2 },
    fall1: { imageSrc: './img/kenji/Fall1.png', framesMax: 2 },
    attack11: { imageSrc: './img/kenji/Attack11.png', framesMax: 4 },
    takeHit1: { imageSrc: './img/kenji/Take hit1.png', framesMax: 3 },
    death1: { imageSrc: './img/kenji/Death1.png', framesMax: 7 }
  },
  attackBox: {
    offset: { x: -170, y: 50 },
    width: 170,
    height: 50
  }
})

// Kiểm tra sự kiện bàn phím
const keys = {
  a: { pressed: false },
  d: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false }
}

// Bắt đầu đếm ngược thời gian
decreaseTimer()

// Hàm vẽ các frame và các hành động diễn ra trong game
function animate() {
  window.requestAnimationFrame(animate)
  soundingame.play()// Phát âm thanh của game
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)

  // Cập nhật background
  background.update();
  
  // Vẽ màu nền xuyên qua
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  // Cập nhật và vẽ người chơi và enemy
  player.update();
  enemy.update();
  
  // Đặt lại vận tốc x của player và enemy về 0
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Chọn sprite cho player dựa trên hướng mà player đang nhìn
  if (player.isFacingRight) {
    a = 'idle';
  } else {
    a = 'idle1';
  }
  player.attackCooldown = 800; // Tạo tốc độ đánh của người chơi bằng 0.8
  // Chọn sprite cho enemy dựa trên hướng mà enemy đang nhìn
  if (enemy.isFacingRight) {
    b = 'idle';
  } else {
    b = 'idle1';
  }
  enemy.attackCooldown = 1500 // Tạo tốc độ đánh của người chơi bằng 1.5
  // Di chuyển người chơi

  // Di chuyển người chơi
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run1')
    player.changeDirection('left')
    runsound.play()
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
    player.changeDirection('right')
    runsound.play()
  } else {
    player.switchSprite(a)
    runsound.pause()
  }
  // Chuyển sprite khi người chơi nhảy hoặc rơi
  if (player.velocity.y < 0 && player.isFacingRight) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0 && player.isFacingRight) {
    player.switchSprite('fall')
  } else if (player.velocity.y < 0) {
    player.switchSprite('jump1')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall1')
  }

  // Di chuyển kẻ thù
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.changeDirection('right')
    enemy.switchSprite('run')
    runsound1.play()
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.changeDirection('left')
    enemy.switchSprite('run1')
    runsound1.play()
  } else {
    enemy.switchSprite(b)
    runsound1.pause()
  }
  // Chuyển sprite khi enemy nhảy hoặc rơi
  if (enemy.velocity.y < 0 && enemy.isFacingRight) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0 && enemy.isFacingRight) {
    enemy.switchSprite('fall')
  } else if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump1')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall1')
  }

  // Phát hiện va chạm và xử lý khi kẻ thù bị đánh
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking && player.framesCurrent === 4
  ) {
    enemy.takeHit()
    attacksound.loop =false
    attacksound.play()
    
    player.isAttacking = false
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // Nếu người chơi tấn công nhưng không trúng kẻ thù
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // Phát hiện va chạm và xử lý khi người chơi bị đánh
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking && enemy.framesCurrent === 2
  ) {
    player.takeHit()
    attacksound1.loop =false
    attacksound1.play()
    enemy.isAttacking = false
    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // Nếu kẻ thù tấn công nhưng không trúng người chơi
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // Kiểm tra kết thúc trò chơi dựa trên máu
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

// Bắt đầu các chuyển dộng của nhân vật
animate()

// Kiểm tra xem phím có được nhấn xuống hay không
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'w':
      if(player.isGrounded)
        {
          player.velocity.y = -20
          jumpsound.loop=false
          jumpsound.play()  
        }
        break
    case 'f':
      player.attack()
      break
    case 's':
      player.dash()
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowUp':
      if(enemy.isGrounded)
        {
          enemy.velocity.y = -20
          jumpsound1.loop=false
          jumpsound1.play()
        }
        break
    case 'l':
      enemy.attack()
      break
    case 'ArrowDown':
      enemy.dash1()
      break
      case 'p':
        showPauseMenu();
        break;
  }
})

// Kiểm tra xem phím có được thả ra hay không
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})

