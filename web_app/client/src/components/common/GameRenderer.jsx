import { MemoryGame } from '../../views/Games/components/memory/MemoryGame';
import { VisualSequenceGame } from '../../views/Games/components/memory/VisualSequenceGame';
import { ReactionGame } from '../../views/Games/components/speed/ReactionGame';
import { LightReactionGame } from '../../views/Games/components/speed/LightReactionGame';
import { ColorGame } from '../../views/Games/components/color/ColorGame';
import { ColorSortingGame } from '../../views/Games/components/color/ColorSortingGame';
import { HearingGame } from '../../views/Games/components/hearing/HearingGame';
import { PathSoundGame } from '../../views/Games/components/hearing/PathSoundGame';
import { PuzzleGame } from '../../views/Games/components/IQ/PuzzleGame';
import { OddOneOutGame } from '../../views/Games/components/IQ/OddOneOutGame';
import { DrawingGame } from '../../views/Games/components/drawing/DrawingGame';

export const GameRenderer = ({ gameId, difficulty, onFinish, renderKey }) => {
  const games = {
    Matching: <MemoryGame key={renderKey} difficulty={difficulty} onFinish={onFinish} />,
    'visual Sequence': <VisualSequenceGame key={renderKey} difficulty={difficulty} onFinish={onFinish} />,
    'Bug Catch': <ReactionGame key={renderKey} difficulty={difficulty} onFinish={onFinish} />,
    'Light Reaction': <LightReactionGame key={renderKey} difficulty={difficulty} onFinish={onFinish} />,
    'Colors Identification': <ColorGame key={renderKey} difficulty={difficulty} onFinish={onFinish} />,
    'Color Sorting': <ColorSortingGame key={renderKey} difficulty={difficulty} onFinish={onFinish} />,
    'Sound Identification': <HearingGame key={renderKey} difficulty={difficulty} onFinish={onFinish} />,
    'Path Sound': <PathSoundGame key={renderKey} difficulty={difficulty} onFinish={onFinish} />,
    Puzzle: <PuzzleGame key={renderKey} difficulty={difficulty} onFinish={onFinish} />,
    'Odd One Out': <OddOneOutGame key={renderKey} difficulty={difficulty} onFinish={onFinish} />,
    Drawing: <DrawingGame key={renderKey} onFinish={onFinish} />,
  };

  return games[gameId] || null;
};
