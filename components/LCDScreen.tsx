import React from 'react';
import { BoardShape, Tetromino } from '../types';
import { View, Text } from './primitives';

interface LCDScreenProps {
  board: BoardShape;
  score: number;
  level: number;
  lines: number;
  nextPiece: Tetromino;
  gameOver: boolean;
  isSoundOn: boolean;
}

const LCDScreen: React.FC<LCDScreenProps> = ({ board, score, level, lines, nextPiece, gameOver, isSoundOn }) => {
  // Render a cell with grid border
  const renderCell = (cell: any, rowIndex: number, colIndex: number) => {
    // cell can be 0 or [value, status]
    const isFilled = Array.isArray(cell) ? cell[0] !== 0 : cell !== 0;
    
    return (
      <View
        key={`${rowIndex}-${colIndex}`}
        className={`w-full h-full border-[1px] border-[#879372] ${
          isFilled 
            ? 'bg-black' 
            : 'bg-transparent'
        }`}
      />
    );
  };

  // Mini grid for next piece
  const renderNextPiece = () => {
    const grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    return (
      <View className="grid grid-cols-4 gap-0 w-12 h-12 mt-2">
        {grid.map((row, y) =>
          row.map((_, x) => {
            const isFilled = nextPiece.shape[y] && nextPiece.shape[y][x];
             return (
              <View
                key={`next-${y}-${x}`}
                className={`w-full h-full border-[1px] border-[#879372] ${
                  isFilled ? 'bg-black' : 'bg-transparent'
                }`}
              />
            );
          })
        )}
      </View>
    );
  };

  const formatNumber = (num: number) => {
    return num.toString().padStart(6, '0');
  };

  return (
    <View className="bg-[#9EAD86] flex flex-row gap-3 w-full h-full font-mono relative overflow-hidden">
       {/* Main Grid Area */}
       <View className="border-[2px] border-black p-[2px] z-10 bg-[#9EAD86]">
           <View className="w-[140px] h-[260px] grid grid-rows-[20] grid-cols-10 border border-[#879372] relative bg-[#9EAD86]">
              {/* Background Text inside the screen */}
              <View className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] z-0">
                  <Text className="text-2xl font-bold text-black transform -rotate-12 whitespace-nowrap">俄罗斯方块</Text>
              </View>
              
              {/* Grid Cells */}
              <View className="absolute inset-0 grid grid-rows-[20] grid-cols-10 z-10">
                 {board.map((row, y) => row.map((cell, x) => renderCell(cell, y, x)))}
              </View>
           </View>
           
           {gameOver && (
             <View className="absolute inset-0 flex items-center justify-center bg-black/10 z-20">
               <View className="bg-[#9EAD86] border-2 border-black px-4 py-2 text-black animate-pulse shadow-lg">
                 <Text className="text-xl font-bold">GAME OVER</Text>
               </View>
             </View>
           )}
       </View>

       {/* Side Info Panel */}
       <View className="flex-1 flex flex-col pt-4 text-black font-bold z-10">
          <View className="mb-4">
            <Text className="text-xs mb-0 block">上轮得分</Text>
            <Text className="text-right text-lg font-mono tracking-widest leading-none block">{formatNumber(score)}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-xs mb-0 block">起始行</Text>
            <Text className="text-right text-lg font-mono tracking-widest leading-none block">000000</Text>
          </View>

          <View className="mb-4">
             <Text className="text-xs mb-0 block">级别</Text>
             <Text className="text-right text-lg font-mono tracking-widest leading-none block">{formatNumber(level)}</Text>
          </View>

          <View>
             <Text className="text-xs mb-0 block">下一个</Text>
             <View className="flex justify-end pr-2">
                 {renderNextPiece()}
             </View>
          </View>

          <View className="mt-auto mb-2 flex justify-end gap-1 items-center opacity-80">
             {isSoundOn && <Text className="text-lg">♪</Text>}
             <Text className="text-xs font-mono">15:50</Text> 
          </View>
       </View>
    </View>
  );
};

export default LCDScreen;
