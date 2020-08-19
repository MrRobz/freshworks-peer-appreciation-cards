/* eslint-disable require-yield */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inlineSvgFor } from 'ember-svg-jar/utils/make-svg';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import resize from "ember-animated/motions/resize";
import move from "ember-animated/motions/move";
import { fadeIn } from 'ember-animated/motions/opacity';
import fade from 'ember-animated/transitions/fade';

const CARD_DESC_CHAR_LIMIT = 360;

export default class CardController extends Controller {
  @service notifications;

  constructor(){
    super(...arguments);

    this.transition = this.transition.bind(this);
  }

  cardInfotransition = fade

  @tracked
  cardDesc = "I am giving you this because...";

  @tracked
  cardFrom = "";

  @tracked
  cardTo = "";

  @tracked
  showQualityInfo = false;

  @tracked
  shoshowShareOptions = true;
  
  transition = function*({ receivedSprites }) {
    this.shoshowShareOptions = false;

    receivedSprites.forEach(sprite => {  
      resize(sprite);
      move(sprite);
    });

    later(this, () => this.shoshowShareOptions = true, 500)
  }

  fade = function*({ insertedSprites }) {
    insertedSprites.forEach(sprite => {
      fadeIn(sprite);
    });
  }

  roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  get clipboardNotSupported() {
    let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return !window.ClipboardItem || isSafari;
  }

  textAreaAutoSize = (event) => {
    let element = event.target;
    let offset = element.offsetHeight - element.clientHeight;

    if ((event.target.scrollHeight + offset) < this.textAreaMaxScrollHeight) {
      event.target.style.height = 'auto';
      event.target.style.height = event.target.scrollHeight + offset + 'px';
    }
  }

  wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  loadImage(url) {
    return new Promise(resolve => {
      const image = new Image();
      image.addEventListener('load', () => {
        resolve(image);
      });
      image.src = url;
    });
  }

  async generateCanvasFromDiv()  {
    let canvas = document.createElement('canvas');
    canvas.id = 'someId';
    canvas.style.width = "1100px";
    canvas.style.height = "600px";
    document.querySelector(".dummy-wrapper").innerHTML = "";
    document.querySelector(".dummy-wrapper").appendChild(canvas);

    let ctx = canvas.getContext("2d");

    let dpr = 2;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#ffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "16px Patrick Hand";
    ctx.fillStyle = "#CACCCF";
    let host = window.location.host;
    ctx.fillText(`Built with ${host}`, 52, 570);

    ctx.strokeStyle = "#E8E8E8";
    ctx.fillStyle = "#ffff";
    this.roundRect(ctx, 50, 50, 1000, 500, 8, true);
    ctx.clip();

    let lineCharacterImage = await this.loadImage(this.model.lineImageLoc);
    ctx.drawImage(lineCharacterImage, 70, 155, 264, 264);

    let FreshworksDew = await this.loadImage("/images/freshworks-dew.png");
    ctx.drawImage(FreshworksDew, 980, 480, 45, 45);
    
    let parser = new DOMParser();
    // eslint-disable-next-line no-undef
    let oldTopLeftIcon = inlineSvgFor('card-top-left', (assetId) => require(`ember-svg-jar/inlined/${assetId}`).default, { class: "card-icon-top-left card-icon--top-left"});
    let newTopLeftIcon = oldTopLeftIcon.replace(/fill="currentcolor"/g, `fill="${this.model.color}"`);
    newTopLeftIcon = newTopLeftIcon.replace(/stroke="currentcolor"/g, `stroke="${this.model.color}"`);
    let svg1 = parser.parseFromString(newTopLeftIcon, "image/svg+xml");
    let xml = new XMLSerializer().serializeToString(svg1);
    let svg64 = btoa(xml);
    let b64Start = 'data:image/svg+xml;base64,';
    let image64 = b64Start + svg64;
    
    let iamge1 = await this.loadImage(image64);
    ctx.drawImage(iamge1, 50, 50, 120, 120);


    // eslint-disable-next-line no-undef
    let oldTopBottomIcon = inlineSvgFor('card-bottom-left', (assetId) => require(`ember-svg-jar/inlined/${assetId}`).default, { class: "card-icon-bottom-left card-icon card-icon--bottom-left"});
    let newTopBottomIcon = oldTopBottomIcon.replace(/fill="currentcolor"/g, `fill="${this.model.color}"`);
    newTopBottomIcon = newTopBottomIcon.replace(/stroke="currentcolor"/g, `stroke="${this.model.color}"`);
    let svg2 = parser.parseFromString(newTopBottomIcon, "image/svg+xml");
    xml = new XMLSerializer().serializeToString(svg2);
    svg64 = btoa(xml);
    b64Start = 'data:image/svg+xml;base64,';
    image64 = b64Start + svg64;
    let image2 = await this.loadImage(image64);
    ctx.drawImage(image2, 50, 425, 180, 125);

    ctx.font = "700 30px Source Sans Pro";
    ctx.fillStyle = "#474747";
    ctx.fillText(this.model.name, 450, 100);

    ctx.font = "25px Patrick Hand";
    ctx.fillStyle = "#52575C";
    ctx.fillText("To", 400, 150);
    this.wrapText(ctx, this.cardDesc, 400, 210, 600, 40);
    ctx.fillText("From", 400, 520);

    ctx.font = "28px Patrick Hand";
    ctx.fillStyle = "#000";
    ctx.textBaseline = "bottom";
    ctx.fillText(this.cardTo, 440, 155);
    ctx.fillText(this.cardFrom, 460, 530);
    
    ctx.fillStyle = "#DBDDE0";
    let text = ctx.measureText(this.cardTo);
    ctx.fillRect(433, 155, text.width + 20, 2);
    text = ctx.measureText(this.cardFrom);
    ctx.fillRect(453, 530, text.width + 20, 2);

    return { canvas, ctx };
  }

  selectText(element) {
    var doc = document;
    if (doc.body.createTextRange) {
        let range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

  @action
  setAutosizeListener(rootElement) {
    this.textAreaMaxScrollHeight = rootElement.clientHeight;

    let element = rootElement.querySelector('textarea');
    element.addEventListener('input', this.textAreaAutoSize);
  }
  @action
  removeAutosizeListener(rootElement) {
    let element = rootElement.querySelector('textarea');
    element.removeEventListener('input', this.textAreaAutoSize);
  }

  @action
  async downloadCard() {
    let { canvas } = await this.generateCanvasFromDiv();

    // uncomment this for debugging
    // document.body.appendChild(canvas);

    let link = document.createElement('a');
    link.download = 'appreciation-card.png';
    link.href = canvas.toDataURL();
    link.click();

    later(this, () => {
      this.notifications.success("Your card has been successfully downloaded. Feel free to share the card in slack, workplace...", {
        autoClear: true,
        clearDuration: 10000
      });
    }, 1000);
  }

  @action
  async copyToClipboard() {
    let { canvas } = await this.generateCanvasFromDiv();

    if (window.ClipboardItem) {
      canvas.toBlob(blob => {
        navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);

        this.notifications.clearAll();
        this.notifications.info("Your card has been copied to clipboard. Feel free to paste now in slack, workplace...", {
          autoClear: true,
          clearDuration: 10000
        });
      });
    }


  }

  @action
  goBack(event) {
    if (event.keyCode == 13) {
      this.transitionToRoute("index");
    } else if (event.type === "click") {
      this.transitionToRoute("index");
    }
  }

  @action
  cardDescKeyPress(text) {
    if (text.length > CARD_DESC_CHAR_LIMIT) {
      this.notifications.clearAll();
      this.notifications.warning(`Card message must be no longer than ${CARD_DESC_CHAR_LIMIT} characters.`, {
        autoClear: true,
      });
    }
    this.cardDesc = text.substring(0, CARD_DESC_CHAR_LIMIT);
  }

  @action
  focusInput(element) {
    element.focus();
  }

  @action
  onCardInfoClick() {
    this.showQualityInfo = true;
  }
  @action
  onCardInfoCloseClick() {
    this.showQualityInfo = false;
  }
}
