import {domStrings} from '../models/base';
import $ from 'jquery';

export const init = () => {
    $(domStrings.accordionBar).click(function() {
        if(!$(this).hasClass('active')){
            const container = $(this).parent().parent();
            container.find(domStrings.accordionBar).removeClass('active');
            container.find(domStrings.accordionContent).slideUp(200);
        }
        
        $(this).toggleClass('active');
        $(this).siblings(domStrings.accordionContent).slideToggle(200);
    });
}

export const addFirstActive = () => {
    $(domStrings.accordion).each(function(){
        const item = $(this).find(domStrings.accordionItem).first();
        item.find(domStrings.accordionBar).addClass('active');
        item.find(domStrings.accordionContent).slideDown();
    });
}