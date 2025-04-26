'use client';

import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { FILE_TYPE_PNG } from "constants/application";
import Image from "next/image";
import { Uploads } from "types/application";

type UploadsDisplayProps = {
  uploads: Uploads;
  selectedUploadId: string
  onSelect: (selectedUploadId: string) => void
};


const UploadsDisplay = (
  {
    uploads,
    selectedUploadId = '',
    onSelect
  }: UploadsDisplayProps
) => {

  return(
    <section className="w-full mb-8 mt-8">
      <h2 className="text-3xl font-bold text-center mb-5">Uploads</h2>
      <div className="overflow-x-auto w-full pb-3">
        <div className="flex justify-center gap-x-6 p-4 min-w-max">
          {Object.entries(uploads).map(([assetId, data]) => (
            <div
              key={assetId}
              className= {`min-w-[180px] h-52 bg-white shadow-md 
                rounded-md flex flex-col items-center justify-center 
                p-3 text-center cursor-pointer hover:-translate-y-1 hover:shadow-lg
                ${selectedUploadId == assetId ? 'border-4 border-green-500' : ''}
                `}
              role="button"
              onClick={() => onSelect(assetId)} 
            > 
              <div className="relative w-24 h-24 m-3 flex items-center justify-center">
                {data.type === FILE_TYPE_PNG ? 
                  <Image
                    src={data.thumbnailSrc ? data.thumbnailSrc : '/uploads/default-thumbnail.png'}
                    alt={data.name}
                    className="object-contain object-center"
                    fill={true}
                    sizes="max-width: 24px"
                  /> :
                  <VegaLiteChartDisplay data={data}/>
                }
              </div>
              <div className="font-semibold text-base">{data.name}</div>
              <div className="text-sm text-gray-500">{data.type}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

export default UploadsDisplay
