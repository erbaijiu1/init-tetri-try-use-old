import React, { useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import LCDScreen from './LCDScreen';
import Controls from './Controls';
import { useKeyboard } from '../hooks/useKeyboard';
import { View, Text } from './primitives';

const Game: React.FC = () => {
  const {
    board,
    status,
    score,
    level,
    rowsCleared,
    nextPiece,
    isSoundOn,
    movePlayer,
    dropPlayer,
    moveDown,
    rotate,
    startGame,
    pauseGame,
    keyUp,
    toggleSound
  } = useGame();

  // Use the extracted keyboard hook
  useKeyboard(status, {
    movePlayer,
    moveDown,
    rotate,
    dropPlayer,
    pauseGame,
    startGame,
    toggleSound,
    keyUp
  });

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper for drawing decorative blocks on the casing
  const DotGrid = () => (
    <View className="grid grid-cols-2 gap-1 w-fit">
        <View className="w-1.5 h-1.5 rounded-full bg-black/80"></View>
        <View className="w-1.5 h-1.5 rounded-full bg-black/80"></View>
        <View className="w-1.5 h-1.5 rounded-full bg-black/80"></View>
        <View className="w-1.5 h-1.5 rounded-full bg-black/80"></View>
    </View>
  );

  return (
    <View className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <View className="relative w-full max-w-[420px] bg-[#FFD700] rounded-[20px] shadow-[0_0_0_10px_#ccaa00_inset] flex flex-col items-center p-4 select-none border-b-[8px] border-r-[8px] border-[#D4AC0D]">
        
        {/* Top Header Section */}
        <View className="w-full flex justify-between items-center mt-6 mb-2 px-4">
           {/* Left Stripes */}
           <View className="flex gap-1">
               {[...Array(4)].map((_, i) => <View key={i} className="w-3 h-8 bg-black/80 rounded-sm"></View>)}
           </View>
           
           <Text className="text-4xl font-bold tracking-widest text-black font-sans mx-4 whitespace-nowrap">俄罗斯方块</Text>
           
           {/* Right Stripes */}
           <View className="flex gap-1">
               {[...Array(4)].map((_, i) => <View key={i} className="w-3 h-8 bg-black/80 rounded-sm"></View>)}
           </View>
        </View>

        {/* Middle Section: Decorations + Screen */}
        <View className="w-full flex justify-between items-start mb-6 px-2">
            
            {/* Left Decorations (Speaker/Grip Dots) */}
            <View className="flex flex-col gap-6 mt-12 px-2">
                <DotGrid />
                <DotGrid />
                <DotGrid />
                <DotGrid />
            </View>

            {/* Main Screen Area */}
            <View className="bg-black p-5 pb-8 rounded-t-sm rounded-b-[2.5rem] shadow-xl relative mx-1 mt-2">
                {/* Inner Gold Border */}
                <View className="border-[4px] border-[#a08855] rounded-sm bg-[#9EAD86] p-1 shadow-inner relative">
                    <LCDScreen 
                        board={board} 
                        score={score} 
                        level={level} 
                        lines={rowsCleared} 
                        nextPiece={nextPiece}
                        gameOver={status === 'GAME_OVER'}
                        isSoundOn={isSoundOn}
                    />
                </View>
            </View>

            {/* Right Decorations (Speaker/Grip Dots) */}
            <View className="flex flex-col gap-6 mt-12 px-2">
                <DotGrid />
                <DotGrid />
                <DotGrid />
                <DotGrid />
            </View>
        </View>

        {/* Controls Section */}
        <Controls
            onLeft={() => movePlayer(-1)}
            onRight={() => movePlayer(1)}
            onDown={moveDown}
            onRotate={() => rotate(1)}
            onDrop={dropPlayer}
            onPause={pauseGame}
            onReset={startGame}
            onSoundToggle={toggleSound}
        />

      </View>
    </View>
  );
};

export default Game;