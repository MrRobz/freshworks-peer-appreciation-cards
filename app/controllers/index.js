import Controller from '@ember/controller';
import { qualities } from '../constants/culture-qualities';
import { action } from '@ember/object';
import resize from "ember-animated/motions/resize";
import move from "ember-animated/motions/move";
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @tracked
  showCardDetailsModal = false;

  *transition({ receivedSprites }) {
    yield
    receivedSprites.forEach(sprite => {
      resize(sprite);
      move(sprite);
    });
  }

  get cultureQualities() {
    return qualities;
  }

  @action
  onCardClick(quality) {
    this.transitionToRoute('card', quality.id);
  }

  @action
  onCardClickEnter(quality, event) {
    if (event.keyCode == 13) {
      this.transitionToRoute('card', quality.id);
    }
  }

  @action
  onCardInfoClick(quality, event) {
    event.stopPropagation();
    event.preventDefault();
    
    this.showCardDetailsModal = true;
  }

  @action
  closeQualityDetailsModal(event) {
    event.stopPropagation();
    
    this.showCardDetailsModal = false;
  }
}
