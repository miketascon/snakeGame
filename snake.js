const myCanvas = document.getElementById('myCanvas');
const context = myCanvas.getContext('2d');

const SIZE = 20;

const head = {
    x: 0,
    y: 0,
};
const body = [];
let food = null;

let dx = 0;
let dy = 0;

let lastAxis;

setInterval(main, 200); // 1000ms = 1s

function main() {
    update(); // actualiza las variables del juegon 
    draw(); // dibuja los objetos del juego
}

function update() {
    const collisionDetected = checkSnakeCollision();
    if (collisionDetected) {
        gameOver();
        return;
    }

    //salvar la posisción previa de la serpiente
    let prevX, prevY;
    if (body.length) {
        prevX = body[body.length-1].x;
        prevY = body[body.length-1].y;
    } else {
        prevX = head.x;
        prevY = head.y;
    }

    // el cuerpo siga la cabeza de la serpiente
    for (let i = body.length - 1; i >=1; --i) {
        body[i].x = body[i-1].x;
        body[i].y = body[i-1].y;
    }
    if(body.length) { 
        body[0].x = head.x;
        body[0].y = head.y;
    }

    // metodo update se encarga de actualizar las cordenadas head
    head.x += dx; 
    head.y += dy;
    // determina en que eje ocurrio el último movivmiento
    if ( dx !== 0 ) {
        lastAxis = 'X';
    } else if (dy !== 0) {
        lastAxis = 'Y';
    }

    // dectar si ha consumido alimento del

    if (food) {
        if (head.x === food.x && head.y === food.y) {
            food = null;
            // aumentar el tamaño de la serpiente
            increaseSnakeSize(prevX, prevY);
        }
    }

    // genera el alimento en casos de que no exista
    if (!food) {
        food = randomFoodPosition();
    }
}

function checkSnakeCollision() {
    // coordenadas de la cabeza sean igual a un elemento del cuerpo de la swerpiente
    for (let i=0; i < body.length; ++i) {
        if (head.x == body[i].x && head.y == body[i].y) {
            return true;
        }
        
    }
    
    const topCollision = (head.y < 0);
    const bottonCollision = (head.y > myCanvas.height - SIZE);
    const rightCollision = (head.x > myCanvas.width - SIZE);
    const leftCollision = (head.x < 0)
    // verificar que la  no se salga de los limites permitidos
    if (topCollision || bottonCollision || leftCollision || rightCollision)   {
       return true;
    }

    return false;
}

function gameOver() {
    alert('You lose');
    head.x = 0;
    head.y = 0;
    dx = 0;
    dy = 0;
    body.length = 0;
}

function increaseSnakeSize(prevX, prevY) {
    body.push({
        x: prevX,
        y: prevY
    });
}

function randomFoodPosition() {
    let position
    do {        
        position = { x: getRandomX(), y: getRandomY()};
    } while(checkFoodCollision(position));
    return position;
}

function checkFoodCollision(position) {
    // comparar las cordenas del alimento generado
    for (let i=0; i < body.length; ++i) {
        if (position.x == body[i].x && position.y == body[i].y) {
            return true;
        }
    }

    // comparar las coordenadas del alimento con la cabeza de la serpiente
    if (position.x == head.x && position.y == head.y){
        return true;
    }

    return false;
}

function getRandomX() {
    return 20 * (parseInt(Math.random() * 20));
}

function getRandomY() {
    return 20 * parseInt(Math.random() * 23);
}

function draw() {

    // definir fondo
    context.fillStyle = 'black'
    context.fillRect(0, 0, myCanvas.width, myCanvas.height)
    // cabeza
    drawObject(head, 'lime');
    //Cuerpo
    body.forEach(elem => drawObject(elem, 'lime'));
    //ALIMENTO
    drawObject(food, 'white');
}

document.addEventListener('keydown', moveSanke);

function drawObject(obj, color) {
    context.fillStyle = color
    context.fillRect(obj.x, obj.y, SIZE, SIZE);
}

function moveSanke(event) {
    switch(event.key) {
        case 'ArrowUp':
            if (lastAxis !== 'Y') {
                dx = 0;
                dy = -SIZE;
                console.log('Mover hacia arriba');
            }
            break;
        case 'ArrowDown':
            if (lastAxis !== 'Y') {
                dx = 0;
                dy = +SIZE;
                console.log('Mover hacia abajo');
            }
            break;
        case 'ArrowRight':
            if (lastAxis !== 'X') {
                dx = +SIZE;
                dy = 0;
                console.log('Mover hacia la derecha');
            }
            break;
        case 'ArrowLeft':
            if (lastAxis !== 'X') {
                dx = -SIZE;
                dy = 0;
                console.log('Mover hacia la izquierda');
            }
            break;
    }
}