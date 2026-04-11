/**
 * Wick Analyzer Module
 * 
 * Analyzes wick patterns: significance scoring, level tracking,
 * revisit reactivity, and real-time wick formation timing.
 */

export const name = 'wick-analyzer';
export const description = 'Historical + live wick analysis, level mapping, revisit reactivity scoring';
export const version = '1.0.0';

const dataDir = './data/blacksmith/wicks';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

// Calculate wick significance score
function wickSignificance(candle, atr) {
  const upperWick = candle.h - Math.max(candle.o, candle.c);
  const lowerWick = Math.min(candle.o, candle.c) - candle.l;
  const body = Math.abs(candle.c - candle.o);
  const range = candle.h - candle.l;
  
  if (range === 0) return { upperScore: 0, lowerScore: 0, totalScore: 0 };
  
  const upperScore = (upperWick / atr) * (body / range < 0.3 ? 2 : 1);
  const lowerScore = (lowerWick / atr) * (body / range < 0.3 ? 2 : 1);
  
  return {
    upperScore: Math.round(upperScore * 100) / 100,
    lowerScore: Math.round(lowerScore * 100) / 100,
    upperWick,
    lowerWick,
    body,
    range,
    wickBodyRatio: Math.max(upperWick, lowerWick) / (body || 1),
    isRejection: body / range < 0.3 && Math.max(upperWick, lowerWick) / range > 0.6
  };
}

// Identify wick zones
function buildWickZone(candle) {
  const bodyTop = Math.max(candle.o, candle.c);
  const bodyBottom = Math.min(candle.o, candle.c);
  const mid = (candle.h + candle.l) / 2;
  
  return {
    upperWickZone: { min: bodyTop, max: candle.h },
    lowerWickZone: { min: candle.l, max: bodyBottom },
    midpoint: mid,
    tip: candle.h > candle.l ? candle.h : candle.l,
    base: candle.h > candle.l ? bodyTop : bodyBottom,
    isUpperWick: candle.h > candle.l && (candle.h - bodyTop) > (bodyBottom - candle.l),
    isLowerWick: candle.l < candle.h && (bodyBottom - candle.l) > (candle.h - bodyTop)
  };
}

// Score historical wick levels
function scoreHistoricalWick(wicks, candles) {
  if (!wicks || wicks.length === 0) return { score: 0, freshness: 1, priority: 'low' };
  
  let totalScore = 0;
  let freshnessSum = 0;
  
  wicks.forEach((w, i) => {
    const age = wicks.length - i;
    const freshness = 1 / (1 + age * 0.1);
    freshnessSum += freshness;
    totalScore += w.score * freshness;
  });
  
  const avgScore = totalScore / wicks.length;
  const avgFreshness = freshnessSum / wicks.length;
  const priority = avgScore > 2 ? 'high' : avgScore > 1 ? 'medium' : 'low';
  
  return {
    score: Math.round(avgScore * 100) / 100,
    freshness: Math.round(avgFreshness * 100) / 100,
    priority,
    levels: wicks.length
  };
}

// Check if price revisits a wick zone
function checkRevisit(zone, currentPrice, tolerance = 0.001) {
  const { min, max } = zone;
  const buffer = (max - min) * tolerance;
  return currentPrice >= min - buffer && currentPrice <= max + buffer;
}

// Analyze approach quality
function analyzeApproach(candles, zone, direction) {
  const recent = candles.slice(-5);
  const speeds = [];
  
  for (let i = 1; i < recent.length; i++) {
    const change = Math.abs(recent[i].c - recent[i - 1].c);
    const timeDiff = recent[i].t - recent[i - 1].t || 1;
    speeds.push(change / timeDiff);
  }
  
  const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  
  // Classify approach
  let approachType;
  if (avgSpeed > 0.0005) approachType = 'impulsive';
  else if (avgSpeed > 0.0001) approachType = 'moderate';
  else approachType = 'grinding';
  
  // Micro compression before zone
  const compression = recent.length >= 3 &&
    (recent[recent.length - 1].h - recent[recent.length - 1].l) <
    (recent[recent.length - 3].h - recent[recent.length - 3].l) * 0.7;
  
  return {
    approachType,
    approachSpeed: Math.round(avgSpeed * 10000) / 10000,
    microCompression: compression
  };
}

export const tools = [
  {
    name: 'wick_analyze',
    description: 'Analyze wick significance from candle data',
    parameters: {
      type: 'object',
      properties: {
        candles: { type: 'string', description: 'JSON array of candles [{t, o, h, l, c, v}]' },
        atr: { type: 'number', description: 'ATR value for normalization' }
      },
      required: ['candles']
    },
    execute: async (params) => {
      const candles = JSON.parse(params.candles);
      if (!Array.isArray(candles) || candles.length < 2) {
        return { error: 'Need candles data' };
      }
      
      const atr = params.atr || (() => {
        let sum = 0;
        for (let i = 1; i < Math.min(candles.length, 14); i++) {
          sum += Math.max(candles[i].h - candles[i].l, Math.abs(candles[i].h - candles[i-1].c), Math.abs(candles[i].l - candles[i-1].c));
        }
        return sum / Math.min(candles.length - 1, 14);
      })();
      
      const upperWicks = [];
      const lowerWicks = [];
      const zones = [];
      
      for (const c of candles.slice(-50)) {
        const w = wickSignificance(c, atr);
        const z = buildWickZone(c);
        zones.push(z);
        
        if (z.isUpperWick && w.upperScore > 0.3) {
          upperWicks.push({ price: c.h, score: w.upperScore, time: c.t, zone: z.upperWickZone });
        }
        if (z.isLowerWick && w.lowerScore > 0.3) {
          lowerWicks.push({ price: c.l, score: w.lowerScore, time: c.t, zone: z.lowerWickZone });
        }
      }
      
      const upperScore = scoreHistoricalWick(upperWicks, candles);
      const lowerScore = scoreHistoricalWick(lowerWicks, candles);
      
      return {
        upperWickLevels: upperWicks.slice(-10),
        lowerWickLevels: lowerWicks.slice(-10),
        upperSignificance: upperScore,
        lowerSignificance: lowerScore,
        totalLevels: upperWicks.length + lowerWicks.length,
        atr: Math.round(atr * 100) / 100,
        candles_analyzed: candles.length
      };
    }
  },
  {
    name: 'wick_check_revisit',
    description: 'Check if current price is revisiting a wick zone',
    parameters: {
      type: 'object',
      properties: {
        zone_min: { type: 'number' },
        zone_max: { type: 'number' },
        current_price: { type: 'number' },
        candles: { type: 'string', description: 'Recent candles for approach analysis' }
      },
      required: ['zone_min', 'zone_max', 'current_price']
    },
    execute: async (params) => {
      const zone = { min: params.zone_min, max: params.zone_max };
      const revisiting = checkRevisit(zone, params.current_price);
      const approach = params.candles ? analyzeApproach(JSON.parse(params.candles), zone, null) : null;
      
      return {
        revisiting,
        distance_from_zone: Math.abs(params.current_price - (zone.min + zone.max) / 2),
        approach: approach || null,
        touchType: revisiting ? 'exact' : 'near',
        zone_mid: (zone.min + zone.max) / 2,
        tolerance_pct: Math.round(((zone.max - zone.min) / zone.min) * 100 * 100) / 100
      };
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('wick-analyzer module loaded');
}
