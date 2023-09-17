export const limitParser = (limit: string | number): number => {
  if (typeof limit !== "string") {
    return limit;
  }

  const units = "bkmgt";
  const regex = /^(\d+(?:\.\d+)?) *(kb|mb|gb|tb)$/i;
  const match = regex.exec(limit);

  if (!match) {
    throw new Error(`Invalid limit value: ${limit}`);
  }

  const n = parseFloat(match[1]);
  const unit = match[2];

  const i = units.indexOf(unit.toLowerCase());
  const factor = Math.pow(1024, i + 1);

  return n * factor;
};
