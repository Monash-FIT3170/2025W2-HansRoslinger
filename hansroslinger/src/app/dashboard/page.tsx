import Image from "next/image";
import { Uploads } from "types/application";
import { hardcodedUploads } from "hardcodedData";
import Preview from "@/components/Preview";
import Upload from "@/components/Upload";
import { cookies } from "next/headers";
import UserUploads from "./UserUploads";
import CollectionsButton from "@/components/CollectionsButton";
import { Hand, MousePointer2, Move, Maximize2, Pointer, Zap } from "lucide-react";

// Custom Pinch Hand Gesture Icon
const PinchHandIcon = ({ className = "", strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => (
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

const Dashboard = async () => {
  // Right now this is hard coded, once we have data base setup, we can fetch instead
  const uploads: Uploads = hardcodedUploads;
  const cookieStore = await cookies();
  const email = decodeURIComponent(cookieStore.get("email")?.value ?? "");
  console.log("Email from cookies:", email);
  const gestures = [
    {
      ActionIcon: Zap,
      GestureIcon: Hand,
      title: "PALM",
      description: "Hold an open palm and hover to activate interaction mode",
      iconColor: "bg-[#5C9BB8]",
    },
    {
      ActionIcon: Move,
      GestureIcon: PinchHandIcon,
      title: "PINCH",
      description: "Use a pinch gesture to grab and move objects",
      iconColor: "bg-[#FC9770]",
    },
    {
      ActionIcon: Maximize2,
      GestureIcon: PinchHandIcon,
      isDouble: true,
      title: "DOUBLE PINCH",
      description: "Use two hands with pinch gestures to zoom in and out",
      iconColor: "bg-[#FBC841]",
    },
    {
      ActionIcon: MousePointer2,
      GestureIcon: Pointer,
      title: "POINT",
      description: "Point to interact with data objects",
      iconColor: "bg-[#E5A168]",
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto scroll-auto scroll-smooth lg:overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden min-h-[60vh] flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/8 to-[#E8F0F7]/20"></div>
        
        {/* Floating orbs with animation */}
        <div className="absolute top-20 left-[15%] w-72 h-72 bg-gradient-to-r from-[#FC9770]/25 to-[#FBC841]/25 blur-3xl animate-float"></div>
        <div className="absolute top-40 right-[20%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/25 to-[#FED6A6]/20 blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-[40%] w-64 h-64 bg-gradient-to-r from-[#E5A168]/20 to-[#5C9BB8]/15 blur-3xl animate-float-slow"></div>
        
        <div className="relative max-w-7xl mx-auto text-center w-full animate-fade-in">
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            <span className="gradient-text-enhanced">Gesture-Controlled</span>
            <br />
            <span className="bg-gradient-to-r from-[#5C9BB8] via-[#FC9770] to-[#FBC841] bg-clip-text text-transparent">Visualisation</span>
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#5C9BB8]/8 via-[#E8F0F7]/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#2a2a2a]">
              Master the <span className="gradient-text-enhanced">Gestures</span>
            </h2>
            <p className="text-lg md:text-xl text-[#4a4a4a] max-w-2xl mx-auto whitespace-nowrap">
              Learn how to interact with your visualisations using hand gestures
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            {gestures.map((g, idx) => (
              <div
                key={idx}
                className="w-[260px] bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all duration-500 animate-scale-in hover:-translate-y-2 overflow-hidden group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#5C9BB8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                {/* Content wrapper */}
                <div className="relative p-6 flex flex-col items-center text-center">
                  {/* Action Icon Badge (top-right) */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`p-2.5 rounded-xl ${g.iconColor} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <g.ActionIcon 
                        className="w-5 h-5 text-white drop-shadow-md"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Gesture Icon Container (center) */}
                  <div className="relative w-full aspect-square mb-5 flex items-center justify-center">
                    <div className={`absolute inset-0 ${g.iconColor} opacity-10 blur-2xl group-hover:opacity-20 group-hover:blur-3xl transition-all duration-500`}></div>
                    <div className="relative flex justify-center items-center gap-4 w-full h-full bg-[#F5F9FC] border border-[#5C9BB8]/15 shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      
                      {g.isDouble ? (
                        <>
                          <div className={`relative z-10 p-3 rounded-2xl ${g.iconColor} shadow-lg transition-all duration-300 group-hover:scale-105`}>
                            <g.GestureIcon 
                              className="w-12 h-12 text-white"
                              strokeWidth={1.5}
                            />
                          </div>
                          <div className={`relative z-10 p-3 rounded-2xl ${g.iconColor} shadow-lg transition-all duration-300 group-hover:scale-105`}>
                            <g.GestureIcon 
                              className="w-12 h-12 text-white"
                              strokeWidth={1.5}
                            />
                          </div>
                        </>
                      ) : (
                        <div className={`relative z-10 p-4 rounded-2xl ${g.iconColor} shadow-lg transition-all duration-300 group-hover:scale-110`}>
                          <g.GestureIcon 
                            className="w-16 h-16 text-white drop-shadow-lg"
                            strokeWidth={1.5}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-3 text-[#5C9BB8] uppercase tracking-wide">
                    {g.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4a4a4a]/80 group-hover:text-[#4a4a4a] transition-colors duration-300">
                    {g.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
