import {Renderer, ViewChild, HostBinding, OnInit} from '@angular/core';
import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public static readonly STATE_NEXT_INFOS = "infos";
  public static readonly STATE_NEXT_DIRECTION = "direction";

  state = AppComponent.STATE_NEXT_DIRECTION;

  @ViewChild('focusInput') focusInput:ElementRef;
  @ViewChild('copyTA') copyTextArea:ElementRef;

  // Form
  height:number = 0;
  heightDiff:number = 0;
  
  @ViewChild('heightDiffInput') heightDiffInput:ElementRef;
  @ViewChild('heightInput') heightInput:ElementRef;

  // Draw
  path:Array<Block> = [];
  currentBlockId = 0;
  currentBlockX = 0;
  currentBlockY = 5;
  blockSize = 10;
  stringifiedMap = "";

  constructor(private renderer: Renderer) {

  }

  ngOnInit(): void {
    let savedMap = window.localStorage.getItem("map");
    if (savedMap) {
      this.path = JSON.parse(savedMap);
      let lastBlock = this.path[this.path.length - 1];
      this.currentBlockX = lastBlock.x;
      this.currentBlockY = lastBlock.y;
      this.currentBlockId = lastBlock.id;
    }
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
        this.currentBlockY++;
        knownKey = true;
      }
  
      if (knownKey) {
        this.currentBlockId++;
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
      id: this.currentBlockId,
      x: this.currentBlockX,
      y: this.currentBlockY,
      height: this.height,
      heightDiff: this.heightDiff
    });
    this.save();
    this.heightDiff = 0; // reset height diff for a faster input
    this.state = AppComponent.STATE_NEXT_DIRECTION;
    this.setFocus(this.focusInput);
  }

  save() {
    this.stringifiedMap = JSON.stringify(this.path);
    window.localStorage.setItem("map", this.stringifiedMap);
  }

  resetData() {
    this.path = [];
  }

  copyData() {
    this.copyTextArea.nativeElement.select();
    document.execCommand( 'copy' );
  }
}

export enum KEY_CODE {
  LEFT_ARROW = 37,
  TOP_ARROW = 38,
  RIGHT_ARROW = 39,
  BOTTOM_ARROW = 40
}

export interface Block {
  id: number;
  x: number;
  y: number;
  height:number;
  heightDiff: number;
}