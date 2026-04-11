/**
 * Execution Intelligence Module
 * 
 * Evaluates fill probability, slippage, latency,
 * order type selection, and execution feasibility.
 */
export const name = 'execution-intel';
export const description = 'Execution feasibility, order type selection, slippage estimation';
export const version = '1.0.0';

function calcFillProbability(liquidity, volatility, approachSpeed) {
  // Higher liquidity = higher fill probability
  const liqFactor = Math.min(liquidity || 0.5, 1);
  // Higher volatility = lower fill probability
  const volFactor = 1 - Math.min((volatility || 0.5) * 0.5, 0.3);
  // Faster approach = harder to fill
  const speedFactor = 1 - Math.min((approachSpeed || 0.5) * 0.3, 0.2);
  const prob = liqFactor * volFactor * speedFactor;
  return Math.round(Math.max(0.1, Math.min(1, prob)) * 100) / 100;
}

function calcSlippage(volatility, orderSize, liquidity) {
  const base = (volatility || 0.5) * 0.002;
  const sizeCost = (orderSize || 1) * 0.0005;
  const liqPenalty = 1 - (liquidity || 0.5) * 0.3;
  return Math.round((base + sizeCost * liqPenalty) * 10000) / 10000;
}

function selectOrderType(situation, liquidity, volatility) {
  // Market order when:
  if (situation === 'momentum' || situation === 'fast_sweep') return 'market';
  
  // Limit order when:
  if (situation === 'wick_entry' || situation === 'mean_reversion') return 'limit';
  
  // Stop order when:
  if (situation === 'breakout') return 'stop';
  
  // Hybrid when uncertain:
  return 'hybrid_limit_market';
}

export const tools = [
  {
    name: 'exec_evaluate',
    description: 'Evaluate execution feasibility for a trade',
    parameters: {
      type: 'object',
      properties: {
        situation: { type: 'string', description: 'wick_entry|mean_reversion|momentum|breakout|fast_sweep' },
        liquidity: { type: 'number', default: 0.5, description: '0-1 liquidity score' },
        volatility: { type: 'number', default: 0.5, description: '0-1 volatility' },
        approach_speed: { type: 'number', default: 0.5, description: '0-1 approach speed' },
        order_size: { type: 'number', default: 1 }
      }
    },
    execute: async (params) => {
      const fillProb = calcFillProbability(params.liquidity, params.volatility, params.approach_speed);
      const slippage = calcSlippage(params.volatility, params.order_size, params.liquidity);
      const orderType = selectOrderType(params.situation, params.liquidity, params.volatility);
      
      let recommendation;
      if (fillProb < 0.5) recommendation = 'SKIP';
      else if (fillProb < 0.7) recommendation = 'REDUCE_SIZE';
      else if (fillProb < 0.85) recommendation = 'LIMIT_PREFERRED';
      else recommendation = 'EXECUTE';
      
      return {
        fill_probability: fillProb,
        slippage_estimate: slippage,
        slippage_pct: (slippage * 100).toFixed(4) + '%',
        recommended_order_type: orderType,
        recommendation,
        skip_threshold: 0.5,
        reduce_threshold: 0.7
      };
    }
  },
  {
    name: 'exec_slippage_estimate',
    description: 'Estimate realistic slippage for an order',
    parameters: {
      type: 'object',
      properties: {
        volatility: { type: 'number' },
        order_size_sol: { type: 'number' },
        liquidity_depth: { type: 'number' }
      },
      required: ['volatility']
    },
    execute: async (params) => {
      const slippage = calcSlippage(params.volatility, params.order_size_sol || 1, params.liquidity_depth || 0.5);
      return {
        estimated_slippage: slippage,
        estimated_slippage_pct: (slippage * 100).toFixed(4) + '%',
        cost_in_sol: params.order_size_sol ? (params.order_size_sol * slippage).toFixed(6) : 'N/A',
        warning: slippage > 0.003 ? 'HIGH SLIPPAGE - consider reducing size or waiting' : null
      };
    }
  }
];

export async function init(ctx) {
  ctx.log('execution-intel module loaded');
}
