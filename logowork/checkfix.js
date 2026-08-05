const Jimp=require('jimp');
(async()=>{
  const img=await Jimp.read('sitegen-fav.png');
  const c=Jimp.intToRGBA(img.getPixelColor(2,2));
  console.log('corner pixel',c);
  if(c.a>200 && c.r>230 && c.g>230 && c.b>230){
    // white background -> key out white
    img.scan(0,0,img.bitmap.width,img.bitmap.height,function(x,y,idx){
      const r=this.bitmap.data[idx],g=this.bitmap.data[idx+1],b=this.bitmap.data[idx+2];
      const minc=Math.min(r,g,b);
      if(minc>=240) this.bitmap.data[idx+3]=0;
      else if(minc>210) this.bitmap.data[idx+3]=Math.round((240-minc)/30*255);
    });
    console.log('keyed white');
  }
  img.autocrop({tolerance:0.002,cropOnlyFrames:false});
  await img.writeAsync('sitegen-t.png');
  console.log('final',img.bitmap.width+'x'+img.bitmap.height);
})();
