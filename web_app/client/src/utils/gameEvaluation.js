const isStruggle = (value, struggleLimit, isHigherBetter = true) => {
  if (isHigherBetter) {
    return value < struggleLimit;
  } else {
    return value > struggleLimit;
  }
};

export const evaluateGamePerformance = (metrics, thresholds) => {
  const type = metrics.type;

  if (type === 'Art') return true;

  const limits = thresholds[type];

  if (!limits) {
    console.warn(`No thresholds found for type: ${type}`);
    return true;
  }

  console.log(metrics);

  switch (type) {
    case 'Memory':
      return !(
        isStruggle(metrics.ar, limits.accuracy.struggle, true) ||
        isStruggle(metrics.arl, limits.latencyMs.struggle, false)
      );

    case 'Reaction Speed':
      return !(
        isStruggle(metrics.pi, limits.precision.struggle, true) ||
        isStruggle(metrics.mrt, limits.responseTimeMs.struggle, false)
      );

    case 'Color Explore':
      return !(
        isStruggle(metrics.ar, limits.accuracy.struggle, true) ||
        isStruggle(metrics.redProfile, limits.rgbProfile.struggle, true) ||
        isStruggle(metrics.greenProfile, limits.rgbProfile.struggle, true) ||
        isStruggle(metrics.blueProfile, limits.rgbProfile.struggle, true)
      );

    case 'Hearing':
      return !(
        isStruggle(metrics.isr, limits.successRate.struggle, true) ||
        isStruggle(metrics.aarl, limits.latencyMs.struggle, false)
      );

    case 'IQ':
      return !(
        isStruggle(metrics.ar, limits[metrics.testName].accuracy.struggle, true) ||
        isStruggle(metrics.art, limits[metrics.testName].responseTimeMs.struggle, false)
      );

    default:
      return true;
  }
};
