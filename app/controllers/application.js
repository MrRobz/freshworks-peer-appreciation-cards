import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
 constructor() {
   super(...arguments);

   let root = document.documentElement;

   function getRandomInt(max) {
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

   setTimeout(() => {
    root.style.setProperty('--baloon-x', getRandomInt(window.screen.width) + "px");
    root.style.setProperty('--baloon-y', Math.floor(Math.random() * window.screen.height) + "px");
   }, 500);

  setInterval(function(){
    root.style.setProperty('--baloon-x', getRandomInt(window.screen.width) + "px");
    root.style.setProperty('--baloon-y', Math.floor(Math.random() * window.screen.height) + "px");
  }, 10000);
 }
}
