import * as fp from 'fingerpose';

const grabGesture = new fp.GestureDescription('grab');

for (const finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    grabGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 1.0); 
}

export default grabGesture;