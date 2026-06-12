import { Brain, Layers, Hand, Zap, Palette, Archive, Ear, Music, Puzzle, Search, PenTool } from 'lucide-react';

export const TEST_DETAILS = {
  Matching: { title: 'Memory Match', icon: Brain, bg: 'bg-green-100', text: 'text-green-500' },
  'visual Sequence': { title: 'Visual Sequence', icon: Layers, bg: 'bg-green-100', text: 'text-green-500' },
  'Bug Catch': { title: 'Reaction Bug', icon: Hand, bg: 'bg-red-100', text: 'text-red-500' },
  'Light Reaction': { title: 'Light Reaction', icon: Zap, bg: 'bg-red-100', text: 'text-red-500' },
  'Colors Identification': { title: 'Color Explorer', icon: Palette, bg: 'bg-blue-100', text: 'text-blue-500' },
  'Color Sorting': { title: 'Color Sorting', icon: Archive, bg: 'bg-blue-100', text: 'text-blue-500' },
  'Sound Identification': { title: 'Sound Explorer', icon: Ear, bg: 'bg-purple-100', text: 'text-purple-500' },
  'Path Sound': { title: 'Path Sound', icon: Music, bg: 'bg-purple-100', text: 'text-purple-500' },
  Puzzle: { title: 'Puzzle Maker', icon: Puzzle, bg: 'bg-pink-100', text: 'text-pink-500' },
  'Odd One Out': { title: 'Odd One Out', icon: Search, bg: 'bg-pink-100', text: 'text-pink-500' },
  Drawing: { title: 'Creative Canvas', icon: PenTool, bg: 'bg-yellow-100', text: 'text-yellow-500' },
};
