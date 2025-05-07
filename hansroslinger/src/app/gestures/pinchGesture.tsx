import * as fp from 'fingerpose';

const pinchGesture = new fp.GestureDescription('pinch');

pinchGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
pinchGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);

for (const finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    pinchGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    pinchGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
}
export default pinchGesture;