"use client";
import { AcceptedFileType } from "types/application";
import { Pointer, MoveHorizontal } from "lucide-react";
import Image from "next/image";

// Custom Pinch Hand Gesture Icon
const PinchHandIcon = ({
  className = "",
  strokeWidth = 2.5,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <Image
    src="/gestures/pinch.png"
    alt="Pinch gesture"
    width={24}
    height={24}
    className={`${className} brightness-0 invert`}
  />
);

export const getFeedback = () => {
  const gestures: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Array<{ Icon: any; title: string; iconColor?: string }>
  > = {
    json: [
      {
        Icon: PinchHandIcon,
        title: "PINCH",
        iconColor: "bg-[#FC9770]",
      },
      {
        Icon: PinchHandIcon,
        title: "DOUBLE PINCH",
        iconColor: "bg-[#FBC841]",
      },
      {
        Icon: Pointer,
        title: "POINT",
        iconColor: "bg-[#E5A168]",
      },
    ],
    png: [
      {
        Icon: PinchHandIcon,
        title: "PINCH",
        iconColor: "bg-[#FC9770]",
      },
      {
        Icon: PinchHandIcon,
        title: "DOUBLE PINCH",
        iconColor: "bg-[#FBC841]",
      },
    ],
  };

  return gestures;
};

interface FeedbackDisplayProps {
  fileType: AcceptedFileType;
  isDragging?: boolean;
}

export const FeedbackDisplay = ({
  fileType,
  isDragging = false,
}: FeedbackDisplayProps) => {
  const allGestures = getFeedback();
  // Get the specific gesture list for the file type, with fallback to empty array
  const gestures = allGestures[fileType as keyof typeof allGestures] || [];

  console.log("Gestures for file type:", fileType, gestures);
  return (
    <div className="z-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2">
      {isDragging ? (
        <div className="flex justify-center items-center gap-2 p-1">
          <div className="p-2 rounded-lg bg-[#5C9BB8] shadow-md">
            <MoveHorizontal className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          {gestures.map((g, idx) => (
            <div key={idx} className="flex justify-center items-center">
              <div
                className={`p-1.5 rounded-lg ${g.iconColor || "bg-gray-400"} shadow-md`}
              >
                <g.Icon className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
