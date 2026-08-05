const Jimp = require('jimp');

// Remove near-black background: pixels whose max RGB channel is below `thr`
// become transparent; a feather band above it fades alpha for soft edges.
async function process(inFile, outFile, thr, feather) {
  const img = await Jimp.read(inFile);
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const maxc = Math.max(r, g, b);
    if (maxc <= thr) {
      this.bitmap.data[idx + 3] = 0;
    } else if (maxc < thr + feather) {
      this.bitmap.data[idx + 3] = Math.round(((maxc - thr) / feather) * 255);
    }
  });
  img.autocrop({ tolerance: 0.0002, cropOnlyFrames: false });
  await img.writeAsync(outFile);
  console.log('wrote', outFile, img.bitmap.width + 'x' + img.bitmap.height);
}

(async () => {
  await process('portfolio.png', 'portfolio-t.png', 55, 25);
  await process('sitegen-new.png', 'sitegen-t.png', 45, 30);
})();
