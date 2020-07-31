import Controller from '@ember/controller';
import { qualities } from '../constants/culture-qualities';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  get cultureQualities() {
    return qualities;
  }

  @action
  onCardClick(quality) {
    this.transitionToRoute('card', quality.id);
  }
}
