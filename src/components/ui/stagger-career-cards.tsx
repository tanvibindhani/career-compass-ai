"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, DollarSign, Clock, Briefcase, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { CareerRecommendation } from '@/components/CareerResults';

interface CareerCardProps {
  position: number;
  career: CareerRecommendation & { tempId: number | string };
  handleMove: (steps: number) => void;
  cardSize: number;
  onSelectCareer: (career: CareerRecommendation) => void;
  onSaveCareer: (career: CareerRecommendation, e: React.MouseEvent) => void;
}

const CareerCard: React.FC<CareerCardProps> = ({
  position,
  career,
  handleMove,
  cardSize,
  onSelectCareer,
  onSaveCareer,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => isCenter ? onSelectCareer(career) : handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 transition-all duration-500 ease-in-out overflow-hidden",
        isCenter
          ? "z-10 bg-primary text-primary-foreground border-primary/80"
          : "z-0 bg-card text-card-foreground border-border hover:border-primary/40"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(40px 0%, calc(100% - 40px) 0%, 100% 40px, 100% 100%, calc(100% - 40px) 100%, 40px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -55 : position % 2 ? 20 : -20}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px hsl(var(--border))"
          : "0px 0px 0px 0px transparent",
      }}
    >
      {/* Match score ring */}
      <div className={cn(
        "absolute top-4 right-4 w-14 h-14 flex items-center justify-center rounded-full border-2",
        isCenter ? "border-primary-foreground/40 bg-primary-foreground/10" : "border-primary/30 bg-primary/5"
      )}>
        <span className={cn("text-sm font-bold", isCenter ? "text-primary-foreground" : "gradient-text")}>
          {career.matchScore}%
        </span>
      </div>

      <div className="p-7 h-full flex flex-col justify-between">
        {/* Title */}
        <div>
          <div className={cn(
            "flex items-center gap-2 mb-3",
            isCenter ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            <Briefcase className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Career Match</span>
          </div>
          <h3 className={cn(
            "text-xl font-bold mb-3 leading-tight",
            isCenter ? "text-primary-foreground" : "text-foreground"
          )}>
            "{career.title}"
          </h3>
          <p className={cn(
            "text-sm leading-relaxed line-clamp-3",
            isCenter ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {career.rationale}
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {career.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border font-medium",
                isCenter
                  ? "bg-primary-foreground/15 border-primary-foreground/30 text-primary-foreground"
                  : "bg-primary/10 border-primary/20 text-primary"
              )}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className={cn(
          "grid grid-cols-3 gap-2 pt-3 border-t",
          isCenter ? "border-primary-foreground/20" : "border-border/60"
        )}>
          <div className="flex flex-col gap-0.5">
            <TrendingUp className={cn("w-3.5 h-3.5 mb-0.5", isCenter ? "text-primary-foreground/60" : "text-accent")} />
            <p className={cn("text-xs", isCenter ? "text-primary-foreground/60" : "text-muted-foreground")}>Growth</p>
            <p className={cn("text-xs font-semibold truncate", isCenter ? "text-primary-foreground" : "text-foreground")}>
              {career.growthPotential}
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <DollarSign className={cn("w-3.5 h-3.5 mb-0.5", isCenter ? "text-primary-foreground/60" : "text-primary")} />
            <p className={cn("text-xs", isCenter ? "text-primary-foreground/60" : "text-muted-foreground")}>Salary</p>
            <p className={cn("text-xs font-semibold truncate", isCenter ? "text-primary-foreground" : "text-foreground")}>
              {career.salaryRange}
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <Clock className={cn("w-3.5 h-3.5 mb-0.5", isCenter ? "text-primary-foreground/60" : "text-accent")} />
            <p className={cn("text-xs", isCenter ? "text-primary-foreground/60" : "text-muted-foreground")}>Transition</p>
            <p className={cn("text-xs font-semibold truncate", isCenter ? "text-primary-foreground" : "text-foreground")}>
              {career.timeToTransition}
            </p>
          </div>
        </div>

        {/* CTA for center card */}
        {isCenter && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => { e.stopPropagation(); onSaveCareer(career, e); }}
              className="flex-1 py-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button
              className="flex-1 py-2 rounded-lg bg-primary-foreground text-primary text-xs font-bold transition-all hover:bg-primary-foreground/90 flex items-center justify-center gap-1.5"
            >
              Explore Path →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface StaggerCareerCardsProps {
  recommendations: CareerRecommendation[];
  onSelectCareer: (career: CareerRecommendation) => void;
  onSaveCareer: (career: CareerRecommendation, e: React.MouseEvent) => void;
}

export const StaggerCareerCards: React.FC<StaggerCareerCardsProps> = ({
  recommendations,
  onSelectCareer,
  onSaveCareer,
}) => {
  const [cardSize, setCardSize] = useState(340);
  const [list, setList] = useState(
    recommendations.map((r, i) => ({ ...r, tempId: i }))
  );

  const handleMove = (steps: number) => {
    const newList = [...list];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setList(newList);
  };

  useEffect(() => {
    const update = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 340 : 270);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Keep list in sync if recommendations change
  useEffect(() => {
    setList(recommendations.map((r, i) => ({ ...r, tempId: i })));
  }, [recommendations]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Stagger cards stage */}
      <div
        className="relative w-full"
        style={{ height: cardSize + 120 }}
      >
        {list.map((career, index) => {
          const position =
            list.length % 2
              ? index - (list.length + 1) / 2
              : index - list.length / 2;
          return (
            <CareerCard
              key={career.tempId}
              position={position}
              career={career}
              handleMove={handleMove}
              cardSize={cardSize}
              onSelectCareer={onSelectCareer}
              onSaveCareer={onSaveCareer}
            />
          );
        })}
      </div>

      {/* Navigation + hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <p className="text-sm text-muted-foreground">
          Click the center card to explore that path, or browse with arrows
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleMove(-1)}
            className={cn(
              "flex h-12 w-12 items-center justify-center transition-all duration-200",
              "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary",
              "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="Previous career"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {list.slice(0, Math.min(list.length, 7)).map((_, i) => {
              const centerIndex = list.length % 2
                ? (list.length + 1) / 2
                : list.length / 2;
              const isActive = i === Math.floor(centerIndex);
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    isActive
                      ? "w-6 h-2 bg-primary"
                      : "w-2 h-2 bg-border"
                  )}
                />
              );
            })}
          </div>

          <button
            onClick={() => handleMove(1)}
            className={cn(
              "flex h-12 w-12 items-center justify-center transition-all duration-200",
              "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary",
              "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="Next career"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
