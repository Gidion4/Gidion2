/**
 * Volume & Orderflow Analyzer
 * 
 * Delta calculation, absorption detection, volume imbalance,
 * and aggression metrics.
 */
export const name = 'volume-orderflow';
export const description = 'Delta, absorption, exhaustion, volume imbalance analysis';
export const version = '1.0.0';

function calcDelta(candles) {
  if (candles.length < 2) return 0;
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 1];
  // Simplified delta: close vs open
  const delta = (last.c - last.o) * (last.v || 1);
  return Math.round(delta * 100) / 100;
}

function calcCVD(candles) {
  let cvd = 0;
  for (const c of candles) {
    cvd += (c.c - c.o) * (c.v || 1);
  }
  return Math.round(cvd * 100) / 100;
}

function detectAbsorption(candles, lookback = 20) {
  const recent = candles.slice(-lookback);
  if (recent.length < 5) return { absorbing: false };
  
  const avgVol = recent.reduce((a, c) => a + (c.v || 0), 0) / recent.length;
  const lastVol = recent[recent.length - 1].v || 0;
  
  // Absorption: very high volume but price barely moved
  const lastRange = recent[recent.length - 1].h - recent[recent.length - 1].l;
  const avgRange = recent.reduce((a, c) => a + (c.h - c.l), 0) / recent.length;
  
  const volRatio = lastVol / avgVol;
  const rangeRatio = lastRange / avgRange;
  
  // Absorbing if volume spike but range contracted
  const absorbing = volRatio > 2 && rangeRatio < 0.7;
  
  return {
    absorbing,
    volume_ratio: Math.round(volRatio * 100) / 100,
    range_ratio: Math.round(rangeRatio * 100) / 100,
    avg_volume: Math.round(avgVol * 100) / 100,
    last_volume: lastVol,
    type: absorbing ? (rangeRatio < 0.5 ? 'strong_absorption' : 'moderate_absorption') : 'normal'
  };
}

function detectExhaustion(candles) {
  if (candles.length < 14) return { exhausted: false };
  const recent = candles.slice(-14);
  constvol = recent.slice(-5).reduce((a, c) => a + (c.v || 0), 0) / 5;
  const prevVol = recent.slice(-14, -5).reduce((a, c) => a + (c.v || 0), 0) / 9;
  
  if (prevVol === 0) return { exhausted: false };
  const volDrop = avgVol / prevVol;
  
  const priceDir = recent[recent.length - 1].c > recent[0].c ? 'up' : 'down';
  const exhausted = volDrop < 0.4 && Math.abs(recent[recent.length - 1].c - recent[0].c) / recent[0].c > 0.02;
  
  return {
    exhausted,
    volume_drop_ratio: Math.round(volDrop * 100) / 100,
    price_direction: priceDir,
    type: exhausted ? 'volume_exhaustion' : 'normal'
  };
}

function calcVolumeImbalance(candles) {
  if (candles.length < 5) return { imbalance: 0 };
  
  const recent = candles.slice(-5);
  let bidVol = 0, askVol = 0;
  
  for (const c of recent) {
    if (c.c >= c.o) bidVol += c.v || 0;
    else askVol += c.v || 0;
  }
  
  const total = bidVol + askVol;
  if (total === 0) return { imbalance: 0 };
  
  const imbalance = (bidVol - askVol) / total;
  return {
    imbalance: Math.round(imbalance * 100) / 100,
    bid_volume: Math.round(bidVol * 100) / 100,
    ask_volume: Math.round(askVol * 100) / 100,
    interpretation: imbalance > 0.3 ? 'bullish_volume' : imbalance < -0.3 ? 'bearish_volume' : 'balanced'
  };
}

export const tools = [
  {
    name: 'vol_analyze',
    description: 'Full volume/orderflow analysis',
    parameters: {
      type: 'object',
      properties: {
        candles: { type: 'string', description: 'JSON array of candles [{t, o, h, l, c, v}]' }
      },
      required: ['candles']
    },
    execute: async (params) => {
      const candles = JSON.parse(params.candles);
      if (!Array.isArray(candles) || candles.length < 2) {
        return { error: 'Need at least 2 candles' };
      }
      
      const delta = calcDelta(candles);
      const cvd = calcCVD(candles);
      const absorption = detectAbsorption(candles);
      const exhaustion = detectExhaustion(candles);
      const imbalance = calcVolumeImbalance(candles);
      
      // Overall signal
      let signal = 'neutral';
      let confidence = 0.5;
      
      if (absorption.absorbing) { signal = 'absorption_detected'; confidence = 0.7; }
      if (exhaustion.exhausted) { signal = 'exhaustion_detected'; confidence = 0.6; }
      if (imbalance.imbalance > 0.5) { signal = 'strong_bid_volume'; confidence = 0.8; }
      if (imbalance.imbalance < -0.5) { signal = 'strong_ask_volume'; confidence = 0.8; }
      
      return {
        delta: Math.round(delta * 100) / 100,
        cvd: cvd,
        absorption,
        exhaustion,
        imbalance,
        signal,
        confidence,
        candles_analyzed: candles.length
      };
    }
  },
  {
    name: 'vol_delta',
    description: 'Calculate delta for recent candles',
    parameters: {
      type: 'object',
      properties: {
        candles: { type: 'string', description: 'JSON array of candles' }
      },
      required: ['candles']
    },
    execute: async (params) => {
      const candles = JSON.parse(params.candles);
      return { delta: calcDelta(candles), cvd: calcCVD(candles) };
    }
  }
];

export async function init(ctx) { ctx.log('volume-orderflow module loaded'); }
