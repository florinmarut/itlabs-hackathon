/**
 * CIRCUITS API
 */

import Ciruit from './models/Circuit';
import Line from './models/Line';
import * as lineView from './views/lineView';
import { domStrings } from './models/base';
import { nodeName } from 'jquery';


const canvasResize = (circuit) => {
    circuit.getCanvasSize();
    circuit.setCanvasSize();
}

export const getData = (list, circuit) => {
    const lines = [];
    list.forEach(obj => {
        let newLine = new Line(obj.points, obj.color, obj.lineWidth);
        newLine.getMappedPoints(circuit.width, circuit.height, circuit.scale.x, circuit.scale.y);
        lines.push(newLine);
    });
    return lines;
};

export const resize = (circuit) => {
    canvasResize(circuit);
    lineView.drawStatic(circuit);

    circuit.dynamicLines.forEach(line => {
        line.getMappedPoints(circuit.width, circuit.height, circuit.scale.x, circuit.scale.y);
        line.calcPath();
    });
    circuit.pathLen = circuit.calcMaxPathLength();
};

export const updateBackground = (currentCircuit) => {
    let bgElem = currentCircuit.circuit.querySelector(domStrings.circuitBackground);
    const check = !bgElem 
    if (check) {
        bgElem = document.createElement('div');
        bgElem.classList.add(domStrings.circuitBackground);
        currentCircuit.circuit.append(bgElem);
    }
    bgElem.style.backgroundColor = currentCircuit.bgColor;
}

export const create = (id, data, scale = {x: 100, y: 100}, backgroundColor = '#fff') => {

    // Setup
    let currentCircuit = new Ciruit(id, backgroundColor);

    currentCircuit.getCanvas();

    currentCircuit.scale = scale;

    updateBackground(currentCircuit);

    // Create static lines
    currentCircuit.staticLines = getData(data.staticData, currentCircuit);

    // Create dynamic lines
    currentCircuit.dynamicLines = getData(data.dynamicData, currentCircuit);

    // Get context of current canvas
    currentCircuit.context = currentCircuit.canvas.getContext('2d');

    resize(currentCircuit);
    window.addEventListener('resize', () => resize(currentCircuit));

    // Magic
    lineView.drawStatic(currentCircuit);
    lineView.drawDynamic(currentCircuit);
};