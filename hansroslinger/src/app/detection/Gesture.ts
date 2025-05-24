import {GestureRecognizerResult } from "@mediapipe/tasks-vision";

abstract class Gesture {
    name: string;

    constructor(name: string){
        this.name = name;
    }

    detect?(landmarks: GestureRecognizerResult): boolean;

    abstract payload(hand: number, landmarks: GestureRecognizerResult, canvas?: HTMLCanvasElement): unknown;
}

class OpenPalmGesture extends Gesture {
    constructor(){
        super("Open_Palm");
    }

    payload(hand: number, landmarks: GestureRecognizerResult, canvas: HTMLCanvasElement){
        const wrist = landmarks.landmarks[hand][0];
        const middleBase = landmarks.landmarks[hand][9]
        const palmCenterY = canvas.height * ((wrist.y + middleBase.y) / 2) ;
        const palmCenterX = canvas.width * wrist.x;

        return {
            gesture: this.name,
            palmCenter: {x: palmCenterX, y: palmCenterY},
            landmarks: landmarks
        }
    }
}

class PointUp extends Gesture {
    constructor(){
        super("Pointing_Up");
    }

    payload(hand: number, landmarks: GestureRecognizerResult, canvas: HTMLCanvasElement){
        const indexFingerTip = landmarks.landmarks[hand][8];
        const indexFingerY =  canvas.height * indexFingerTip.y ;
        const indexFingerX =  canvas.width * indexFingerTip.x ;
        
        return {
            gesture: this.name,
            indexFingerTip: {x: indexFingerX, y: indexFingerY},
            landmarks: landmarks
        }
    }
}

