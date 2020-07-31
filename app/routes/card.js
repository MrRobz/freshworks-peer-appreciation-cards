import Route from '@ember/routing/route';
import { qualities } from '../constants/culture-qualities';

export default class CardRoute extends Route {
  model(params){
    let qualityId = params["quality_id"];

    return qualities.find(q => q.id === qualityId);
  }
}
