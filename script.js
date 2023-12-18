// DISABLE CONTEXT MENU AND COPYING to not interfere with little fun things
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
}, false)

const volume = document.querySelector('#volume-control')

// main 
class DrumKit {
    constructor() {
        this.sequencer = document.querySelector('.sequencer');
        this.pads = document.querySelectorAll(".pad");
        this.playBtn = document.querySelector(".play");
        this.currentKick = './sounds/kick-classic.wav';
        this.currentSnare = './sounds/snare-acoustic01.wav';
        this.currentHihat = './sounds/hihat-acoustic01.wav';
        this.currentMeow = './sounds/short-meow.mp3';
        this.kickAudio = document.querySelector(".kick-sound");
        this.snareAudio = document.querySelector(".snare-sound");
        this.hihatAudio = document.querySelector(".hihat-sound");
        this.meowAudio = document.querySelector(".meow-sound");
        this.selects = document.querySelectorAll('select');
        this.muteBtns = document.querySelectorAll('.mute');
        this.tempoSlider = document.querySelector('.tempo-slider');
        this.tempoText = document.querySelector('.tempo-number');
        this.clearBtn = document.querySelector('.clear');
        this.catHeadCool = document.querySelector('#cat-head-cool');
        this.catHeadWatching = document.querySelector('#cat-head-watching');
        this.glitter = document.querySelector('.glitter');
        this.index = 0;
        this.bpm = 150;
        this.isPlaying = null;
        this.kickAudio.volume = 0
        this.snareAudio.volume = 0
        this.hihatAudio.volume = 0
        this.meowAudio.volume = 0
    }
    repeat() {
        let step = this.index % 8;
        const activeBars = document.querySelectorAll(`.b${step}`);
        const kickReact = document.querySelector('.kick-react')
        const snareReact = document.querySelector('.snare-react')
        const hihatReact = document.querySelector('.hihat-react')
        const meowReact = document.querySelector('.meow-react')

        activeBars.forEach(bar => {
            bar.style.animation = `playTrack 0.1s alternate ease-in 2`;
            
            if(bar.classList.contains('active')) {
                bar.classList.add('pulse')
                if(bar.classList.contains('kick-pad')) {
                    this.kickAudio.currentTime = 0;
                    this.kickAudio.play();
                    this.soundReaction(kickReact);

                }
                if(bar.classList.contains('snare-pad')) {
                    this.snareAudio.currentTime = 0;
                    this.snareAudio.play();
                    this.soundReaction(snareReact);
                }
                if(bar.classList.contains('hihat-pad')) {
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play();
                    this.soundReaction(hihatReact);
                }
                if(bar.classList.contains('meow-pad')) {
                    this.meowAudio.currentTime = 0;
                    this.meowAudio.play();
                    this.soundReaction(meowReact);
                    this.catAnimOn();
                }
            }
        })
        this.index++;
    }
    start() {
        const interval = (60/this.bpm) * 1000;

        if(!this.isPlaying) {
            this.isPlaying  = setInterval(() => {
                this.repeat();
            }, interval);
            this.soundReaction()
        } else {
            this.catAnimOff()
            clearInterval(this.isPlaying);
            this.isPlaying = null;
        }       
    }
    updateBtn() {
        if(!this.isPlaying) {
            this.playBtn.innerText = "Pause";
            this.playBtn.classList.add('active')
        } else {
            this.playBtn.innerText = "Play";
            this.playBtn.classList.remove('active')
            this.catAnimOff();
            this.glitterOff();
        }
    }

    changeSound(e) {
        const selectionName = e.target.name;
        const selectionValue = e.target.value;
        switch(selectionName) {
            case "kick-select":
                this.kickAudio.src = selectionValue;
                break;
            case "snare-select":
                this.snareAudio.src = selectionValue;
                break;
            case "hihat-select":
                this.hihatAudio.src = selectionValue;
                break;
            case "meow-select":
                this.meowAudio.src = selectionValue;
                break;
        }
    }
    activePad() {
        this.classList.toggle("active");
    }

    volume(e) {
        const vol = e.target.value
        this.kickAudio.volume = vol
        this.snareAudio.volume = vol
        this.hihatAudio.volume = vol
        this.meowAudio.volume = vol
    }

    mute(e) {
        const muteIndex = e.target.getAttribute("data-track");
        e.target.classList.toggle("active");
        if(e.target.classList.contains('active')) {
            switch(muteIndex) {
                case "0": 
                    this.kickAudio.volume = 0;
                    break;
                case "1": 
                    this.snareAudio.volume = 0;
                    break;
                case "2": 
                    this.hihatAudio.volume = 0;
                    break;
                case "3": 
                    this.meowAudio.volume = 0;
                    break;
            }
        } else {
            switch(muteIndex) {
                case "0": 
                    this.kickAudio.volume = 1;
                    break;
                case "1": 
                    this.snareAudio.volume = 1;
                    break;
                case "2": 
                    this.hihatAudio.volume = 1;
                    break;
                case "3": 
                    this.meowAudio.volume = 1;
                    break;
            }
        }
    }
    changeTempo(e) {
        this.tempoText.innerText = e.target.value;
    }
    updateTempo(e) {
        this.bpm = e.target.value;
        clearInterval(this.isPlaying);
        this.isPlaying = null;
        const playBtn = document.querySelector('.play');
        if(playBtn.classList.contains("active")) {
            this.start();
        }
    }
    soundReaction(elem) {
        const intervalReact = (120/this.bpm) * 120;
        elem.style.animation = `sound ${intervalReact}ms steps(8)`;
        elem.addEventListener('animationend', () => {
            elem.style.animation = "";
        })
    }
    catAnimOn() {
        const boa = document.querySelector('#boa');
        const interval = (60/this.bpm) * 1000;

        setTimeout(() => {
            this.catHeadCool.classList.remove('opacity-down');
            this.catHeadWatching.classList.add('opacity-down');
            this.catHeadCool.style.animation = `bop-head ${interval*4}ms ease alternate infinite`;
        }, 500)
        setTimeout(() => {
            boa.classList.add('enterBoa');
            if(boa.classList.contains('enterBoa') && this.catHeadWatching.classList.contains('opacity-down')) {
                this.glitterOn()
            } else {
                this.glitterOff()
            }            
        }, 10000)
    }
    catAnimOff() {
        this.catHeadCool.classList.add('opacity-down');
        this.catHeadWatching.classList.remove('opacity-down');
        this.catHeadCool.style.animation = '';
        this.glitterOff();
        setTimeout(() => {
            if(!this.isPlaying) {
                this.catAnimOff()
            }
        }, 1000)
    }
    makeEyesMove() {
        const body = document.querySelector('body')
        const eyes = document.querySelectorAll('.eye')

        body.addEventListener('mousemove', (e) => {
        eyes.forEach(eye => {
            let x = (eye.getBoundingClientRect().left) + (eye.clientWidth / 2);
            let y = (eye.getBoundingClientRect().top) + (eye.clientHeight / 2);
            let radian = Math.atan2(e.pageX - x, e.pageY - y);
            let rotation = (radian * (180 / Math.PI) * -1) + 20;
            eye.style.transform = `rotate(${rotation}deg)`;
            })
        })
    }
    glitterOn() {
        this.glitter.style.opacity = '1'
        this.glitter.classList.add('glitter-time');
    }
    glitterOff() {
        this.glitter.style.opacity = '0';
        setTimeout(() => {
            this.glitter.classList.remove('glitter-time');
        }, 1000);
    }
    
    clear() {
        // stop the loop
        clearInterval(this.isPlaying);
        this.isPlaying = null;
        // reset play button
        this.playBtn.innerText = "Play";
        this.playBtn.classList.remove('active');
        // reset tempo
        this.bpm = 150;
        this.tempoSlider.value = this.bpm
        this.tempoText.innerText = "150"
        // reset pads
        this.pads.forEach(pad => {
            pad.classList.remove("active");
            pad.classList.remove("pulse");
        })
        // reset sound options
        this.selects.forEach(select => {
           select.value = select.options[0].value;
        })
        // animations off
        this.catAnimOff();
        this.glitterOff();

    }
}

const drumKit = new DrumKit();


// Event Listeners
window.addEventListener('load', () => {
    drumKit.clear()
})

volume.addEventListener('input', e => {
    drumKit.volume(e)
})

drumKit.sequencer.addEventListener('mouseover', () => {
    drumKit.makeEyesMove()
})

drumKit.pads.forEach(pad => {
    pad.addEventListener('click', drumKit.activePad)
    pad.addEventListener('animationend', function() {
        this.style.animation = ""
    })
})

drumKit.playBtn.addEventListener('click', () => {
    drumKit.updateBtn();
    drumKit.start();
}) 

drumKit.selects.forEach(select => {
    select.addEventListener('change', (e) => {
        drumKit.changeSound(e);
    })
})
    
drumKit.muteBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        drumKit.mute(e);
    })
})

drumKit.tempoSlider.addEventListener('input', function(e) {
    drumKit.changeTempo(e)
})
drumKit.tempoSlider.addEventListener('change', function(e) {
    drumKit.updateTempo(e)
})

drumKit.clearBtn.addEventListener('click', () => {
        drumKit.clear()
    })
    
console.log('other ', volume.getBoundingClientRect())
