/**
 * Optional local identity discriminator.
 * Raw CCCD / phone values are never persisted by this module.
 * They are only transformed into a short local fingerprint so two records
 * with identical name + birth data can still be distinguished when needed.
 */
export const Identity={
  digits(v){return String(v||'').replace(/\D/g,'')},
  sourceLabel(cccd,phone){const c=!!this.digits(cccd),p=!!this.digits(phone);return c&&p?'CCCD + số điện thoại':c?'CCCD':p?'Số điện thoại':''},
  fallbackHash(text){
    let h1=0x811c9dc5,h2=0x9e3779b9;
    for(let i=0;i<text.length;i++){
      const c=text.charCodeAt(i);h1^=c;h1=Math.imul(h1,0x01000193);h2^=(c+i);h2=Math.imul(h2,0x85ebca6b);
    }
    return `${(h1>>>0).toString(16).padStart(8,'0')}${(h2>>>0).toString(16).padStart(8,'0')}`;
  },
  async fingerprint({cccd='',phone='',fullName='',birthDate=''}){
    const c=this.digits(cccd),p=this.digits(phone);if(!c&&!p)return '';
    const payload=`huyen-cac|${c}|${p}|${String(fullName).trim().toLowerCase()}|${birthDate}`;
    try{
      if(globalThis.crypto?.subtle&&globalThis.TextEncoder){
        const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload));
        return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,20);
      }
    }catch{}
    return this.fallbackHash(payload);
  }
};
