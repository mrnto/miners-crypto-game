export const getPrice = (miner, level) => {
    if (miner >= 3) return 0;
    if (level == 0) return [100, 1000, 10000][miner];
    if (level == 1) return [200, 2000, 20000][miner];
    if (level == 2) return [300, 3000, 30000][miner];
    if (level == 3) return [400, 4000, 40000][miner];
    if (level == 4) return [500, 5000, 50000][miner];
    return 0;
};

export const getYield = (miner, level) => {
    if (miner >= 3) return 0;
    if (level == 0) return [3, 30, 300][miner];
    if (level == 1) return [4, 40, 400][miner];
    if (level == 2) return [5, 50, 500][miner];
    if (level == 3) return [6, 60, 600][miner];
    if (level == 4) return [7, 70, 700][miner];
    return 0;
};