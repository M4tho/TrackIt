'use strict';


function TrackIt(options){
    let _self;
    let starttime;

    let state = 'IDLE';
    let stops = [];

    let timeLineLength = 60;

    let clockInterval; 
    let ctx;
    let canvas;

    

    function start(){
        canvas = $('#canvas')[0];
        ctx = canvas.getContext('2d');
        ctx.canvas.width  = window.innerWidth;

        log("start");
        starttime = new Date().getTime();
        clockInterval = setInterval(updateClock,1000);
        state = 'LIVE';
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

    function addStop(cat){
        log("add stop " + cat);
        let start = stops.length > 0 ? stops[stops.length -1].end : 0;
        let end = (new Date().getTime()) - starttime;
        end = (end / 1000);
        stops.push(new Stop(start,end,cat));
        console.table(stops);
    }

    function animate(){
        if(state == 'LIVE')
            requestAnimationFrame(animate);
        drawTimeLine();
        drawSegments();
    }
    function drawTimeLine(){
        if(ctx === null ||ctx === undefined)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "darkgrey";
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }

    function drawSegments(){
        let ratio = canvas.width / timeLineLength;
        let now =((new Date().getTime()) - starttime) / 1000;
        
        for(let i = stops.length - 1; i >= 0; i--){
            let offset = (now - stops[i].end) * ratio;
            ctx.fillStyle = ['red','blue','yellow'][stops[i].category];
            ctx.fillRect(canvas.width - (stops[i].duration * ratio) - offset,0,stops[i].duration * ratio,canvas.height);
        }
    }

    function updateClock(){
        let dif = (new Date().getTime()) - starttime;
        dif = Math.floor(dif/1000);
        let h = Math.floor(dif / 60 / 60);
        let m = Math.floor(dif / 60) % 60 + "";
        let s = dif % 60 + "";
        let txt = [h,m.padStart(2,"0"),s.padStart(2,"0")].join(":");
        $('#clock').text(txt);
    }

    function log(msg){
        let txt = new Date() + ":" + msg + "\n";
        console.log(txt);
        $('#log').text($('#log').text() + txt);
    }

    this.start = start;
    this.end = end;
    this.pause = pause;
    this.addStop = addStop;


    function Stop(starttime, endtime, cat){
        let _self;
        this.category = cat;
        this.start = starttime;
        this.end = endtime;
        this.duration = this.end - this.start;
    }
}