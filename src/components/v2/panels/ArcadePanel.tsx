"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";

const BG     = "#16161a";
const CARD   = "#1c1c22";
const BORDER = "rgba(255,255,255,0.07)";

const GAMES = [
  { emoji: "⚄", name: "Dice 21",      players: 24, tag: "Hot",  tagColor: "#ef4444", tagBg: "#3d1010" },
  { emoji: "♠", name: "Poker Dice",   players: 11, tag: null,   tagColor: "",         tagBg: "" },
  { emoji: "◈", name: "Prism",        players: 8,  tag: "New",  tagColor: "#4ade80",  tagBg: "#103d20" },
  { emoji: "▦", name: "Spatial Match",players: 3,  tag: null,   tagColor: "",         tagBg: "" },
];

const LEADERBOARD = [
  { rank: 1, name: "whittfield",  score: 2840, change: "+180", up: true },
  { rank: 2, name: "alexr",       score: 2670, change: "+90",  up: true },
  { rank: 3, name: "lunaK",       score: 2510, change: "-40",  up: false },
  { rank: 4, name: "dkemper",     score: 2380, change: "+20",  up: true },
  { rank: 5, name: "priya_d",     score: 2190, change: "+5",   up: true },
];

const DICE_FACES = ["⚀","⚁","⚂","⚃","⚄","⚅"];

function DiceRoll({ finalValue, startDelay }: { finalValue: number; startDelay: number }) {
  const [face, setFace] = useState(DICE_FACES[0]);
  const tickRef = useRef(0);
  const startedRef = useRef(false);

  useAnimationFrame((t) => {
    if (t < startDelay) return;
    if (!startedRef.current) startedRef.current = true;
    const localT = t - startDelay;
    const tick = Math.floor(localT / 90);
    if (tick !== tickRef.current) {
      tickRef.current = tick;
      if (tick < 10) {
        setFace(DICE_FACES[Math.floor(Math.random() * 6)]);
      } else {
        setFace(DICE_FACES[finalValue - 1]);
      }
    }
  });

  return <span className="text-2xl leading-none">{face}</span>;
}

export default function ArcadePanel() {
  return (
    <div className="relative h-full w-full overflow-hidden font-sans" style={{ background: BG }}>

      {/* Chrome */}
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#ffbd2e]" />
            <span className="size-3 rounded-full bg-[#28ca41]" />
          </div>
          <div className="h-4 w-px mx-2" style={{ background: BORDER }} />
          <span className="text-[11px] font-medium text-white/60">10 Speed Studios</span>
          <span className="text-white/20">—</span>
          <span className="text-[11px] text-white/40">Arcade</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px]" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-white/50">46 players online</span>
        </div>
      </div>

      {/* Body */}
      <div className="grid h-[calc(100%-45px)] grid-cols-[1fr_160px]">

        {/* Left: active game */}
        <div className="border-r p-4" style={{ borderColor: BORDER }}>
          {/* Active game card */}
          <div className="mb-4 rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚄</span>
                <div>
                  <p className="text-[13px] font-semibold text-white/90">Dice 21</p>
                  <p className="text-[10px] text-white/35">Round 3 of 5 · Your turn</p>
                </div>
              </div>
              <span className="rounded-full px-2.5 py-1 text-[9px] font-medium" style={{ background: "#1c3626", color: "#4ade80" }}>
                In Progress
              </span>
            </div>

            {/* Dice area */}
            <div className="mb-3 flex items-center justify-between rounded-lg px-4 py-3" style={{ background: BG, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-5">
                <DiceRoll finalValue={4} startDelay={500} />
                <DiceRoll finalValue={6} startDelay={700} />
                <DiceRoll finalValue={3} startDelay={900} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#c9a55a]">13</p>
                <p className="text-[9px] text-white/30">target: 21</p>
              </div>
            </div>

            {/* Score bar */}
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-[9px] text-white/30">
                <span>Score</span><span>13 / 21</span>
              </div>
              <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full bg-[#c9a55a]" style={{ width: `${(13/21)*100}%` }} />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 rounded-lg py-2 text-[11px] font-semibold text-[#c9a55a]" style={{ background: "rgba(201,165,90,0.15)", border: "1px solid rgba(201,165,90,0.25)" }}>
                Roll Again
              </button>
              <button className="flex-1 rounded-lg py-2 text-[11px] text-white/40" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                Stand
              </button>
            </div>
          </div>

          {/* Game list */}
          <div>
            <p className="mb-2 text-[9px] uppercase tracking-widest text-white/20">All Games</p>
            {GAMES.map((game) => (
              <div key={game.name} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.03] cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{game.emoji}</span>
                  <span className="text-[12px] text-white/65">{game.name}</span>
                  {game.tag && (
                    <span className="rounded px-1.5 py-0.5 text-[9px] font-medium" style={{ background: game.tagBg, color: game.tagColor }}>
                      {game.tag}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-white/25">{game.players} playing</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: leaderboard */}
        <div className="flex flex-col p-3">
          <p className="mb-3 text-[9px] uppercase tracking-widest text-white/20">Top Players</p>
          {LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className="mb-1.5 rounded-lg px-2.5 py-2"
              style={{
                background: entry.rank === 1 ? "rgba(201,165,90,0.08)" : CARD,
                border: `1px solid ${entry.rank === 1 ? "rgba(201,165,90,0.2)" : BORDER}`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold ${entry.rank === 1 ? "text-[#c9a55a]" : "text-white/25"}`}>
                  #{entry.rank}
                </span>
                <span className={`text-[9px] font-medium ${entry.up ? "text-emerald-400" : "text-red-400"}`}>
                  {entry.change}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/60">{entry.name}</span>
                <span className="font-mono text-[10px] text-white/40">{entry.score.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
