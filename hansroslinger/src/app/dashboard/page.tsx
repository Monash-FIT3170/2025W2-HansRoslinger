import Image from "next/image";
import { Uploads } from "types/application";
import { hardcodedUploads } from "hardcodedData";
import Preview from "@/components/Preview";
import Upload from "@/components/Upload";
import { cookies } from "next/headers";
import UserUploads from "./UserUploads";
import CollectionsButton from "@/components/CollectionsButton";

const Dashboard = async () => {
  // Right now this is hard coded, once we have data base setup, we can fetch instead
  const uploads: Uploads = hardcodedUploads;
  const cookieStore = await cookies();
  const email = decodeURIComponent(cookieStore.get("email")?.value ?? "");
  console.log("Email from cookies:", email);
  const gestures = [
    {
      img: "/gestures/left-pinch.png",
      title: "PINCH",
      description: "Use a pinch gesture to grab and move objects",
    },
    {
      img: ["/gestures/left-pinch.png", "/gestures/right-pinch.png"],
      title: "DOUBLE PINCH",
      description: "Use two hands with pinch gestures to zoom in and out",
    },
    {
      img: "/gestures/point.png",
      title: "POINT",
      description: "Point to interact with data objects",
    },
    {
      img: "/gestures/palm.png",
      title: "PALM",
      description: "Hold an open palm and hover to activate interaction mode",
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto scroll-auto scroll-smooth lg:overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden min-h-[60vh] flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F0] via-[#FFEFD5] to-[#FED6A6]/40"></div>
        
        {/* Floating orbs with animation */}
        <div className="absolute top-20 left-[15%] w-72 h-72 bg-gradient-to-r from-[#FC9770]/20 to-[#FBC841]/20 blur-3xl animate-float"></div>
        <div className="absolute top-40 right-[20%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/15 to-[#FED6A6]/15 blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-[40%] w-64 h-64 bg-gradient-to-r from-[#E5A168]/20 to-[#FC9770]/15 blur-3xl animate-float-slow"></div>
        
        <div className="relative max-w-7xl mx-auto text-center w-full animate-fade-in">
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            <span className="gradient-text-enhanced">Gesture-Controlled</span>
            <br />
            <span className="text-[#2a2a2a]">Visualisation</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#4a4a4a] mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Interact with your data like never before. Upload, organise, and visualise with intuitive hand gestures.
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-5 flex-wrap">
            <Upload />
            <Preview />
            <CollectionsButton />
          </div>
          
          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <svg className="w-10 h-10 mx-auto text-[#FC9770] drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Uploads Section */}
      <UserUploads initialUploads={uploads} />

      {/* Gestures Guide Section */}
      <section className="py-20 px-6 mb-8 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FED6A6]/15 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#2a2a2a]">
              Master the <span className="gradient-text-enhanced">Gestures</span>
            </h2>
            <p className="text-lg md:text-xl text-[#4a4a4a] max-w-2xl mx-auto whitespace-nowrap">
              Learn how to interact with your visualisations using hand gestures
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {gestures.map((g, idx) => (
              <div
                key={idx}
                className="modern-card-enhanced p-8 flex flex-col items-center text-center group animate-scale-in hover-lift"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Icon container with gradient background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5C9BB8]/15 to-[#FC9770]/15 blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative flex justify-center items-center gap-3 p-6 bg-gradient-to-br from-white to-[#FED6A6]/20 border border-[#E5A168]/20 shadow-sm transform transition-transform group-hover:scale-110">
                    {Array.isArray(g.img) ? (
                      g.img.map((src, i) => (
                        <Image
                          key={i}
                          src={src}
                          alt={`${g.title} ${i + 1}`}
                          width={72}
                          height={72}
                        />
                      ))
                    ) : (
                      <Image src={g.img} alt={g.title} width={72} height={72} />
                    )}
                  </div>
                </div>
                
                <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-[#5C9BB8] via-[#FC9770] to-[#FBC841] bg-clip-text text-transparent">
                  {g.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#4a4a4a]">
                  {g.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
