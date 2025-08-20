"use client";
import Image from "next/image";
import { AcceptedFileType } from "types/application";

export const getFeedback = () => {
  const gestures = {
    json: [
      {
        img: "/gestures/left-pinch.png",
        title: "PINCH",
      },
      {
        img: ["/gestures/left-pinch.png", "/gestures/right-pinch.png"],
        title: "DOUBLE PINCH",
      },
      {
        img: "/gestures/point.png",
        title: "POINT",
      },
    ],
    png: [
      {
        img: "/gestures/left-pinch.png",
        title: "PINCH",
      },
      {
        img: ["/gestures/left-pinch.png", "/gestures/right-pinch.png"],
        title: "DOUBLE PINCH",
      },
    ],
  };

  return gestures;
};

interface FeedbackDisplayProps {
  fileType: AcceptedFileType;
}

export const FeedbackDisplay = ({ fileType }: FeedbackDisplayProps) => {
  const allGestures = getFeedback();
  // Get the specific gesture list for the file type, with fallback to empty array
  const gestures = allGestures[fileType as keyof typeof allGestures] || [];

  console.log("Gestures for file type:", fileType, gestures);
  return (
    <div className="z-20 bg-white bg-opacity-90 rounded-lg shadow-lg p-2">
      {gestures.map((g, idx) => (
        <div key={idx}>
          <div className="flex justify-center items-center gap-2 mb-2">
            {(Array.isArray(g.img) ? g.img : [g.img]).map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`${g.title} ${i + 1}`}
                width={16}
                height={16}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
