'use strict';

function App(options){
    let _self = this;

    setBasicListeners();

    function setBasicListeners(){
        $(document).on('click', ".btn-nav", function (e) {
            $('nav').addClass('in');
        });
        $(document).on('click', "body", function (e) {
            if (!$(e.target).is('.btn-nav') && !$(e.target).is('nav') && !$(e.target).is('nav *')) {
                $('nav').removeClass('in');
            }
        });
    }
}