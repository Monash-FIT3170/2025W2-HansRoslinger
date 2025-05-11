import { Finger } from './Finger';
import { FingerCurl } from './FingerCurl';
import { FingerDirection } from './FingerDirection';
import { IGestureDescription } from './IGestureDescription';
export interface IFingerPose{
    Finger: Finger,
    FingerCurl:FingerCurl,
    FingerDirection:FingerDirection,
    GestureDescription:any
}