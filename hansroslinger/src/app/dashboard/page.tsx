'use client';
import Image from 'next/image';
import Link from 'next/link';
import UploadsDisplay from './UploadsDisplay';
import { Uploads } from 'app/types/application';

const Dashboard = () => {

  const uploads: Uploads[] = [
    { name: 'pie_chart.json', type: 'json', src:'/uploads/chart-icon.png',  imageSrc: '/uploads/chart-icon.png' },
    { name: 'ian.png', type: 'png', src: '/uploads/ian.png',  imageSrc: '/uploads/ian.png' },
    { name: 'graph.csv', type: 'json', src:'/uploads/chart-icon.png',  imageSrc: '/uploads/chart-icon.png' },
    { name: 'pie_chart.csv', type: 'png', src:'/uploads/chart-icon.png',  imageSrc: '/uploads/chart-icon.png' },
    
  ];

  const gestures = [
    {
      img: '/gestures/left-pinch.png',
      title: 'PINCH',
      description: 'Use a pinch gesture to grab and move objects',
    },
    {
      img: ['/gestures/left-pinch.png', '/gestures/right-pinch.png'],
      title: 'DOUBLE PINCH',
      description: 'Use two hands with pinch gestures to zoom',
    },
    {
      img: '/gestures/fist.png',
      title: 'FIST',
      description: 'Make a fist and move to drag the canvas around',
    },
    {
      img: '/gestures/palm.png',
      title: 'PALM',
      description: 'Hold an open palm and hover to activate interaction mode',
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto scroll-auto scroll-smooth lg:overflow-hidden">
      <UploadsDisplay uploads={uploads}>

      </UploadsDisplay>
      {/* Section 2: Preview Button */}
      <section className="flex items-center justify-center mb-8 mt-8">
        <Link href="/preview">
          <button className="bg-teal-500 text-white text-lg px-6 py-3 rounded-md font-semibold shadow-md">
            Preview
          </button>
        </Link>
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

export default Dashboard
