import {Renderer, ViewChild, HostBinding} from '@angular/core';
import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public static readonly STATE_NEXT_INFOS = "infos";
  public static readonly STATE_NEXT_DIRECTION = "direction";

  state = AppComponent.STATE_NEXT_DIRECTION;

  @ViewChild('focusInput') focusInput:ElementRef;

  // Form
  height:number = 0;
  heightDiff:number = 0;
  
  @ViewChild('heightDiffInput') heightDiffInput:ElementRef;
  @ViewChild('heightInput') heightInput:ElementRef;

  // Draw
  path = [];
  currentBlockId = 0;
  currentBlockX = 0;
  currentBlockY = 5;
  blockSize = 10;

  constructor(private renderer: Renderer) {

  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.state === AppComponent.STATE_NEXT_DIRECTION) {
      let knownKey = false;
      if (event.keyCode === KEY_CODE.LEFT_ARROW) {
        this.currentBlockX--;
        knownKey = true;
      } else if(event.keyCode === KEY_CODE.TOP_ARROW) {
        this.currentBlockY--;
        knownKey = true;
      } else if(event.keyCode === KEY_CODE.RIGHT_ARROW) {
        this.currentBlockX++;
        knownKey = true;
      } else if(event.keyCode === KEY_CODE.BOTTOM_ARROW) {
        this.currentBlockY--;
        knownKey = true;
      }
  
      if (knownKey) {
        this.state = AppComponent.STATE_NEXT_INFOS;
        this.setFocus(this.heightInput);
      }
    }
  }

  setFocus(input:ElementRef) {
    setTimeout(() => {
      this.renderer.invokeElementMethod(input.nativeElement, 'focus');
    }, 500);
  }

  validHeight() {
    this.setFocus(this.heightDiffInput);
  }

  validHeightDiff() {
    let lastBlock = null;
    if (this.path.length > 0) {
      lastBlock = this.path[this.path.length - 1];
    }
    this.path.push({
      x: this.currentBlockX,
      y: this.currentBlockY,
      height: this.height,
      heightDiff: this.heightDiff,
      previous: lastBlock,
    });
    this.state = AppComponent.STATE_NEXT_DIRECTION;
    this.setFocus(this.focusInput);
  }
}

export enum KEY_CODE {
  LEFT_ARROW = 37,
  TOP_ARROW = 38,
  RIGHT_ARROW = 39,
  BOTTOM_ARROW = 40
}

export interface Block {
  x: number;
  y: number;
  height:number;
  heightDiff: number;
  previous?: Block;
}