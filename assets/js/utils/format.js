export const Format={
  vn(date,opts={weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'}){return new Intl.DateTimeFormat('vi-VN',opts).format(date)},
  iso(date){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');return `${y}-${m}-${d}`},
  addDays(date,n){const x=new Date(date);x.setDate(x.getDate()+n);return x}
};

/* =========================================================
   APP STATE — central immutable-ish store
   ========================================================= */
