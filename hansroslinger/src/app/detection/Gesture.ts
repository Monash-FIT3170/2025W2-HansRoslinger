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

class Pinch extends Gesture {
    constructor(){
        super("Pinch");
    }

    payload(hand: number, landmarks: GestureRecognizerResult, canvas: HTMLCanvasElement) {
        
        const indexFingerTip = landmarks.landmarks[hand][8]; // Index finger tip
        const thumbTip = landmarks.landmarks[hand][4]; // Thumb tip

        // Calculate pixel positions on the canvas
        const indexFingerX = canvas.width * indexFingerTip.x;
        const indexFingerY = canvas.height * indexFingerTip.y;
        const thumbX = canvas.width * thumbTip.x;
        const thumbY = canvas.height * thumbTip.y;

        // Average to find pinch point
        const pinchX = (indexFingerX + thumbX) / 2;
        const pinchY = (indexFingerY + thumbY) / 2;

        return {
            gesture: this.name,
            pinchPoint: { x: pinchX, y: pinchY },
            landmarks: landmarks
        };
    }

}

