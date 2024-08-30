'use strict';

//NOTE: WARNING: TODO: WAS HERE: CHECK TEST DATA: INFO: REVIEW: FIXME: BUG:
// WAS HERE: stop at (201. Building a Slider Component: Part 1)

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');

const operation = document.querySelector('.operations__tab-container');
const btnOperation = document.querySelectorAll('.btn.operations__tab');

const header = document.querySelector('.header');
const nav = document.querySelector('.nav');

const dotContainer = document.querySelector('.dots');

// NOTE: No Need until now
// const h4 = document.querySelector('h4');
// const h1 = document.querySelector('h1');

///////////////////////////////////////////
const openModal = function (e) {
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

///////////////////////////////////////////

// scroll to section 1
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// nav scrolling
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////
// for operation
///////////////////////////////////////////

operation.addEventListener('click', e => {
  const button = e.target.closest('.operations__tab');

  if (button?.tagName !== 'BUTTON') return;

  btnOperation.forEach(el => el.classList.remove('operations__tab--active'));
  button.classList.add('operations__tab--active');

  document
    .querySelectorAll('.operations__content')
    .forEach(el => el.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${button.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////
// for nav bar
///////////////////////////////////////////

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    const array = Array.from(siblings);
    array.push(logo);

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////
// for nav sticky
///////////////////////////////////////////

// NOTE: my solution
// const initialCoord = section1.offsetTop;

// window.addEventListener('scroll', function () {
//   if (window.scrollY >= initialCoord) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

///////////////////////////////////////////

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////////
// for Reveal Sections
///////////////////////////////////////////

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserve = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserve.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////
// for lazy img
///////////////////////////////////////////

const imgTargets = document.querySelectorAll('.features__img');

const loadImg = function (entries, observe) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observe.unobserve(entry.target);
};

const imgFObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '300px',
});

imgTargets.forEach(img => imgFObserver.observe(img));

///////////////////////////////////////////
// for slider
///////////////////////////////////////////

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let currentSlide = 0;
const maxSlide = slides.length;

// call back function for btn
const goToSlide = function (slide) {
  slides.forEach((e, i) => {
    e.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

goToSlide(0);

// Right Button
const rightBtn = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  activeDot(currentSlide);
  goToSlide(currentSlide);
};

// Left Button
const leftBtn = function () {
  if (currentSlide > 0) {
    currentSlide--;
  } else {
    currentSlide = maxSlide - 1;
  }

  activeDot(currentSlide);
  goToSlide(currentSlide);
};

btnRight.addEventListener('click', rightBtn);
btnLeft.addEventListener('click', leftBtn);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') rightBtn();
  if (e.key === 'ArrowLeft') leftBtn();
});

///////////////////////////////////////////
// for Dots slider
///////////////////////////////////////////

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `
      <button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

dotContainer.addEventListener('click', function (e) {
  const { slide } = e.target.dataset;
  if (e.target.classList.contains('dots__dot')) {
    goToSlide(slide);
    activeDot(slide);
  }
});

function activeDot(dot) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`[data-slide="${dot}"]`)
    .classList.add('dots__dot--active');
}

activeDot(0);
