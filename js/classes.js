// Lấy các âm thanh từ HTML
const attackfail = document.getElementById('attackfail'); 
const landingsound = document.getElementById('landingsound'); 
const dashsound = document.getElementById('dashsound'); 

class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 }
  }) {
    // Khởi tạo sprite
    this.position = position; // Vị trí của sprite
    this.width = 50; // Độ rộng của sprite
    this.height = 150; // Độ cao của sprite
    this.image = new Image(); // Khởi tạo đối tượng hình ảnh
    this.image.src = imageSrc; // Đường dẫn đến hình ảnh của sprite
    this.scale = scale; // Tỉ lệ phóng to/thu nhỏ sprite
    this.framesMax = framesMax; // Số lượng frame tối đa của sprite
    this.framesCurrent = 0; // Frame hiện tại của sprite
    this.framesElapsed = 0; // Số frame đã trôi qua
    this.framesHold = 5; // Thời gian giữa các frame
    this.offset = offset; // Độ lệch của sprite
  }

  // Vẽ sprite lên canvas
  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  // Chuyển đổi frame để tạo hiệu ứng chuyển động
  animateFrames() {
    if (this.isFacingRight) {
      this.framesElapsed++;
      if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMax - 1) {
          this.framesCurrent++;
        } else {
          this.framesCurrent = 0;
        }
      }
    } else {
      this.framesElapsed++;
      if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent > 0) {
          this.framesCurrent--;
        } else {
          this.framesCurrent = this.framesMax - 1;
        }
      }
    }
  }

  // Cập nhật sprite trên canvas
  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined }
  }) {
    // Khởi tạo nhân vật
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    });

    this.velocity = velocity; // Vận tốc của nhân vật
    this.width = 50; // Độ rộng của nhân vật
    this.height = 150; // Độ cao của nhân vật
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    }; // Hộp tấn công của nhân vật
    this.color = color; // Màu sắc của nhân vật
    this.isAttacking; // Trạng thái đang tấn công
    this.health = 100; // Máu của nhân vật
    this.framesCurrent = 0; // Frame hiện tại của nhân vật
    this.framesElapsed = 0; // Số frame đã trôi qua
    this.framesHold = 5; // Thời gian giữa các frame
    this.sprites = sprites; // Các sprite của nhân vật
    this.dead = false; // Trạng thái chết của nhân vật
    this.isGrounded = false; // Trạng thái đang chạm đất của nhân vật
    this.isFacingRight = true; // Trạng thái hướng nhìn của nhân vật (phải/trái)
    this.isDashing = false; // Trạng thái lướt của nhân vật
    this.isDashing1 = false; // Trạng thái lướt ngược của nhân vật
    this.dashSpeed = 50; // Tốc độ lướt của nhân vật
    this.dashDuration = 5; // Thời gian lướt của nhân vật
    this.dashElapsed = 0; // Thời gian đã lướt của nhân vật
    this.canAttack = true; // Có thể tấn công hay không
    this.attackCooldown ; // Thời gian hồi chiêu tấn công
    this.canDash = true; // Có thể lướt hay không
    this.dashCooldown = 1000; // Thời gian hồi chiêu lướt

    // Tải các hình ảnh cho sprite của nhân vật
    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
    }
  }   
  // Hành động lướt của nhân vật
  dash() {
    if (!this.canDash) return; // Nếu không thể lướt, thoát khỏi hàm
    if (!this.isDashing) {
      this.isDashing = true;
      this.dashElapsed = 0;
      dashsound.loop = false;
      dashsound.play();
      this.canDash = false;

      // Đặt lại trạng thái có thể lướt sau thời gian hồi chiêu
      setTimeout(() => {
        this.canDash = true;
      }, this.dashCooldown);
    }
  }

  // Hành động lướt ngược của nhân vật
  dash1() {
    if (!this.canDash) return; // Nếu không thể lướt, thoát khỏi hàm
    if (!this.isDashing1) {
      this.isDashing1 = true;
      this.dashElapsed = 0;
      dashsound.loop = false;
      dashsound.play();
      this.canDash = false;

      // Đặt lại trạng thái có thể lướt sau thời gian hồi chiêu
      setTimeout(() => {
        this.canDash = true;
      }, this.dashCooldown);
    }
  }

  // Cập nhật hành động của nhân vật
  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    // Cập nhật vị trí hộp tấn công
    if (this.isFacingRight) 
      {
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
      } 
    else 
      {
        this.attackBox.position.x = this.position.x + this.width - this.attackBox.offset.x - this.attackBox.width;
      }
      this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Xử lý hành động lướt của nhân vật
    if (this.isDashing) {
      if (this.dashElapsed < this.dashDuration) {
        this.position.x += this.isFacingRight ? this.dashSpeed : -this.dashSpeed;
        this.dashElapsed++;
      } else {
        this.isDashing = false;
      }
    }
    if (this.isDashing1) {
      if (this.dashElapsed < this.dashDuration) {
        this.position.x +=
          this.isFacingRight ? -this.dashSpeed : this.dashSpeed;
        this.dashElapsed++;
      } else {
        this.isDashing1 = false;
      }
    } else {
      // Cập nhật vị trí của nhân vật
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      //Kiểm tra nhân vật có chạm đất hay không 
      if (this.position.y + this.height + this.velocity.y >= canvas.height - 40) {
        this.velocity.y = 0;
        this.position.y = 670;
        if (this.isGrounded == false) {
          this.isGrounded = true; // Cập nhật trạng thái isGrounded khi nhân vật chạm đất
          landingsound.loop = false;
          landingsound.play();
        }
      } else {
        this.velocity.y += gravity;
        this.isGrounded = false; // Cập nhật trạng thái isGrounded khi nhân vật không chạm đất
      }
      // Kiểm tra biên trái
      if (this.position.x < 0) {
        this.position.x = 0;
      }

      // Kiểm tra biên phải
      if (this.position.x + this.width > canvas.width) {
        this.position.x = canvas.width - this.width;
      }
    }
  }

  // Hành động tấn công của nhân vật
  attack() {
    if (!this.canAttack) return; // Nếu không thể tấn công, thoát khỏi hàm
    if (this.isFacingRight) {
      this.switchSprite('attack1');
    } else {
      this.switchSprite('attack11');
    }
    attackfail.loop = false;
    attackfail.play();
    this.isAttacking = true;
    this.canAttack = false; // Đặt trạng thái không thể tấn công
    // Đặt lại trạng thái có thể tấn công sau thời gian hồi chiêu kết thúc
    setTimeout(() => {
      this.canAttack = true;
    }, this.attackCooldown);
  }
  // Nhân vật nhận sát thương
  takeHit() {
    this.health -= 5;
    // Chọn sprite phản ứng khi nhận sát thương
    let sprite;
    if (this.isFacingRight) {
      sprite = 'takeHit';
    } else {
      sprite = 'takeHit1';
    }
    // Chuyển sprite phản ứng khi nhận sát thương
    if (this.health <= 0) {
      if (this.isFacingRight) {
        this.switchSprite('death');
      } else {
        this.switchSprite('death1');
      }
    } else this.switchSprite(sprite);
  }

  // Chuyển đổi sprite của nhân vật
  switchSprite(sprite) {
    // Kiểm tra nếu nhân vật đang ở trạng thái chết
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.framesMax - 1) this.dead = true;
      return;
    }
    if (this.image === this.sprites.death1.image) {
      if (this.framesCurrent === 0) this.dead = true;
      return;
    }

    // Kiểm tra và cập nhật sprite được chạy đến hết
    if (this.image === this.sprites.attack1.image && this.framesCurrent < this.framesMax - 1) return;
    if (this.image === this.sprites.attack11.image && this.framesCurrent > 0) return;
    
    if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.framesMax - 1) return;
    if (this.image === this.sprites.takeHit1.image && this.framesCurrent > 0) return;

    // Chuyển đổi sprite 
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'idle1':
        if (this.image !== this.sprites.idle1.image) {
          this.image = this.sprites.idle1.image;
          this.framesMax = this.sprites.idle1.framesMax;
          this.framesCurrent = this.framesMax - 1;
        }
        break;
      case 'run1':
        if (this.image !== this.sprites.run1.image) {
          this.image = this.sprites.run1.image;
          this.framesMax = this.sprites.run1.framesMax;
          this.framesCurrent = this.framesMax - 1;
        }
        break;
      case 'jump1':
        if (this.image !== this.sprites.jump1.image) {
          this.image = this.sprites.jump1.image;
          this.framesMax = this.sprites.jump1.framesMax;
          this.framesCurrent = this.framesMax - 1;
        }
        break;
      case 'fall1':
        if (this.image !== this.sprites.fall1.image) {
          this.image = this.sprites.fall1.image;
          this.framesMax = this.sprites.fall1.framesMax;
          this.framesCurrent = this.framesMax - 1;
        }
        break;
      case 'attack11':
        if (this.image !== this.sprites.attack11.image) {
          this.image = this.sprites.attack11.image;
          this.framesMax = this.sprites.attack11.framesMax;
          this.framesCurrent = this.framesMax - 1;
        }
        break;
      case 'takeHit1':
        if (this.image !== this.sprites.takeHit1.image) {
          this.image = this.sprites.takeHit1.image;
          this.framesMax = this.sprites.takeHit1.framesMax;
          this.framesCurrent = this.framesMax - 1;
        }
        break;
      case 'death1':
        if (this.image !== this.sprites.death1.image) {
          this.image = this.sprites.death1.image;
          this.framesMax = this.sprites.death1.framesMax;
          this.framesCurrent = this.framesMax - 1;
        }
        break;
    }
  }
  // Thay đổi hướng nhìn của nhân vật
  changeDirection(direction) {
    if (direction === 'left' && this.isFacingRight) {
      this.isFacingRight = false;
    } else if (direction === 'right' && !this.isFacingRight) {
      this.isFacingRight = true;
    }
  }
}