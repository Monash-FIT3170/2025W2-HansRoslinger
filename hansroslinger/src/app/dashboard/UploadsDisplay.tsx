'use client';

import { Uploads } from "app/types/application";
import Image from "next/image";

type UploadsDisplayProps = {
  uploads: Uploads[];
};


const UploadsDisplay = (
  {uploads}: UploadsDisplayProps
) => {

  return(
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
                      src={file.imageSrc}
                      alt={file.name}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-2 font-semibold text-base">{file.name}</div>
                  <div className="text-sm text-gray-500">{file.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
  )
}

export default UploadsDisplay