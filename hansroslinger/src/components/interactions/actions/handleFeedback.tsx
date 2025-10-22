"use client";
import { AcceptedFileType } from "types/application";
import { Pointer, MoveHorizontal } from "lucide-react";

// Custom Pinch Hand Gesture Icon
const PinchHandIcon = ({
  className = "",
  strokeWidth = 1.5,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Thumb */}
    <path d="M14 10.5c0-1-.5-2-1.5-2s-1.5 1-1.5 2" />
    {/* Index finger */}
    <path d="M11 10.5V6c0-1.1-.9-2-2-2s-2 .9-2 2v8" />
    {/* Palm and other fingers */}
    <path d="M7 14v-1c0-.6-.4-1-1-1-.6 0-1 .4-1 1v3c0 2.8 2.2 5 5 5h2c2.8 0 5-2.2 5-5v-4c0-.6-.4-1-1-1-.6 0-1 .4-1 1v1" />
    {/* Pinching motion indicators */}
    <circle cx="12" cy="9" r="0.5" fill="currentColor" />
    <circle cx="10" cy="9" r="0.5" fill="currentColor" />
  </svg>
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
