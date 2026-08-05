const Jimp = require('jimp');
(async () => {
  const img = await Jimp.read('sitegen-new.png');
  img.scan(0,0,img.bitmap.width,img.bitmap.height,function(x,y,idx){
    const r=this.bitmap.data[idx],g=this.bitmap.data[idx+1],b=this.bitmap.data[idx+2];
    const maxc=Math.max(r,g,b);
    const thr=95, feather=70;
    if(maxc<=thr) this.bitmap.data[idx+3]=0;
    else if(maxc<thr+feather) this.bitmap.data[idx+3]=Math.round(((maxc-thr)/feather)*255);
  });
  img.autocrop({tolerance:0.001, cropOnlyFrames:false});
  await img.writeAsync('sitegen-t.png');
  console.log('done', img.bitmap.width+'x'+img.bitmap.height);
})();
