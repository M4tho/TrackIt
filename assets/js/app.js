'use strict';


function TrackIt(options){
    let _self;
    let starttime;

    let state = 'IDLE';
    let stops = [];

    const timeLineLength = 60;
    const timestampInterval = 15;

    let clockInterval; 
    let ctx;
    let canvas;

    let ratio;

    function start(){
        canvas = $('#canvas')[0];
        ctx = canvas.getContext('2d');
        ctx.canvas.width  = $('main')[0].clientWidth;

        log("start");
        starttime = new Date().getTime();
        clockInterval = setInterval(updateClock,100);
        state = 'LIVE';

        ratio = canvas.width / timeLineLength;
        animate();
    }

    function end(){
        log("end");
        clearInterval(clockInterval);
        stops = [];
        state = 'IDLE';
    }
    function pause(){
        log("pause");
        clearInterval(clockInterval);
        state = 'PAUSE';
    }

    function setCategories(number){
        let s = '<style>';
        for(let i = 0; i < number; i++){
            
            $('#categories').append('<button class="btn cat btn-control" data-cat="'+ i +'">cat ' + (i+1) + '</button>');

            s += '#categories .btn[data-cat="'+i+'"]{background-color: ' + categories[i][0]+'}' + "\n";
            s += '#categories .btn[data-cat="'+i+'"]:hover, #categories .btn[data-cat="'+i+'"]:active {background-color: ' + categories[i][1]+'}' + "\n";
        }

        s += '</style>';
        $('head').append(s);
    }

    function addStop(cat){
        log("add stop " + cat);
        let start = stops.length > 0 ? stops[stops.length -1].end : 0;
        let end = (new Date().getTime()) - starttime;
        end = (end / 1000);
        stops.push(new Stop(start,end,cat));
        console.table(stops);
    }

    function animate(){
        if(state == 'LIVE'){
            requestAnimationFrame(animate);
        }
        
        if(ctx === null ||ctx === undefined){
            return;
        }

        ctx.fillStyle = "darkgrey";
        ctx.fillRect(0,0,canvas.width, canvas.height);

        drawSegments();
        drawTimeLine();
    }
    function drawTimeLine(){
        //draw timestamps
        let now = ((new Date().getTime()) - starttime) / 1000;
        let t = 0;
        // console.log(now);

        ctx.font = "15px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        for(let t = 0; t < now; t += timestampInterval){
            let x = canvas.width - (now - t) * ratio;

            ctx.fillText(formatTime(t),x, canvas.height/2);
            ctx.beginPath();
            ctx.moveTo(x,0);
            ctx.lineTo(x,canvas.height);
            ctx.strokeStyle = '#222222';
            ctx.stroke();
        }
    }

    function drawSegments(){
        let now = ((new Date().getTime()) - starttime) / 1000;
        
        for(let i = stops.length - 1; i >= 0; i--){
            let offset = (now - stops[i].end) * ratio;
            ctx.fillStyle = categories[stops[i].category][0];
            ctx.fillRect(canvas.width - (stops[i].duration * ratio) - offset,0,stops[i].duration * ratio,canvas.height);
        }
    }

    function updateClock(){
        let dif = (new Date().getTime()) - starttime;
        dif = (dif/1000);
        $('#clock_total').text(formatTime(dif,true));

        let e = stops.length > 0 ? stops[stops.length -1].end : 0;
        dif -= e;
        $('#clock_segment').text(formatTime(dif,true));
    }

    function log(msg){
        let txt = new Date() + ":" + msg + "\n";
        console.log(txt);
        $('#log').text($('#log').text() + txt);
    }

    const categories = [
        ['#6200EA','#651FFF'],
        ['#E65100','#EF6C00'],
        ['#1B5E20','#2E7D32'],
        ['#C51162','#F50057']
    ];

    this.start = start;
    this.end = end;
    this.pause = pause;
    this.addStop = addStop;
    this.setCategories = setCategories;

    function Stop(starttime, endtime, cat){
        let _self;
        this.category = cat;
        this.start = starttime;
        this.end = endtime;
        this.duration = this.end - this.start;
    }
}