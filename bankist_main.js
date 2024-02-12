'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

// Modal window............................................................................

const openModal = function (e) { // e is the any event, we can denote with any other word too
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//Scrolling.........................................................................................
/*btnScrollTo.addEventListener("click", function() {
    let s1coord = section1.getBoundingClientRect();
    console.log(s1coord);

    console.log("Current scroll (X/Y): ", window.pageXOffset, window.pageYOffset);
    console.log("Height/Width viewport: ", document.documentElement.clientHeight, document.documentElement.clientWidth);

    // window.scrollTo(s1coord.left + window.pageYOffset, s1coord.top + window.pageYOffset)

    // window.scrollTo({
    //     left: s1coord.left + window.pageYOffset,
    //     top : s1coord.top + window.pageYOffset,
    //     behaviour: 'smooth',
    // })

    section1.scrollIntoView({behavior: 'smooth'});// Works only in modern website
})*/

//Adding smopth scrolling to every link
/*document.querySelectorAll(".nav__link").forEach(
function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      const id = this.getAttribute('href');
      document.querySelector(id).scrollIntoView({behavior : 'smooth'});
    })
  }
)*/
//But in method we're writing it for each code which might works fine for this but it might create problem for 100s of link.. so here we use event delegation

//Event delegation:works on runtime like clicking an event eg button
//1. Add event to common parent 
//2. Determine which element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();

  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
})


//Tabbed..............................................................................................
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener('click', function(e){
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  if(!clicked) return; // If not clicked on button exit at that very moment

  //Remove active classes
  tabs.forEach(t => t.classList.remove("operations__tab--active"));
  tabContent.forEach(c => c.classList.remove("operations__content--active"));

  //Activating tab
  clicked.classList.add("operations__tab--active");
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
})


//Menu fade
const navLinks = document.querySelector(".nav__links");

const handHover = function(e){
  if(e.target.classList.contains("nav__link")){ // to check for contain or not always right classList
    const link = e.target;
    // console.log(e.currentTarget);
    const navOptions = link.closest('.nav').querySelectorAll(".nav__link");
    navOptions.forEach(el => {
      if(el !== link) el.style.opacity = this; // this here is pointing to the pointer passed
    });
  }
}
// // For this to work function should have one more parameter i.e. function(e, opacity)  and in place of this opacity should be written 
// navLinks.addEventListener('mouseover', function(e){
//   handHover(e, 0.5);
// });
// navLinks.addEventListener('mouseout', function(e){
//   handHover(e, 1);
// });

navLinks.addEventListener('mouseover', handHover.bind(0.5));
navLinks.addEventListener('mouseout', handHover.bind(1));


//Sticky menu........................................
const initialCod = section1.getBoundingClientRect();

window.addEventListener('scroll', function(){

  if(window.scrollY > initialCod.top){ //without .top this won't work
    nav.classList.add('sticky');
    // console.log("Hi..");
  } 
  else  nav.classList.remove('sticky');
})

//Sticky menu: Intersection observer API........................
// Not comfortable
/*const objOpts = {
  root: null, //Shows current portion of the page
  threshold: 0.1, //Percentage of the section at which the observer callback is called
} 
const observer = new IntersectionObserver(obsCallback, objOpts);
observer.observe(section1);*/


//Revealing sections on scroll................................................
const allSections = document.querySelectorAll(".section");

const revealSection = function(entries, observer){
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden'); 

  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, // after how much % of section, section will be revealed
});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})


//Lazy loading...........................................................................

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));


//Slider
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();



//Lectures............................................................................................
// Selecting, Creating, and Deleting Elements

// Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section'); //Returns as HTMLCollection;  these elements can't change with the dom modification
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');// Returns as NodeElement; these elements can change with the dom modification
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));//Returns as HTMLCollection;  these elements can' change with the dom modification

// // Creating and inserting elements
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookied for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));

// // header.before(message);
// // header.after(message);

// // Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove();
//     message.parentElement.removeChild(message);
//   });


// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color);
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// // document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// // Non-standard
// console.log(logo.designer); //undefined, because not starndard

// console.log(logo.getAttribute('designer'));// Can do this
// logo.setAttribute('company', 'Bankist'); // Can do this

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c'); // not includes

// // Don't use
// // logo.clasName = 'jonas';

//Event Listeners..............................................................................
/*const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);// This ensures that after 3sec that alert won't pop up again

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };
*/


//Event propogation........................................................................
/*const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);// e.target tells where we've clicked, e.currentTarget tells where event handler is attached
  console.log(e.currentTarget === this);

  // Stop propagation
  // e.stopPropagation(); // This won't let other propogations(below) to happen, not a good idea to cancel the propogations like this unless you really need to  
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
// 
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

//Capturing....
// Rarely use these days
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// },true); // this event will happen first: in above examples they are travelling up but with this nav will travel downwards while others will travel upwards
//14:36 
*/


// DOM Traversing......................................................................
//Accessing parent, child, chl=ildren and siblings
// const h1 = document.querySelector('h1');

// Going downwards: child
/*console.log(h1.querySelectorAll('.highlight'));

console.log(h1.childNodes); //Nodelist of all the children; [text, comment, text, span.highlight, text, br, text, span.highlight,text]
console.log(h1.children); //HTMLCollection of h1; [span.highlight, br, span.highlight]
// h1.firstElementChild.style.color = 'white'; // first child from htmlcollection
// h1.lastElementChild.style.color = 'orangered';// last element from htmlcollection

// // Going upwards: parents
console.log(h1.parentNode); //div.header_title
console.log(h1.parentElement);//div.header_title
console.log(h1.closest('.header')); // closest header

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)'; // Itself

// // Going sideways: siblings
console.log(h1.previousElementSibling); //undefined
console.log(h1.nextElementSibling);// <h4>................</h4>

console.log(h1.previousSibling); //#text
console.log(h1.nextSibling);//#text

//Reduce the size of all the siblings to 0.5
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });
*/