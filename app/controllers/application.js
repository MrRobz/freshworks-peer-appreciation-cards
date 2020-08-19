import Controller from '@ember/controller';
import { fadeIn } from 'ember-animated/motions/opacity';
import { fadeOut } from 'ember-animated/motions/opacity';
import { tracked } from '@glimmer/tracking';
import { wait } from 'ember-animated';

export default class ApplicationController extends Controller {
  constructor() {
    super(...arguments);

    this.startBaloonAnimation();
    this.modalTransition = this.modalTransition.bind(this);
  }

  @tracked
  showModalContent = false;

  getRandomInt = (max) => {
    let min = 0;
    let random = Math.ceil(Math.random() * 10);

    if (random % 2 === 0) {
      let sectionSize = max/4;
      max = sectionSize;
    } else {
      let sectionSize = max/4;
      min = max - sectionSize;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;  
  }

 startBaloonAnimation() {
  let root = document.documentElement;

  setTimeout(() => {
   root.style.setProperty('--baloon-x', this.getRandomInt(window.screen.width) + "px");
   root.style.setProperty('--baloon-y', Math.floor(Math.random() * window.screen.height) + "px");
  }, 500);

  setInterval(() => {
    root.style.setProperty('--baloon-x', this.getRandomInt(window.screen.width) + "px");
    root.style.setProperty('--baloon-y', Math.floor(Math.random() * window.screen.height) + "px");
  }, 10000);
 }

 *modalTransition({ insertedSprites, removedSprites }) {
   yield;
    for (let sprite of insertedSprites) {
      fadeIn(sprite);
      yield wait(500);
      this.showModalContent = true;
    }

    for (let sprite of removedSprites) {
      yield wait(100);
      this.showModalContent = false;
      fadeOut(sprite)
    }
  }
}
