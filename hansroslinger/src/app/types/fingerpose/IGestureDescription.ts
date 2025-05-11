export interface IGestureDescription {
    // constructor(name: string){

    // }
    addCurl(finger: number, fingerCurl: number, confidence: number): void
    setWeight(finger: number, weight: number): void
    addDirection(finger: number, fingerDirection: number, confidence: number): void
}