import React from 'react';
import { View, Text, Button } from './primitives';

interface ControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onDrop: () => void;
  onPause: () => void;
  onReset: () => void;
  onSoundToggle: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onLeft,
  onRight,
  onDown,
  onRotate,
  onDrop,
  onPause,
  onReset,
  onSoundToggle
}) => {
  
  // Top row small buttons
  const SmallButton = ({ label, color, onClick }: { label: string, color: string, onClick: () => void }) => (
    <View className="flex flex-col items-center gap-1">
      <Button
        onClick={onClick}
        className={`w-10 h-10 rounded-full shadow-[0_3px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-[2px] transition-all border border-black/10 ${color}`}
      ></Button>
      <Text className="text-[10px] font-bold text-black">{label}</Text>
    </View>
  );

  // Directional Buttons
  const DirButton = ({ 
    label, 
    onClick, 
    className, 
    labelPos = 'bottom' 
  }: { 
    label?: string, 
    onClick: () => void, 
    className?: string,
    labelPos?: 'bottom' | 'right'
  }) => (
    <View className={`absolute ${className} flex flex-col items-center`}>
        <Button
            onClick={onClick}
            className="w-14 h-14 bg-[#4a6ae6] rounded-full shadow-[0_4px_0_#2b3a8a] active:shadow-none active:translate-y-[2px] transition-all relative overflow-hidden group border-b-2 border-[#1a2f85] z-10"
        >
             <View className="absolute top-1 left-2 w-8 h-8 rounded-full bg-white/20 blur-[2px] pointer-events-none"></View>
        </Button>
        {label && labelPos === 'bottom' && (
            <Text className="absolute whitespace-nowrap text-xs font-bold text-black pointer-events-none" style={{ top: '60px', left: '50%', transform: 'translateX(-50%)' }}>
                {label}
            </Text>
        )}
        {label && labelPos === 'right' && (
            <Text className="absolute whitespace-nowrap text-xs font-bold text-black pointer-events-none" style={{ top: '50%', left: '60px', transform: 'translateY(-50%)' }}>
                {label}
            </Text>
        )}
    </View>
  );

  return (
    <View className="w-full mt-4 flex flex-col gap-4 px-2">
      {/* 1. Small Utility Buttons Row */}
      <View className="flex justify-start gap-5 ml-4 mb-2">
        <SmallButton label="暂停(P)" color="bg-[#22c55e]" onClick={onPause} />
        <SmallButton label="音效(S)" color="bg-[#22c55e]" onClick={onSoundToggle} />
        <SmallButton label="重玩(R)" color="bg-[#ef4444]" onClick={onReset} />
      </View>

      {/* 2. Main Controls Area - Swapped Layout */}
      <View className="flex justify-between items-end mt-2 px-2">
          
        {/* Big DROP Button (Left side) */}
        <View className="flex flex-col items-center mb-6 ml-4">
           <Button
             onClick={onDrop}
             className="w-24 h-24 bg-[#4a6ae6] rounded-full shadow-[0_6px_0_#2b3a8a] active:shadow-none active:translate-y-[3px] transition-all relative overflow-hidden border-b-4 border-[#1a2f85]"
           >
              <View className="absolute top-3 left-4 w-12 h-12 rounded-full bg-white/20 blur-md pointer-events-none"></View>
           </Button>
           <Text className="text-sm font-bold text-black mt-3">掉落 (SPACE)</Text>
        </View>

        {/* D-PAD Area (Right Side) */}
        <View className="relative w-44 h-44 -mt-8 mr-2">
            {/* Rotate (Up) */}
            <DirButton 
                label="旋转" 
                onClick={onRotate} 
                className="top-0 left-1/2 -translate-x-1/2"
                labelPos="right"
            />
            
            {/* Left */}
            <DirButton 
                label="左移" 
                onClick={onLeft} 
                className="top-1/2 left-0 -translate-y-1/2"
                labelPos="bottom"
            />

            {/* Right */}
            <DirButton 
                label="右移" 
                onClick={onRight} 
                className="top-1/2 right-0 -translate-y-1/2"
                labelPos="bottom"
            />

            {/* Down */}
            <DirButton 
                label="下移" 
                onClick={onDown} 
                className="bottom-0 left-1/2 -translate-x-1/2"
                labelPos="bottom"
            />
        </View>

      </View>
    </View>
  );
};

export default Controls;