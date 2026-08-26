// Maps common axe-core "wcagXXX" tags to their WCAG 2.1 success-criterion
// number. Axe includes richer mapping internally (via help URLs), but this
// covers everything our checks realistically surface. Unknown tags pass
// through unchanged rather than being dropped.
const MAP = {
  wcag111: '1.1.1', wcag121: '1.2.1', wcag122: '1.2.2', wcag123: '1.2.3',
  wcag131: '1.3.1', wcag132: '1.3.2', wcag133: '1.3.3', wcag134: '1.3.4', wcag135: '1.3.5',
  wcag141: '1.4.1', wcag142: '1.4.2', wcag143: '1.4.3', wcag144: '1.4.4',
  wcag145: '1.4.5', wcag1410: '1.4.10', wcag1411: '1.4.11', wcag1412: '1.4.12', wcag1413: '1.4.13',
  wcag211: '2.1.1', wcag212: '2.1.2', wcag214: '2.1.4',
  wcag221: '2.2.1', wcag222: '2.2.2',
  wcag231: '2.3.1', wcag233: '2.3.3',
  wcag241: '2.4.1', wcag242: '2.4.2', wcag243: '2.4.3', wcag244: '2.4.4',
  wcag245: '2.4.5', wcag246: '2.4.6', wcag247: '2.4.7', wcag2411: '2.4.11',
  wcag251: '2.5.1', wcag253: '2.5.3', wcag255: '2.5.5',
  wcag311: '3.1.1', wcag312: '3.1.2',
  wcag321: '3.2.1', wcag322: '3.2.2', wcag323: '3.2.3', wcag324: '3.2.4',
  wcag331: '3.3.1', wcag332: '3.3.2', wcag333: '3.3.3', wcag334: '3.3.4',
  wcag411: '4.1.1', wcag412: '4.1.2', wcag413: '4.1.3'
};

function tagsToWcagSC(tags) {
  const scs = new Set();
  for (const t of tags || []) {
    if (MAP[t]) scs.add(MAP[t]);
  }
  return [...scs].sort().join(', ') || (tags || []).filter((t) => t.startsWith('wcag')).join(', ');
}

module.exports = { tagsToWcagSC };
