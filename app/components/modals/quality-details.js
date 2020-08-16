import Component from '@glimmer/component';
import move from 'ember-animated/motions/move';
import { easeInAndOut } from 'ember-animated/easings/cosine';

export default class ModalsQualityDetailsComponent extends Component {
  *modalContentTransition({ insertedSprites, removedSprites }) {
    yield;
    for (let sprite of insertedSprites) {
       sprite.startAtPixel({ y: window.innerHeight });
       move(sprite, { easing: easeInAndOut });
     }
 
     for (let sprite of removedSprites) {
       sprite.endAtPixel({ y: window.innerHeight });
       move(sprite, { easing: easeInAndOut });
     }
   }
}
