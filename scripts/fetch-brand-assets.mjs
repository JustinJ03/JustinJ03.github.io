import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const brands = [
['java','https://www.java.com/'],['python','https://www.python.org/'],['cpp','https://isocpp.org/'],['javascript','https://developer.mozilla.org/en-US/docs/Web/JavaScript'],['typescript','https://www.typescriptlang.org/'],['dart','https://dart.dev/'],['php','https://www.php.net/'],['laravel','https://laravel.com/'],['nextjs','https://nextjs.org/'],['flutter','https://flutter.dev/'],['bootstrap','https://getbootstrap.com/'],['tailwind','https://tailwindcss.com/'],['nativewind','https://www.nativewind.dev/'],['jquery','https://jquery.com/'],['mysql','https://www.mysql.com/'],['sqlite','https://www.sqlite.org/'],['git','https://git-scm.com/'],['github','https://github.com/'],['docker','https://www.docker.com/'],['laragon','https://laragon.org/'],['xampp','https://www.apachefriends.org/'],['nginx','https://nginx.org/'],['postgresql','https://www.postgresql.org/'],['supabase','https://supabase.com/'],['riverpod','https://riverpod.dev/'],['react-native','https://reactnative.dev/'],['shelf','https://pub.dev/packages/shelf'],['serverpod','https://serverpod.dev/'],['gemini','https://ai.google.dev/'],['whatsapp','https://developers.facebook.com/docs/whatsapp/cloud-api/'],['astro','https://astro.build/'],['linkedin','https://www.linkedin.com/in/justin-joel-925819247'],['github-profile','https://github.com/JustinJ03']
];
const output=[];
const verification = JSON.parse(await readFile('docs/asset-verification.json', 'utf8'));
const checkedOn = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' });
if (!process.argv.includes('--download')) {
for (let start=0;start<brands.length;start+=8) {
 await Promise.all(brands.slice(start,start+8).map(async ([id,url])=>{
  try {
   const r=await fetch(url,{signal:AbortSignal.timeout(25000)}); await r.arrayBuffer();
   output.push({id,url,status:r.status,finalUrl:r.url});
   console.log(id,r.status);
  }catch(e){ output.push({id,url,error:e.message}); console.log(id,e.message); }
 }));
}
await mkdir('docs',{recursive:true});
await writeFile('docs/asset-verification.json',JSON.stringify({...verification, checkedOn, destinations:output},null,2));
} else {
 const assets = [
 ['java','https://www.oracle.com/a/ocom/img/obic-java-cup.svg','Oracle; official Java coffee-cup logo'],
 ['javascript','https://raw.githubusercontent.com/voodootikigod/logo.js/master/js.svg','Christopher Williams and Manuel Strehl; MIT; community JavaScript logo'],
 ['python','https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/community/logos/python-logo-only.png','Python Software Foundation; https://www.python.org/community/logos/'],
 ['cpp','https://isocpp.org/assets/images/cpp_logo.png','Standard C++ Foundation'],
 ['typescript','https://www.typescriptlang.org/icons/icon-144x144.png','Microsoft; https://www.typescriptlang.org/branding/'],
 ['dart','https://dart.dev/assets/img/logo/dart-192.svg','Google; https://dart.dev/brand'],
 ['php','https://www.php.net/images/logos/php-logo-white.svg','PHP project; https://www.php.net/download-logos.php'],
 ['laravel','https://raw.githubusercontent.com/laravel/art/master/laravel-logo.svg','Laravel; official laravel/art repository'],
 ['nextjs','https://nextjs.org/_next/static/immutable/media/logo-next-dark.0jqrwuxq05oly.svg','Vercel; official site dark-background variant'],
 ['flutter','https://flutter.dev/assets/favicon.26abda3864324ef4ac32dd0d3ce28907.png','Google; https://flutter.dev/brand'],
 ['bootstrap','https://getbootstrap.com/docs/6.0/assets/brand/bootstrap-logo.svg','Bootstrap team; https://getbootstrap.com/docs/5.3/about/brand/'],
 ['tailwind','https://tailwindcss.com/favicons/apple-touch-icon.png?v=4','Tailwind Labs; official site icon'],
 ['nativewind','https://www.nativewind.dev/favicon.svg','NativeWind project; official site icon'],
 ['jquery','https://brand.jquery.org/resources/jquery-mark-light.gif','OpenJS Foundation; https://brand.jquery.org/logos/'],
 ['mysql','https://www.mysql.com/common/logos/logo-mysql-170x115.png','Oracle; https://www.mysql.com/about/legal/logos.html'],
 ['sqlite','https://www.sqlite.org/images/sqlite370_banner.svg','SQLite authors; official site wordmark'],
 ['git','https://git-scm.com/images/logos/downloads/Git-Icon-1788C.svg','Jason Long; CC BY 3.0 https://git-scm.com/downloads/logos'],
 ['github','https://github.githubassets.com/favicons/favicon-dark.svg','GitHub, Inc.; https://brand.github.com/foundations/logo'],
 ['docker','https://www.docker.com/app/uploads/2024/02/cropped-docker-logo-favicon-192x192.png','Docker, Inc.; official site icon'],
 ['laragon','https://laragon.org/logo.svg','Laragon; official site logo'],
 ['xampp','https://www.apachefriends.org/images/xampp-logo-ac950edf.svg','Apache Friends; official site logo'],
 ['nginx','https://nginx.org/img/nginx_logo_dark.svg','F5; official site dark-background variant'],
 ['postgresql','https://www.postgresql.org/media/img/about/press/elephant.png','PostgreSQL Global Development Group; https://www.postgresql.org/about/press/'],
 ['riverpod','https://riverpod.dev/img/logo.svg','Riverpod project; official site logo'],
 ['react-native','https://reactnative.dev/img/header_logo.svg','Meta; official React Native site logo'],
 ['serverpod','https://serverpod.dev/icons/favicon/apple-touch-icon@21194cf381907d0c7d24ab39e9b1daca585ca1f2.png','Serverpod; official site icon'],
 ['astro','https://astro.build/favicon.svg','Astro; official site icon'],
 ['linkedin','https://static.licdn.com/scds/common/u/images/logos/linkedin/logo-in-win8-tile-144_v1.png','LinkedIn; official brand site tile https://brand.linkedin.com/']
 ];
 const downloaded=verification.assets?.filter(a=>a.filename) ?? [];
 await mkdir('public/icons/brands',{recursive:true});
 for(let start=0;start<assets.length;start+=8) await Promise.all(assets.slice(start,start+8).map(async([id,url,attribution])=>{
  try {
   const response=await fetch(url,{signal:AbortSignal.timeout(25000)});
   if(!response.ok) throw new Error(`HTTP ${response.status}`);
   const data=Buffer.from(await response.arrayBuffer());
   const extension=new URL(url).pathname.split('.').pop();
   if(extension==='svg' && (!data.toString().includes('<svg') || /<script\b|<foreignObject\b/i.test(data.toString()))) throw new Error('Unsafe or invalid SVG');
   if(extension==='png' && data.readUInt32BE(0)!==0x89504e47) throw new Error('Invalid PNG');
   const filename=`${id}.${extension}`;
   await writeFile(`public/icons/brands/${filename}`,data);
   const existing=downloaded.findIndex(a=>a.id===id); if(existing>=0) downloaded.splice(existing,1);
   downloaded.push({id,filename,source:url,attribution,sha256:createHash('sha256').update(data).digest('hex')});
   console.log(id,filename,data.length);
  }catch(e){console.error(id,e.message);process.exitCode=1;}
 }));
 verification.assets=downloaded.sort((a,b)=>a.id.localeCompare(b.id));
 await writeFile('docs/asset-verification.json',JSON.stringify(verification,null,2));
 // Supabase's icon is distributed inside https://supabase.com/brand-assets.zip;
 // extract only brand-assets/supabase-logo-icon.svg as public/icons/brands/supabase.svg.
}
