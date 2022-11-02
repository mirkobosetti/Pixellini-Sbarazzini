class Particle {
	constructor(effect, x, y, color) {
		this.effect = effect
		this.x = Math.random() * this.effect.width // x
		this.y = Math.random() * this.effect.height // y
		this.originX = Math.floor(x)
		this.originY = Math.floor(y)
		this.color = color
		this.size = this.effect.gap
		this.vx = 0 // Math.random() * 2 - 1
		this.vy = 0 // Math.random() * 2 - 1
		this.friction = 0.95
		this.ease = 0.02
		this.dx = 0
		this.dy = 0
		this.distance = 0
		this.force = 0
		this.angle = 0
	}

	draw(ctx) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.size, this.size)
	}

	update() {
		this.dx = this.effect.mouse.x - this.x
		this.dy = this.effect.mouse.y - this.y
		this.distance = this.dx * this.dx + this.dy * this.dy
		this.force = -this.effect.mouse.radius / this.distance

		if (this.distance < this.effect.mouse.radius) {
			this.angle = Math.atan2(this.dy, this.dx)
			this.vx += this.force * Math.cos(this.angle)
			this.vy += this.force * Math.sin(this.angle)
		}

		this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease
		this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease
	}

	warp() {
		this.x = Math.random() * this.effect.width
		this.y = Math.random() * this.effect.height
	}
}