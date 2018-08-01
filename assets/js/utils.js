
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

function formatTime(time,millis){
    let h = Math.floor(time / 60 / 60);
    let m = Math.floor(time / 60) % 60 + "";
    let s = (millis ? (time % 60).toFixed(2) : Math.floor((time % 60))) + "";
    return [h,m.padStart(2,"0"),s.padStart(millis ? 5 : 2,"0")].join(":");
}