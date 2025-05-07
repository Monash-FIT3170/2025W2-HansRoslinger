import * as fp from 'fingerpose';

const pointGesture = new fp.GestureDescription('point');

pointGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);

for(const finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky,fp.Finger.Thumb]) {
    pointGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    pointGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
}

export default pointGesture;