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

        $(document).on('click','nav .nav-item',async function(e){
            await setView($(this).data('view'));
            $('nav').removeClass('in');
        });
    }

    async function setView(name){
        $('.view').hide();
        $('#v' + name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() + ".view").show().removeClass('hidden');
    }

    // this.setView = setView;
}