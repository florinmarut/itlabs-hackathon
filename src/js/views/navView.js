import {domStrings} from '../models/base';

const btn = document.querySelector(domStrings.navBtn);

export const toggleMenu = () => {
    btn.classList.toggle('active');
};