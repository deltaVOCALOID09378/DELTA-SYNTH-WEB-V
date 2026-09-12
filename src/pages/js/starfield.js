class Starfield {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 400;
        this.speed = 1.0;
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    init() {
        this.resize();
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * this.canvas.width,
                size: Math.random() * 1.5
            });
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    animate() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        for (let i = 0; i < this.numStars; i++) {
            let star = this.stars[i];
            star.z -= this.speed;
            
            if (star.z <= 0) {
                star.x = Math.random() * this.canvas.width;
                star.y = Math.random() * this.canvas.height;
                star.z = this.canvas.width;
            }
            
            const k = 128.0 / star.z;
            const px = (star.x - cx) * k + cx;
            const py = (star.y - cy) * k + cy;
            
            if (px >= 0 && px <= this.canvas.width && py >= 0 && py <= this.canvas.height) {
                const size = (1 - star.z / this.canvas.width) * 3;
                let shade = parseInt((1 - star.z / this.canvas.width) * 255);
                this.ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
                this.ctx.beginPath();
                this.ctx.arc(px, py, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Starfield('space-bg');
});
