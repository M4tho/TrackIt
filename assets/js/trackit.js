'use strict';


function TrackIt(options){
    let _self = this;
    let starttime;
    let lastpause;

    let state = 'IDLE';
    let stops = [];

    const timeLineLength = 60;
    const timestampInterval = 15;

    let clockInterval;

    let canvasCurrent;
    let ctxCurrent;
    let canvasTotal;
    let ctxTotal;

    let ratio;

    function start(){
        if(["IDLE","PAUSE"].indexOf(state) < 0){
            return;
        }
        canvasCurrent = $('canvas#current')[0];
        ctxCurrent = canvasCurrent.getContext('2d');
        ctxCurrent.canvas.width  = $('main')[0].clientWidth;

        canvasTotal = $('canvas#total')[0];
        ctxTotal = canvasTotal.getContext('2d');
        ctxTotal.canvas.width  = $('main')[0].clientWidth;

        log("start");
        if(state != 'PAUSE'){
            starttime = new Date().getTime();
        }else{
            starttime += (new Date().getTime() - lastpause) ;
        }
        clockInterval = setInterval(updateClock,100);
        state = 'LIVE';

        ratio = canvasCurrent.width / timeLineLength;
        animate();
    }

    function end(){
        if(state == "IDLE"){
            return;
        }

        log("end");
        clearInterval(clockInterval);
        state = 'IDLE';
    }
    function pause(){
        if(state == "PAUSE"){
            return this.start();
        }else if (state != "LIVE"){
            return;
        }
        log("pause");
        clearInterval(clockInterval);
        state = 'PAUSE';
        lastpause = new Date().getTime();
    }
    function reset(){
        this.end();
        stops = [];
        starttime = null;
        lastpause = null;

        $('#clock_total .time').text(formatTime(0,true));
        $('#clock_segment .time').text(formatTime(0,true));

        if(ctxCurrent !== null && ctxCurrent !== undefined && ctxTotal !== null && ctxTotal !== undefined){
            drawClean();
        }
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
        if(["LIVE","PAUSE"].indexOf(state) < 0){
            return;
        }

        log("add stop " + cat);
        let start = stops.length > 0 ? stops[stops.length -1].end : 0;
        let end = (new Date().getTime()) - (state == "PAUSE" ? lastpause : starttime);
        end = (end / 1000);
        stops.push(new Stop(start,end,cat));
        console.table(stops);
    }

    function animate(){
        if(state == 'LIVE'){
            requestAnimationFrame(animate);
        }
        
        if(ctxCurrent === null || ctxCurrent === undefined || ctxTotal === null || ctxTotal === undefined){
            return;
        }

        drawClean();
        drawSegments();
        drawTimeLine();

        drawTotal();
    }

    function drawClean(){
        ctxCurrent.fillStyle = "darkgrey";
        ctxCurrent.fillRect(0,0,canvasCurrent.width, canvasCurrent.height);

        ctxTotal.fillStyle = "darkgrey";
        ctxTotal.fillRect(0,0,canvasTotal.width, canvasTotal.height);
    }

    function drawTimeLine(){
        //draw timestamps
        let now = ((new Date().getTime()) - starttime) / 1000;
        let t = 0;
        // console.log(now);

        ctxCurrent.font = "15px Arial";
        ctxCurrent.fillStyle = "black";
        ctxCurrent.textAlign = "center";
        for(let t = 0; t < now; t += timestampInterval){
            let x = canvasCurrent.width - (now - t) * ratio;

            ctxCurrent.fillText(formatTime(t),x, canvasCurrent.height/2);
            ctxCurrent.beginPath();
            ctxCurrent.moveTo(x,0);
            ctxCurrent.lineTo(x,canvasCurrent.height);
            ctxCurrent.strokeStyle = '#222222';
            ctxCurrent.stroke();
        }
    }

    function drawSegments(){
        let now = ((new Date().getTime()) - starttime) / 1000;
        
        for(let i = stops.length - 1; i >= 0; i--){
            let offset = (now - stops[i].end) * ratio;
            ctxCurrent.fillStyle = categories[stops[i].category][0];
            ctxCurrent.fillRect(canvasCurrent.width - (stops[i].duration * ratio) - offset,0,stops[i].duration * ratio,canvasCurrent.height);
        }
    }

    function drawTotal(){
        let totalTime = (new Date().getTime()) - starttime;
        totalTime = (totalTime/1000);
        let r = canvasTotal.width / totalTime;

        for(let i = 0; i < stops.length; i++){
            ctxTotal.fillStyle = categories[stops[i].category][0];
            ctxTotal.fillRect(stops[i].start * r,0,stops[i].duration * r,canvasTotal.height);

            if(i == stops.length -1){
                console.log(stops[i], stops[i].start * r,stops[i].end * r);
            }
        }

    }

    function updateClock(){
        let dif = (new Date().getTime()) - starttime;
        dif = (dif/1000);
        $('#clock_total .time').text(formatTime(dif,true));

        let e = stops.length > 0 ? stops[stops.length -1].end : 0;
        dif -= e;
        $('#clock_segment .time').text(formatTime(dif,true));
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
    this.reset = reset;
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