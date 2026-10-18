  const testimonials = [
     {
      name: "z [WASM]",
      role: "Owner of Zodiac",
      msg: " “It is bad so it is good” ",
      pfp: "z.png"
    },
      {
      name: "ace [wasm]",
      role: "Owner of Helium",
      msg: " “niche is one of the greatest ubg sites i've ever seen.” ",
      pfp: "ace.png"
    },
     {
      name: "hvtrs",
      role: "Owner of Cherri & Breeze",
      msg: " “let's keep niche niche” ",
      pfp: "x8r.png"
    },
      {
      name: "midnight",
      role: "Owner of Nocturne",
      msg: " “im a gooner” ",
      pfp: "midnight.png"
    },
    {
      name: "Fig 🍓",
      role: "Owner of Figure",
      msg: " “World Cup everybody jump” ",
      pfp: "fig.png"
    },
    {
      name: "1y9r",
      role: "Owner of Novene",
      msg: " “aarush kamat cody impressed” ",
      pfp: "1y9r.png"
    },
      {
      name: "sols",
      role: "Owner of Chill zone",
      msg: "sols.png"
    },
    {
      name: "JustAOrange",
      role: "Owner of Nexora",
      msg: " “stay niche” ",
      pfp: "orange.png"
    },
    {
      name: "duderucool",
      role: "Owner of Flux",
      msg: " “niche looks like a niche site but good” ",
      pfp: "dudercool.png"
    },
     {
      name: "Mr Coffee",
      role: "Owner of Vanta",
      msg: " “I love niche because it is owned by my king ” ",
      pfp: "mrcoffee.png"
    },
     {
      name: "Zaka",
      role: "Owner of Zaka",
      msg: " “niche gonna be better then t9 os frfr” ",
      pfp: "zaka.png"
    },
     {
      name: "choose a name alr",
      role: "Owner of Abstract",
      msg: " “no” ",
      pfp: "abstract.webp"
    },
    {
      name: "ODXD",
      role: "The plug",
      msg: " “Best site in the world no glaze” ",
      pfp: "odxd.png"
    },

     {
      name: "DotLYHiyou",
      role: "Owner of DotGUI & close friend",
      msg: " “T9 is the goat and my bestie” ",
      pfp: "c00l.png"
    },
    
 
  ];
 
  function makeCard(t) {
    let pfpHTML = '';
    if (t.pfp) {
      pfpHTML = `<img src="${t.pfp}" class="w-11.3 h-10 rounded-full object-cover flex-shrink-0" alt="${t.name}">`;
    } else {
      pfpHTML = `<div class="w-12 h-10 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center text-sm font-bold text-blue-800">${t.name[0].toUpperCase()}</div>`;
    }
 
    return `
      <div class="mx-auto w-64 mt-3 rounded-2xl bg-blue-300 border-2 border-blue-400 flex gap-3 p-3 items-center justify-center flex-shrink-0">
        ${pfpHTML}
        <div class="flex flex-col min-w-0">
          <span class="text-xs font-semibold text-blue-900 truncate">${t.name}${t.role ? ' · ' + t.role : ''}</span>
          <span class="text-center text-sm text-blue-950">${t.msg}</span>
        </div>
      </div>
    `;
  }
 
  const track = document.getElementById('track');
  const all = [...testimonials, ...testimonials];
  track.innerHTML = all.map(makeCard).join('');
