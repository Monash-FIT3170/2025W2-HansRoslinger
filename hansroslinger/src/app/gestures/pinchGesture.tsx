import fp from 'fingerpose';
const pinchGesture = new fp.GestureDescription('pinch');

// Thumb specifications
pinchGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
pinchGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.5);
pinchGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 0.5);

// Index finger specifications
pinchGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);

// Remaining fingers should be curled
for (const finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    pinchGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    pinchGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
}

export default pinchGesture;