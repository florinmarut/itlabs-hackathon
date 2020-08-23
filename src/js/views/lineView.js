
// ms to wait until next paint
const delay = 8;

// could be async, maybe a promise
let mouseState = 0, isRunning = 0, progress = 0;


export const drawStatic = (activeCircuit) => {
    activeCircuit.staticLines.forEach(line => {
        line.getMappedPoints(activeCircuit.width, activeCircuit.height, activeCircuit.scale.x, activeCircuit.scale.y);
        line.drawLine(activeCircuit.context);
        line.drawCircle(activeCircuit.context,undefined,activeCircuit.bgColor);
    });
};


const drawProgress = (activeCircuit) => {
    const context = activeCircuit.context;

    // Update progress
    progress += mouseState ? 1 : -1;

    // Reset canvas and prep for dyn
    activeCircuit.context.clearRect(0, 0, activeCircuit.width, activeCircuit.height);
    drawStatic(activeCircuit);

    // Draw and shorten progress
    for (const line of activeCircuit.dynamicLines) {
        context.beginPath();
        context.strokeStyle = line.color;
        context.lineWidth = line.lineWidth;
        context.lineCap = 'round';

        line.drawLine(context, 'path', progress);
        if (progress >= line.path.length - 1) {
            line.drawCircle(context,undefined,activeCircuit.bgColor);
        }
        context.closePath();
    }

    // Update progress
    progress += mouseState ? 1 : -1;
};



const paintProgress = (activeCircuit, max) => {
    
    drawProgress(activeCircuit);

    if (mouseState && progress < max) {
        setTimeout(() => paintProgress(activeCircuit, max), delay);
    } else {
        isRunning = 0;
    }
}



const reverseProgress = (activeCircuit, max) => {
    if (progress != 0 && !mouseState) {

        // Reset canvas and prep for dyn
        activeCircuit.context.clearRect(0, 0, activeCircuit.width, activeCircuit.height);
        drawStatic(activeCircuit);

        drawProgress(activeCircuit)

        setTimeout(() => reverseProgress(activeCircuit), delay);
    }
};



export const drawDynamic = (activeCircuit) => {

    activeCircuit.circuit.addEventListener('mouseover', () => {
        let maxPoints = activeCircuit.pathLen;
        mouseState = 1;
        if(!isRunning && progress < maxPoints) {
            isRunning = 1;
            paintProgress(activeCircuit, maxPoints);
        }
    });

    // Custom mouseout to prevent events when moving mouse over children
    const onMouseOut = (e) => {
        let maxPoints = activeCircuit.pathLen;
        let circuit = e.relatedTarget.closest('.circuits');
        if(!circuit) {
            mouseState = 0;
            reverseProgress(activeCircuit, maxPoints);
        }
    }

    document.querySelector('body').addEventListener('mouseout', onMouseOut);
}