import Image from "next/image";
import { Uploads } from "types/application";
import { hardcodedUploads } from "hardcodedData";
import Preview from "@/components/Preview";
import Upload from "@/components/Upload";
import { cookies } from "next/headers";
import UserUploads from "./UserUploads";
import CollectionsButton from "@/components/CollectionsButton";
import ScrollIndicator from "@/components/ScrollIndicator";
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
      {/* Scroll Position Indicator */}
      <ScrollIndicator />
      
      {/* Hero Section */}
      <section id="hero" className="relative py-24 px-6 overflow-hidden min-h-[65vh] flex items-center">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/10 to-[#E8F0F7]/25"></div>
        
        {/* Enhanced floating orbs with animation */}
        <div className="absolute top-20 left-[15%] w-80 h-80 bg-gradient-to-r from-[#FC9770]/30 to-[#FBC841]/30 blur-3xl animate-float"></div>
        <div className="absolute top-40 right-[20%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/30 to-[#FED6A6]/25 blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-[40%] w-72 h-72 bg-gradient-to-r from-[#E5A168]/25 to-[#5C9BB8]/20 blur-3xl animate-float-slow"></div>
        
        <div className="relative max-w-7xl mx-auto text-center w-full">
          
          {/* Enhanced title with animation */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
              <div className="relative inline-block mb-3 animate-fade-in">
                <span className="gradient-text-enhanced drop-shadow-lg">Gesture-Controlled</span>
                {/* Subtle underline accent */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#5C9BB8]/40 to-transparent"></div>
              </div>
              <br />
              <div className="relative inline-block mt-2 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <span className="gradient-text-enhanced drop-shadow-lg">Visualisation</span>
                {/* Glow effect for second line */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#5C9BB8]/20 via-[#FC9770]/20 to-[#FBC841]/20 blur-3xl -z-10"></div>
              </div>
            </h1>
          </div>
          
          {/* Enhanced description */}
          <div className="animate-slide-up" style={{ animationDelay: '800ms' }}>
            <p className="text-xl md:text-2xl text-[#4a4a4a]/90 mb-12 max-w-4xl mx-auto leading-relaxed font-bold">
              Interact with your data like never before. Upload, organise, and visualise with{' '}
              <span className="text-[#5C9BB8] font-semibold">intuitive hand gestures</span>.
            </p>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex items-center justify-center gap-6 flex-wrap mb-8 animate-scale-in" style={{ animationDelay: '1200ms' }}>
            <Upload />
            <Preview />
            <CollectionsButton />
          </div>
          
          {/* Enhanced scroll indicator */}
          <div className="mt-20 animate-bounce" style={{ animationDelay: '1600ms' }}>
            <div className="relative inline-block group cursor-pointer">
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FC9770]/40 via-[#FBC841]/40 to-[#FC9770]/40 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <svg className="w-12 h-12 mx-auto text-[#FC9770] drop-shadow-xl relative transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Uploads Section */}
      <div id="uploads">
        <UserUploads initialUploads={uploads} />
      </div>

      {/* Gestures Guide Section */}
      <section id="gestures" className="py-24 px-6 mb-8 relative overflow-hidden">
        {/* Enhanced Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5C9BB8]/10 via-[#E8F0F7]/15 to-[#FBC841]/5"></div>
        
        {/* Floating background orbs */}
        <div className="absolute top-20 right-[12%] w-96 h-96 bg-gradient-to-r from-[#FC9770]/12 to-[#FBC841]/12 blur-3xl animate-float opacity-40"></div>
        <div className="absolute bottom-32 left-[8%] w-80 h-80 bg-gradient-to-r from-[#5C9BB8]/12 to-[#E5A168]/10 blur-3xl animate-float-delayed opacity-40"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-4xl md:text-6xl font-bold mb-5 text-[#2a2a2a]">
              Master the <span className="gradient-text-enhanced">Gestures</span>
            </h2>
            <p className="text-lg md:text-xl text-[#4a4a4a]/90 max-w-3xl mx-auto leading-relaxed">
              Learn how to interact with your visualisations using hand gestures
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10">
            {gestures.map((g, idx) => (
              <div
                key={idx}
                className="relative w-[280px] bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl hover:bg-white/95 transition-all duration-500 hover:-translate-y-3 overflow-visible group"
                style={{ 
                  animationDelay: `${idx * 100}ms`,
                  animation: 'scaleIn 0.5s ease-out backwards'
                }}
              >
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#5C9BB8]/8 via-[#FC9770]/5 to-[#FBC841]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                {/* Animated border glow */}
                <div className={`absolute -inset-0.5 ${g.iconColor} opacity-0 blur-sm group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}></div>
                
                {/* Content wrapper */}
                <div className="relative p-7 flex flex-col items-center text-center">
                  {/* Enhanced Action Icon Badge (top-right) */}
                  <div className="absolute top-5 right-5 z-10">
                    <div className="relative group/badge">
                      {/* Badge glow */}
                      <div className={`absolute inset-0 ${g.iconColor} blur-md opacity-40 group-hover/badge:opacity-70 transition-opacity duration-300`}></div>
                      <div className={`relative p-3 ${g.iconColor} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        <g.ActionIcon 
                          className="w-6 h-6 text-white drop-shadow-md"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Gesture Icon Container (center) */}
                  <div className="relative w-full aspect-square mb-6 flex items-center justify-center">
                    <div className={`absolute inset-0 ${g.iconColor} opacity-12 blur-3xl group-hover:opacity-25 group-hover:blur-[48px] transition-all duration-500`}></div>
                    <div className="relative flex justify-center items-center gap-4 w-full h-full bg-gradient-to-br from-[#F5F9FC] via-[#E8F0F7]/60 to-[#D8E4F0]/40 border border-[#5C9BB8]/15 shadow-inner overflow-hidden group-hover:scale-[1.03] transition-transform duration-500">
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      {/* Corner accents */}
                      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-current opacity-30 group-hover:opacity-60 transition-opacity duration-300 ${g.iconColor.replace('bg-', 'text-')}`}></div>
                      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-current opacity-30 group-hover:opacity-60 transition-opacity duration-300 ${g.iconColor.replace('bg-', 'text-')}`}></div>
                      
                      {g.isDouble ? (
                        <>
                          <div className={`relative z-10 p-3.5 ${g.iconColor} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                            <g.GestureIcon 
                              className="w-14 h-14 text-white drop-shadow-lg"
                              strokeWidth={1.5}
                            />
                          </div>
                          <div className={`relative z-10 p-3.5 ${g.iconColor} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                            <g.GestureIcon 
                              className="w-14 h-14 text-white drop-shadow-lg"
                              strokeWidth={1.5}
                            />
                          </div>
                        </>
                      ) : (
                        <div className={`relative z-10 p-5 ${g.iconColor} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <g.GestureIcon 
                            className="w-16 h-16 text-white drop-shadow-lg"
                            strokeWidth={1.5}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3 w-full">
                    <h3 className="font-bold text-xl mb-2 text-[#5C9BB8] uppercase tracking-wider group-hover:text-[#4a89a6] transition-colors duration-300">
                      {g.title}
                    </h3>
                    <p className="text-base leading-relaxed text-[#4a4a4a]/80 group-hover:text-[#4a4a4a] transition-colors duration-300 px-2">
                      {g.description}
                    </p>
                  </div>
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
