import {domStrings} from '../models/base';

export default class circuit {

    constructor (id, bgColor) {
        this.circuit = document.getElementById(id);
        this.bgColor = bgColor;
    }
    
    getCanvasSize() {
        const width = this.circuit.clientWidth;
        const sectionHeight = this.circuit.clientHeight;
        // Expecting less content than there should be
        const height = Math.max(500, sectionHeight);
        
        this.width = width;
        this.height = height;
    }
    
    setCanvasSize() {
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
    }

    getCanvas() {
        this.canvas = this.circuit.querySelector(domStrings.circuitCanvas);
    }

    calcMaxPathLength() {
        let max = this.dynamicLines.reduce((acc, cur) => {
            return Math.max(acc, cur.path.length);
        }, 0);
        return max;
    };
}