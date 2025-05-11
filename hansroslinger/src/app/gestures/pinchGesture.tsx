import fp from 'fingerpose';
import { IFingerPose, IGestureDescription } from '../types';

const { Finger, FingerCurl, FingerDirection, GestureDescription } = fp as IFingerPose;

// Define pinching gesture 🤏
const pinchGesture = new GestureDescription('pinching') as IGestureDescription;

// Thumb specifications
pinchGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
pinchGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.5);
pinchGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.5);

// Index finger specifications
pinchGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);

// Remaining fingers should be curled
for (const finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    pinchGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    pinchGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

export default pinchGesture;