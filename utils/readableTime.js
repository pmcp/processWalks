export const useReadableTime = (time) => {
    // To convert seconds to time
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
    function convertMsToTime(secs) {
        if(!secs) return '00:00:00.000'
        let milliseconds = (secs.toFixed(3).toString()).split('.', 2);
        let milli = milliseconds[1]
        let seconds = Math.floor(secs)
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        seconds = seconds % 60;
        minutes = minutes % 60;
        return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
            seconds)}.${milli}`;
    }
    return convertMsToTime(time);
}