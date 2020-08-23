const canvas = document.getElementById("particleScreen");
const ctx = canvas.getContext("2d");
const PARTICLE_COLOR = "#2C8CB3";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Particle{
    constructor(_x, _y, _directionX, _directionY, _size, _color){
        this.x = _x;
        this.y = _y;
        this.directionX = _directionX;
        this.directionY = _directionY;
        this.size = _size;
        this.color = _color;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    //update va verifica pozitia fiecarei particule si va redesena fiecare particula in functie de pozitia cursorului in canvas (esential pentru collision detection)
    update(){
        // verifica daca particula se afla inca in canvas
        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY;
        }

        // verifica collision detection cu cursorul
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < mouse.radius + this.size){
            //trebuie sa verificam din ce directie vine cursorul si sa ne asiguram ca particula se afla inca in canvas,
            //pentru ca coliziunea cu cercul care inconjoara cursorul sa aiba efect, iar buffer area intre canvas si particula este de 10 ori dimensiunea sa
           if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
               this.x += 10;
           }
           if(mouse.x > this.x && this.x > this.size * 10){
               this.x -= 10;
           }
           if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
               this.y += 10;
           }
           if(mouse.y > this.y && this.y > this.size * 10){
               this.y -= 10;
           }
        }
        // pentru formula asta, m-a ajutat foarte mult documentatia celor de la MDN https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        

        // codul de mai jos asigura ca particulele se vor misca in permanenta, pe axele lor, asta pana in momentul in care este intalnita coliziunea
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80) //raza cercului care inconjoara cursorul va fi d.p. cu dimensiunea canvasului
};


//un event listener pentru a afla pozitia cursorului in canvas
window.addEventListener("mousemove", event => {
    mouse.x = event.x;
    mouse.y = event.y;
})

let particles;

//va genera particule de dimensiuni random
function createParticles(){
    particles = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000; //numarul de particule va fi d.p. cu dimensiunea canvasului
    for(let i = 0; i < numberOfParticles; i++){
        let size = (Math.random() * 5) + 1;
        // punctele x si y vor fi random intre 0 si dimensiunea canvasului, 
        // iar dimensiunea unei particule va fi buffer area pentru a ne asigura ca nu se spawneaza in afara canvasului
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        // directionX si directionY reprezinta viteza de miscare pe axele respective, care va fi generata random intre -2.5 si 2.5
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = PARTICLE_COLOR;

        particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function gameLoop(){
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for(let i=0; i < particles.length; i++){
        particles[i].update();
    }

    connectParticles();
    requestAnimationFrame(gameLoop);
}

// verifica daca particulele sunt suficient de apropriate pentru a desena o linie de legatura intre ele
function connectParticles(){
    for(let a=0; a<particles.length; a++){
        for(let b=a; b<particles.length; b++){
            let distance = ((particles[a].x - particles[b].x)
            * (particles[a].x - particles[b].x)
            + (particles[a].y - particles[b].y) * 
            (particles[a].y - particles[b].y));

            if(distance < (canvas.width/7) * (canvas.height/7)){
                ctx.strokeStyle = "rgba(199, 231, 243, 1)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
    createParticles();
})

window.addEventListener("mouseout", () => {
    mouse.x = undefined;
    mouse.y = undefined;
})

createParticles();
gameLoop();