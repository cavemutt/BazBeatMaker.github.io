
const billyBtn = document.querySelector('#billy-btn')
const bubbleContainer = document.querySelector('#silly-billy-bubbles')
const billyBubble = document.querySelector('#billy-bubble')
const bubbleContent = document.querySelector('#bubble-content')
const bubbleIndicatorDot = document.querySelector('#bubble-indicator')
const closeBubbleBtn = document.querySelector('#close-bubble')
const nextBubbleBtn = document.querySelector('#continue-bubble')
const bubbleBtns = document.querySelectorAll('.bubble-btn')
let tourCounter = 0

const tourArray = ['#bubble-intro', '#volume', 'header', '#baz-container', '#confetti', '#kick-select', '#meow-select', '#tempo-slider', '#bubble-outro' ]

// EVENT LISTENERS

// DISABLE CONTEXT MENU AND COPYING to not interfere with little fun things
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
}, false)

//  start the tour on load and handle scroll history on reload 
window.addEventListener('load', () => {
    setTimeout(() => {
        startBillyBubbles()
    }, 1000)
    
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    } else {
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
    }
})

// billyBtn will toggle to start the tour or end it before it finishes
billyBtn.addEventListener('click', () => {
    billyBtn.classList.toggle('start')
    if(billyBtn.classList.contains('start')) {
        tourCounter = 0
        startBillyBubbles()
    } else {
        bubbleContainer.classList.add('close')
        closeIt()
    }
})

// the close button will end the tour
closeBubbleBtn.addEventListener('click', () => {
    closeBubbleBtn.style.background = "#555"
    bubbleContainer.classList.toggle('close')
    closeIt()
})

// the next button continues the tour to the next stop
nextBubbleBtn.addEventListener('click', () => {
    nextBubbleBtn.style.background = '#555'
    closeBillyBubbles()
    tourCounter += 1
    
    setTimeout(() => {
        if (tourCounter === tourArray.length - 1) {
            bubbleContainer.classList.add('close')
            closeIt()
        } else {
            bubbleTour(tourArray, tourCounter)
        }
    }, 1000)
})

// the bubbleBtns are the close tour and continue tour buttons, this is just to cover for the CSS hover effect that was overridden by the gsap animations
bubbleBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.opacity = '1'
        btn.style.scale = '1.1'
    })
    btn.addEventListener('mouseleave', () => {
        btn.style.opacity = '0.8'
        btn.style.scale = '1'
    })
})


// THE TOUR 

// start the tour at the beginning of the array
function startBillyBubbles() {
    bubbleTour(tourArray, 0)
}

// this separate function controls closing the container to go to the next stop, or closing at the end of the tour, which removes the next/continue button
function closeIt() {
    if(bubbleContainer.classList.contains('close')) {
        closeBillyBubbles()
        setTimeout(() => {
            lastStop()
        }, 500)
    } else {
        closeBillyBubbles()
        bubbleContainer.classList.remove('close')
    }
}

// take in the array and the index of the current element, pass through to the functions to position the bubble, the indicator, and to set styles and content of bubble animation 
function bubbleTour(arr, i) { 
    const element = document.querySelector(arr[i])
    openBillyBubbles(element)
}

// set the descriptive content of the bubble for each tour stop 
function showBubbleContent(el) {
    bubbleContent.innerText = el.dataset.bubble
}

// scroll to the current tour stop
function scrollToBubble(elem) {
    elem.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'})

    bubblePosition(elem)
    bubbleIndicator(elem)
}

// determine the position of the bubble for each tour stop
function bubblePosition(el) {
    const body = document.querySelector('body')
    const elOffsetTop = el.offsetTop 
    const elBoundingTop = el.getBoundingClientRect().top 
    const elOffsetHeight = el.offsetHeight
    const elBoundingHeight = el.getBoundingClientRect().height
    const bubbleOffsetHeight = bubbleContainer.offsetHeight
    let isAtBottom = elOffsetTop + elOffsetHeight >= window.offsetHeight - elOffsetHeight

    // Y positioning
    if (
        elOffsetTop + elOffsetHeight + bubbleOffsetHeight >= window.innerHeight 
        ) {
            bubbleContainer.style.top = (elBoundingTop + (elBoundingHeight * 0.3)) + 'px'
        } 
    if ( isAtBottom ) {
        bubbleContainer.style.top = (elOffsetTop - (bubbleOffsetHeight + 50)) + 'px' 
    } else {
            bubbleContainer.style.top = (elBoundingTop + elBoundingHeight + 10) + 'px'
        }

    // X positioning
    el.offsetLeft <= body.offsetLeft ? bubbleContainer.style.left = '20px' : el.offsetLeft + bubbleContainer.offsetWidth + 20 >= body.offsetWidth ? bubbleContainer.style.left = (body.offsetWidth - (bubbleContainer.offsetWidth + 20)) + 'px' : bubbleContainer.style.left = (el.offsetLeft + 20) + 'px'

}

// set the position of the indicator, which highlights the current stop of the tour
function bubbleIndicator(el) {
    const body = document.querySelector('body')
    const bodyLeft = body.offsetLeft
    const elTop = el.getBoundingClientRect().top
    const elOffsetTop = el.offsetTop
    const elLeft = el.offsetLeft
    const elHeight = el.offsetHeight
    let isAtBottom = elTop + elHeight >= window.innerHeight
    let isAtTop = elTop <= body.offsetTop
    
    // Y position
    if (isAtBottom) {
        bubbleIndicatorDot.style.top = (elTop - 50) + 'px'
    } else if (isAtTop) {
        bubbleIndicatorDot.style.top = (body.offsetTop + 50) + 'px'
    } else {
        bubbleIndicatorDot.style.top = (elTop + (elOffsetTop * .5)) + 'px' 
    }
    // X position
    elLeft - 50 <= bodyLeft ? bubbleIndicatorDot.style.left = (elLeft + 40) + 'px' : bubbleIndicatorDot.style.left = (elLeft - 60) + 'px'
    
    randomRotation(bubbleIndicatorDot) 
}

// a little fun rotation for Silly Billy and the indicator
//  note: the gsap timeline may have overridden this setting for Silly Billy, so the let random variable holds the rotation value and it is then used in the gsap animation for the Billy image
function randomRotation(elem) {
    let random = Math.floor(Math.random() * 21) - 10
    return elem.style.rotate = `${random}deg`
}

// set up the last stop on the tour to show the outro and end the tour
function lastStop() {
    tourCounter = tourArray.length - 1
    bubbleTour(tourArray, tourArray.length - 1)
    billyBtn.classList.remove('start')
}

// ANIMATIONS 

// animation the opening and set content of Billy Bubbles using GSAP
function openBillyBubbles(element) {
    const tl = new gsap.timeline({defaults: {duration: 0.75, ease: 'elastic.out(0.8, 0.5)' }})
    
    // if we're at the end of the tour, we don't want a continue button
    if(tourCounter === tourArray.length - 1) {
        tl.set(nextBubbleBtn, {visibility: 'hidden'})
    } else {
        tl.set(nextBubbleBtn, {visibility: 'visible'})
    }

    tl
    .set(nextBubbleBtn, { background: 'var(--bubble-btn-color)'})
    .set(closeBubbleBtn, {background: 'var(--bubble-btn-color)'})
    .set(window, {onStart: scrollToBubble(element)})
    .to(billyBubble, { onStart: randomRotation(billyBubble), scale: 1}, '-=.3')
    .to(bubbleContent, {duration: 1, scale: 1, width:"clamp(10em, 24vw, 18em)", onComplete: showBubbleContent(element)}, '-=0.5')
    .fromTo(bubbleIndicatorDot, {opacity: 0, scale: 0}, {opacity: 1, scale: 1}, '-=.5')
    .to(closeBubbleBtn, {opacity: 0.8, scale: 1}, '-=.2')
    .to(nextBubbleBtn, {opacity: 0.8, scale: 1}, '-=.6')
}

function topAtEnd() {
    if(tourCounter === tourArray.length - 1) {
        window.scrollTo(0, 0)
    }
}

// close the bubbles after each stop on the tour
function closeBillyBubbles() {
    const tl = new gsap.timeline({defaults: {duration: .3, ease: 'power2.out' }})
    tl
    .to(nextBubbleBtn, {opacity: 0, scale: 0})
    .to(bubbleContent, { scale: 0}, '<.05')
    .to(bubbleIndicatorDot, {opacity: 0}, '<.05')
    .to(closeBubbleBtn, {opacity: 0, scale: 0}, '<.05')
    .to(billyBubble, {scale: 0, onComplete: topAtEnd}, '<.05')
}
