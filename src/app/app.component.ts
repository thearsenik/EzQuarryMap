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
  depth:number = 10;
  
  @ViewChild('depthInput') depthInput:ElementRef;
  @ViewChild('heightInput') heightInput:ElementRef;

  // Draw
  path:Array<Block> = [];
  currentBlockId = 0;
  currentBlockX = 0;
  currentBlockY = 5;
  blockSize = 10;
  stringifiedMap = "";
  lastBlock:Block = null;

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
      this.lastBlock = lastBlock;
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
        this.showStateInputs();
      }
    }
  }

  setFocus(input:ElementRef) {
    setTimeout(() => {
      this.renderer.invokeElementMethod(input.nativeElement, 'focus');
    }, 500);
  }

  validHeight() {
    this.setFocus(this.depthInput);
  }

  validDepth() {
    this.path.push({
      id: this.currentBlockId,
      x: this.currentBlockX,
      y: this.currentBlockY,
      height: this.height,
      depth: this.depth
    });
    this.lastBlock = this.path[this.path.length - 1];
    this.save();
    this.state = AppComponent.STATE_NEXT_DIRECTION;
    this.setFocus(this.focusInput);
  }

  save() {
    this.stringifiedMap = JSON.stringify(this.path);
    window.localStorage.setItem("map", this.stringifiedMap);
  }

  resetData() {
    this.path = [];
    this.currentBlockId = 0;
    this.currentBlockX = 0;
    this.currentBlockY = 5;
    this.blockSize = 10;
    this.lastBlock = null;
  }

  copyData() {
    this.copyTextArea.nativeElement.select();
    document.execCommand( 'copy' );
  }

  arrow(direction:String) {
    if (direction === 'left') {
      this.currentBlockX--;
    } else if(direction === 'top') {
      this.currentBlockY--;
    } else if(direction === 'right') {
      this.currentBlockX++;
    } else if(direction === 'bottom') {
      this.currentBlockY++;
    }
    
    this.showStateInputs();
  }

  showStateInputs() {
    this.currentBlockId++;
    this.state = AppComponent.STATE_NEXT_INFOS;
    this.setFocus(this.heightInput);
  }

  deleteBlock() {
    let blockIndex = this.path.findIndex(elt => elt === this.lastBlock);
    if (blockIndex >= 0) {
      this.path.splice(blockIndex, 1);
    }
    if (this.path.length > 0) {
      this.setLastBlock(this.path[this.path.length -1]);
    } else {
      this.lastBlock = null;
    }
  }

  setLastBlock(block: Block) {
    this.lastBlock = block;
    this.currentBlockX = this.lastBlock.x;
    this.currentBlockY = this.lastBlock.y;
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
  depth: number;
}