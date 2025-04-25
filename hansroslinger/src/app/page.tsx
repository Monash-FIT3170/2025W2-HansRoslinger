"use client";
import Preview from "@/components/Preview";
import Image from "next/image";

export default function Home() {
  const uploads = [
    { name: "pie_chart.json", type: "json", img: "/uploads/chart-icon.png" },
    { name: "ian.png", type: "png", img: "/uploads/ian.png" },
    { name: "graph.csv", type: "csv", img: "/uploads/chart-icon.png" },
    { name: "pie_chart.csv", type: "csv", img: "/uploads/chart-icon.png" },
  ];

  const gestures = [
    {
      img: "/gestures/left-pinch.png",
      title: "PINCH",
      description: "Use a pinch gesture to grab and move objects",
    },
    {
      img: ["/gestures/left-pinch.png", "/gestures/right-pinch.png"],
      title: "DOUBLE PINCH",
      description: "Use two hands with pinch gestures to zoom",
    },
    {
      img: "/gestures/fist.png",
      title: "FIST",
      description: "Make a fist and move to drag the canvas around",
    },
    {
      img: "/gestures/palm.png",
      title: "PALM",
      description: "Hold an open palm and hover to activate interaction mode",
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto scroll-auto scroll-smooth lg:overflow-hidden">
      <section className="w-full mb-8 mt-8">
        <h2 className="text-3xl font-bold text-center mb-5">Uploads</h2>
        <div className="overflow-x-auto w-full pb-3">
          <div className="flex justify-center w-fit min-w-full">
            <div className="flex gap-x-6 px-4 min-w-max">
              {uploads.map((file, idx) => (
                <div
                  key={idx}
                  className="min-w-[180px] h-52 bg-white shadow-md rounded-md flex flex-col items-center justify-center p-3 text-center"
                >
                  <div className="w-24 h-24 flex items-center justify-center">
                    <Image
                      src={file.img}
                      alt={file.name}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-2 font-semibold text-base">
                    {file.name}
                  </div>
                  <div className="text-sm text-gray-500">{file.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Preview Button */}
      <section className="flex items-center justify-center mb-8 mt-8">
        <Preview></Preview>
      </section>

      {/* Section 3: Gestures */}
      <section className="flex-1 flex items-center justify-center w-full pt-3 pb-3 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-md shadow-md w-full max-w-5xl min-h-52 items-center">
          {gestures.map((g, idx) => (
            <div
              key={idx}
              className="text-center bg-gray-100 rounded-md shadow-md p-4 flex flex-col items-center justify-center h-full"
            >
              <div className="flex justify-center items-center gap-2 mb-2">
                {Array.isArray(g.img) ? (
                  g.img.map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt={`${g.title} ${i + 1}`}
                      width={64}
                      height={64}
                    />
                  ))
                ) : (
                  <Image src={g.img} alt={g.title} width={64} height={64} />
                )}
              </div>
              <h3 className="font-bold">{g.title}</h3>
              <p className="text-sm text-gray-600">{g.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
