import React, { useEffect, useMemo, useState } from "react"
import { createRoot } from "react-dom/client"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Toaster, toast } from "sonner"
import {
  Backpack, BedDouble, BriefcaseBusiness, Car, Check,
  Droplets, Dumbbell, House, Info, KeyRound, Laptop, Minus, Moon, PackageCheck, Plus,
  RotateCcw, Search, Settings2, Sparkles, TrainFront, Trash2, X
} from "lucide-react"
import "./index.css"

const cn = (...inputs) => twMerge(clsx(inputs))
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{
  variants:{variant:{default:"bg-emerald-900 text-white hover:bg-emerald-800",outline:"border bg-white hover:bg-zinc-50",ghost:"hover:bg-zinc-100",secondary:"bg-zinc-100 text-zinc-900 hover:bg-zinc-200",destructive:"bg-red-600 text-white hover:bg-red-500"},size:{default:"h-10 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",icon:"size-9"}},defaultVariants:{variant:"default",size:"default"}
})
function Button({className,variant,size,...props}){return <button className={cn(buttonVariants({variant,size}),className)} {...props}/>}
function Card({className,...props}){return <div className={cn("rounded-xl border bg-white text-zinc-950 shadow-sm",className)} {...props}/>}
function Badge({className,variant="default",...props}){return <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold",variant==="secondary"&&"border-transparent bg-zinc-100 text-zinc-700",variant==="outline"&&"bg-white text-zinc-600",variant==="success"&&"border-transparent bg-emerald-100 text-emerald-800",className)} {...props}/>}
function Progress({value}){return <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-200"><div className="h-full bg-emerald-800 transition-all duration-500" style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div>}
function Separator({className}){return <div className={cn("h-px bg-zinc-200",className)}/>}
const Dialog=DialogPrimitive.Root,DialogTrigger=DialogPrimitive.Trigger
function DialogContent({children,className}){return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-sm"/><DialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 grid max-h-[90vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 gap-4 overflow-auto rounded-xl border bg-white p-6 shadow-2xl",className)}>{children}<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm p-1 text-zinc-500 hover:bg-zinc-100"><X className="size-4"/><span className="sr-only">Chiudi</span></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>}
function DialogTitle({className,...props}){return <DialogPrimitive.Title className={cn("font-display text-2xl font-semibold tracking-tight",className)} {...props}/>}
function DialogDescription({className,...props}){return <DialogPrimitive.Description className={cn("text-sm leading-relaxed text-zinc-500",className)} {...props}/>}

const ITEMS=[
{id:"documenti",room:"ingresso",name:"Documenti + patente",icon:"🪪",need:1,bag:"zaino",note:"Nello zaino, a portata di mano in stazione"},
{id:"chiavi-roma",room:"ingresso",name:"Chiavi di casa (Roma), fondamentali",icon:"🔑",need:1,bag:"zaino",note:"Aprono casa a Roma: vanno nello zaino"},
{id:"chiavi-hfarm",room:"ingresso",name:"Chiavi dell'appartamento H-FARM",icon:"🗝️",need:1,bag:"zaino",note:"Chiudi l'appartamento prima di uscire verso le 16:30"},
{id:"chiavi-auto",room:"ingresso",name:"Chiavi della macchina (resta parcheggiata a Quarto d'Altino)",icon:"🚗",need:1,bag:"zaino",note:"L'auto resta al parcheggio fino al 1/11"},
{id:"ombrello",room:"ingresso",name:"Ombrello compatto",icon:"☂️",need:1,bag:"zaino",note:"A portata di mano nei cambi a Mestre"},
{id:"regali",room:"ingresso",name:"Regali per Simo (laurea 31/10), Sarah (compleanno 31/10) e un amico (compleanno 1/11), se non li prende a Roma",icon:"🎁",need:1,bag:"valigia",note:"Lasciali fuori se li prendi a Roma",optional:true},
{id:"farmaci",room:"bagno",name:"Farmaci personali",icon:"💊",need:1,bag:"zaino",note:"Solo quelli personali, insieme ai documenti"},
{id:"asciugamano",room:"bagno",name:"Asciugamano piccolo",icon:"🧺",need:1,bag:"sportiva",note:"Per padel, corsa o yoga"},
{id:"mac",room:"studio",name:"MacBook + caricatore",icon:"💻",need:1,bag:"zaino",note:"Computer e alimentatore nello stesso scomparto"},
{id:"cuffie",room:"studio",name:"Cuffie",icon:"🎧",need:1,bag:"zaino",note:"Per il treno e per lavorare"},
{id:"iphone",room:"studio",name:"Caricatore iPhone + power bank",icon:"🔋",need:1,bag:"zaino",note:"Cavo, alimentatore e batteria esterna"},
{id:"watch",room:"studio",name:"Caricatore Apple Watch",icon:"⌚",need:1,bag:"zaino",note:"Facile da lasciare nel cassetto"},
{id:"microfono",room:"studio",name:"Microfono",icon:"🎙️",need:1,bag:"zaino",note:"Con il resto della tecnologia"},
{id:"look",room:"camera",name:"2 look eleganti (laurea di Simo 31/10 e un'altra occasione)",icon:"👔",need:2,bag:"valigia",note:"Uno per la laurea del 31/10, uno per l'altra occasione"},
{id:"giacca",room:"camera",name:"Giacca",icon:"🧥",need:1,bag:"valigia",note:"Sopra i look eleganti"},
{id:"pantaloni",room:"camera",name:"2 pantaloni eleganti",icon:"👖",need:2,bag:"valigia",note:"Un paio per ciascun look"},
{id:"camicia",room:"camera",name:"Camicia (da valutare)",icon:"👕",need:1,bag:"valigia",note:"Decidi se ti serve davvero",optional:true},
{id:"scarpe-eleganti",room:"camera",name:"Scarpe eleganti",icon:"👞",need:1,bag:"valigia",note:"Per la laurea e l'altra occasione"},
{id:"felpa-pesante",room:"cassettiera",name:"Felpa pesante (per la sera)",icon:"🧥",need:1,bag:"valigia",note:"Per le sere di fine ottobre"},
{id:"felpa-leggera",room:"cassettiera",name:"Felpa leggera",icon:"🧶",need:1,bag:"valigia",note:"Strato comodo di giorno"},
{id:"calze",room:"cassettiera",name:"Calze sportive",icon:"🧦",need:1,bag:"sportiva",note:"Per padel e corsa"},
{id:"cappellino",room:"cassettiera",name:"Cappellino",icon:"🧢",need:1,bag:"sportiva",note:"Per la corsa e il padel all'aperto"},
{id:"racchetta",room:"sport",name:"Racchetta da padel",icon:"🎾",need:1,bag:"separati",note:"Con la custodia, tra le cose da portare a parte"},
{id:"palline",room:"sport",name:"Palline da padel",icon:"🟡",need:1,bag:"sportiva",note:"Nella borsa sport"},
{id:"scarpe-padel",room:"sport",name:"Scarpe da padel",icon:"👟",need:1,bag:"sportiva",note:"Suola da campo, nella borsa sport"},
{id:"cambi",room:"sport",name:"Cambi tecnici (maglietta + pantaloncini)",icon:"🩳",need:1,bag:"sportiva",note:"Per padel e corsa"},
{id:"scarpe-running",room:"sport",name:"Scarpe da running",icon:"🏃",need:1,bag:"sportiva",note:"Nella borsa sport, con le scarpe da padel"},
{id:"tappetino",room:"sport",name:"Tappetino yoga",icon:"🧘",need:1,bag:"separati",note:"Arrotolato, da portare a parte"}
]
const ROOMS={
camera:{label:"Camera",sub:"Look eleganti",title:"Occasioni",icon:BedDouble,emoji:"🛏️",x:0,y:0,bg:"#f4d8cc",side:"#d8ae9d"},
cassettiera:{label:"Cassettiera",sub:"Felpe e calze",title:"Strati comodi",icon:Moon,emoji:"🧥",x:1,y:0,bg:"#e9def0",side:"#c8b5d4"},
bagno:{label:"Bagno",sub:"Farmaci",title:"Salute",icon:Droplets,emoji:"🛁",x:2,y:0,bg:"#cfe8e8",side:"#9ec4c4"},
studio:{label:"Studio",sub:"Tecnologia",title:"Tecnologia",icon:Laptop,emoji:"💻",x:0,y:1,bg:"#d8e2f4",side:"#a8badd"},
sport:{label:"Sport",sub:"Attrezzatura",title:"Padel, corsa e yoga",icon:Dumbbell,emoji:"🎾",x:1,y:1,bg:"#dfebcd",side:"#b6ca92"},
ingresso:{label:"Ingresso",sub:"Chiavi e auto",title:"Prima di uscire",icon:KeyRound,emoji:"🔑",x:2,y:1,bg:"#f1dfba",side:"#d3b676"}
}
const BAGS={
valigia:{label:"Valigia",name:"Valigia",meta:"Look, felpe e regali",icon:BriefcaseBusiness},
zaino:{label:"Zaino",name:"Zaino da viaggio",meta:"Chiavi, documenti e tecnologia",icon:Backpack},
sportiva:{label:"Borsa sport",name:"Borsa sport",meta:"Padel, corsa e ricambi",icon:Dumbbell},
separati:{label:"Separati",name:"Da portare a parte",meta:"Racchetta e tappetino",icon:PackageCheck}
}
const ROOM_TILES={camera:{cx:110,y:10},cassettiera:{cx:330,y:10},bagno:{cx:550,y:10},studio:{cx:110,y:185},sport:{cx:330,y:185},ingresso:{cx:550,y:185}}
const STORAGE="missione-valigia-roma-2026"

function HouseMap({room,onRoom}){return <div className="house-stage"><svg className="house-map" viewBox="0 0 660 350" role="group" aria-label="Mappa delle stanze">{Object.entries(ROOMS).map(([id,r])=>{const {cx,y}=ROOM_TILES[id],active=room===id;const floor=`${cx},${y} ${cx+90},${y+45} ${cx},${y+90} ${cx-90},${y+45}`,left=`${cx-90},${y+45} ${cx},${y+90} ${cx},${y+104} ${cx-90},${y+59}`,right=`${cx+90},${y+45} ${cx},${y+90} ${cx},${y+104} ${cx+90},${y+59}`;return <g key={id} className="iso-room" data-active={active} role="button" tabIndex="0" aria-label={`Vai in ${r.label}`} onClick={()=>onRoom(id)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onRoom(id)}}}><polygon className="iso-room-side" points={left} fill={r.side}/><polygon className="iso-room-side iso-room-side-right" points={right} fill={r.side}/><polygon className="iso-room-floor" points={floor} fill={r.bg}/><text className="iso-icon" x={cx} y={y+58} textAnchor="middle">{r.emoji}</text>{active&&<><circle className="iso-selected" cx={cx+61} cy={y+27} r="13"/><text className="iso-selected-check" x={cx+61} y={y+32} textAnchor="middle">✓</text></>}<rect className="iso-copy-bg" x={cx-78} y={y+112} width="156" height="44" rx="12"/><text className="iso-label" x={cx} y={y+131} textAnchor="middle">{r.label}</text><text className="iso-sub" x={cx} y={y+147} textAnchor="middle">{r.sub}</text></g>})}</svg></div>}

function Quantity({value,onMinus,onPlus}){return <div className="flex h-8 items-center overflow-hidden rounded-md border bg-white"><button className="grid h-full w-7 place-items-center hover:bg-zinc-100" onClick={onMinus} aria-label="Riduci quantità"><Minus className="size-3"/></button><strong className="min-w-8 text-center text-xs">{value}</strong><button className="grid h-full w-7 place-items-center hover:bg-zinc-100" onClick={onPlus} aria-label="Aumenta quantità"><Plus className="size-3"/></button></div>}

function TrainPanel(){
  return <section aria-label="Treni" className="border-b bg-emerald-950 text-white">
    <div className="mx-auto max-w-[1600px] px-4 py-4 lg:px-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-white/10"><TrainFront className="size-4" aria-hidden="true"/></span>
          <div>
            <p className="font-display text-2xl font-semibold leading-none tracking-tight">Treni</p>
            <p className="mt-1 text-xs text-emerald-100/80">H-FARM → Quarto d'Altino → Mestre → Roma Termini</p>
          </div>
        </div>
        <Badge className="border-white/15 bg-white/10 text-white">Orari del viaggio</Badge>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <article aria-label="Andata 23 ottobre" className="rounded-xl bg-white p-4 text-zinc-950 shadow-sm">
          <p className="font-display text-lg font-semibold text-emerald-950">Andata · 23/10</p>
          <ul className="mt-2 grid gap-1.5 text-sm leading-snug text-zinc-700">
            <li>Uscire da H-FARM verso le 16:30, auto fino a Quarto d'Altino e parcheggio.</li>
            <li><span className="font-semibold text-zinc-950">RV 3406</span> Quarto d'Altino 16:55 → Mestre 17:09.</li>
            <li><span className="font-semibold text-zinc-950">Piano B:</span> R 17046 17:16 → Mestre 17:38.</li>
            <li className="rounded-md bg-amber-50 px-3 py-2 text-amber-950">Evitare RV 3426 delle 17:55 (solo 8 minuti per il cambio).</li>
            <li><span className="font-semibold text-zinc-950">Italo 8927</span> Mestre 18:17 → Roma Termini 22:10, carrozza 3 posto 23.</li>
          </ul>
        </article>
        <article aria-label="Ritorno 1 novembre" className="rounded-xl bg-white p-4 text-zinc-950 shadow-sm">
          <p className="font-display text-lg font-semibold text-emerald-950">Ritorno · 1/11</p>
          <ul className="mt-2 grid gap-1.5 text-sm leading-snug text-zinc-700">
            <li><span className="font-semibold text-zinc-950">Italo 8916</span> Roma Termini 12:55 → Mestre 16:42, carrozza 2 posto 14 (Fast Track).</li>
            <li className="rounded-md bg-amber-50 px-3 py-2 text-amber-950"><span className="font-semibold">RV 3571</span> Mestre 16:51 → Quarto d'Altino 17:01 (solo 9 minuti: se l'Italo ritarda, piano B R 17055 17:22 → 17:40, poi circa ogni mezz'ora).</li>
            <li>Riprendere l'auto.</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
}

function App(){
  const [state,setState]=useState(()=>{try{return {...{room:"camera",bag:"valigia",packed:{}},...JSON.parse(localStorage.getItem(STORAGE)||"{}")}}catch{return {room:"camera",bag:"valigia",packed:{}}}})
  const [search,setSearch]=useState(""); const [missingOnly,setMissingOnly]=useState(false); const [drag,setDrag]=useState(false); const [reviewOpen,setReviewOpen]=useState(false)
  useEffect(()=>localStorage.setItem(STORAGE,JSON.stringify(state)),[state])
  const qty=id=>state.packed[id]?.qty||0
  const bagCount=id=>Object.values(state.packed).filter(x=>x.bag===id).reduce((sum,x)=>sum+x.qty,0)
  const roomItems=useMemo(()=>ITEMS.filter(i=>i.room===state.room&&(!missingOnly||qty(i.id)<i.need)&&(!search||`${i.name} ${i.note}`.toLowerCase().includes(search.toLowerCase()))),[state,missingOnly,search])
  const missing=ITEMS.filter(i=>!i.optional&&qty(i.id)<i.need)
  const required=ITEMS.filter(i=>!i.optional),total=required.reduce((s,i)=>s+i.need,0),have=required.reduce((s,i)=>s+Math.min(qty(i.id),i.need),0),progress=Math.round(have/total*100)
  const change=(id,delta,targetBag)=>{const item=ITEMS.find(i=>i.id===id);if(!item)return;setState(s=>{const old=s.packed[id]?.qty||0,next=Math.max(0,old+delta),packed={...s.packed};if(!next)delete packed[id];else packed[id]={qty:next,bag:targetBag||packed[id]?.bag||item.bag};return {...s,packed}});toast(delta>0?`${item.name} aggiunto`:`${item.name}: quantità aggiornata`,{icon:item.icon})}
  const reset=()=>{setState({room:"camera",bag:"valigia",packed:{}});toast("Bagagli svuotati")}
  const bagItems=ITEMS.filter(i=>state.packed[i.id]?.bag===state.bag),BagIcon=BAGS[state.bag].icon
  return <TooltipPrimitive.Provider delayDuration={250}>
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-emerald-900 text-white shadow-sm"><House className="size-4"/></div><div><p className="font-display text-base font-semibold leading-none">Missione Valigia</p><p className="mt-1 text-[10px] font-medium uppercase tracking-[.16em] text-zinc-500">Roma · 23/10–1/11 2026</p></div></div>
          <div className="hidden items-center gap-2 md:flex"><Badge variant="outline"><TrainFront className="mr-1 size-3"/>Treno</Badge><Badge variant="outline"><Moon className="mr-1 size-3"/>9 notti</Badge><Badge variant="outline"><Car className="mr-1 size-3"/>H-FARM → Roma</Badge></div>
          <Dialog><DialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Dettagli viaggio"><Info className="size-4"/></Button></DialogTrigger><DialogContent><Badge className="w-fit bg-emerald-900 text-white">Il piano di viaggio</Badge><DialogTitle>Roma · 23 ottobre–1 novembre</DialogTitle><DialogDescription>Rientri a casa a Roma da H-FARM, vicino a Venezia. Il 23/10 esci verso le 16:30, lasci l'auto a Quarto d'Altino e arrivi a Termini alle 22:10. Riparti il 1/11 alle 12:55. Il 31/10 ci sono la laurea di Simo e il compleanno di Sarah; il 1/11 il compleanno di un amico.</DialogDescription><Card className="flex gap-3 bg-zinc-50 p-4 shadow-none"><TrainFront className="mt-0.5 size-4 shrink-0 text-emerald-700"/><p className="text-sm"><b>Orari nel pannello Treni</b><br/><span className="text-zinc-500">Coincidenze, piani B e posti sono sotto la testata. Le chiavi di casa a Roma stanno nello zaino.</span></p></Card></DialogContent></Dialog>
        </div>
      </header>
      <TrainPanel/>

      <main className="mx-auto grid max-w-[1600px] gap-0 xl:grid-cols-[1.05fr_.9fr_.78fr]">
        <section className="border-b p-4 lg:p-6 xl:min-h-[calc(100vh-4rem)] xl:border-b-0 xl:border-r">
          <div className="mb-5 flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-emerald-800">Casa base</p><h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">Scegli una stanza</h1></div><Button variant="ghost" size="sm" onClick={reset}><RotateCcw className="size-3.5"/>Ricomincia</Button></div>
          <Card className="border-emerald-900/10 bg-emerald-950 p-4 text-white shadow-md"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-100"><Sparkles className="size-3.5"/>Rientro a Roma</div><Badge className="border-white/10 bg-white/10 text-white">{progress}% pronta</Badge></div><Progress value={progress}/><p className="mt-3 text-xs text-emerald-100/80">{progress===100?"Missione compiuta: puoi uscire da H-FARM verso Quarto d'Altino.":progress>70?"Ci siamo quasi. Ricontrolla chiavi, documenti e tecnologia.":progress>35?"Buon ritmo: ora i look del 31/10 e lo sport.":"Entra in una stanza e raccogli gli oggetti."}</p></Card>
          <HouseMap room={state.room} onRoom={room=>setState(s=>({...s,room}))}/>
          <div className="grid grid-cols-3 gap-2">{Object.entries(ROOMS).map(([id,r])=>{const Icon=r.icon;return <Button key={id} variant={state.room===id?"default":"outline"} size="sm" onClick={()=>setState(s=>({...s,room:id}))} className="h-auto justify-start px-3 py-2"><Icon className="size-3.5 shrink-0"/><span className="truncate">{r.label}</span></Button>})}</div>
        </section>

        <section className="border-b bg-white p-4 lg:p-6 xl:min-h-[calc(100vh-4rem)] xl:border-b-0 xl:border-r">
          <div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-emerald-800">{ROOMS[state.room].label}</p><h2 className="font-display mt-1 text-2xl font-semibold">{ROOMS[state.room].title}</h2></div><Badge variant="secondary">{ITEMS.filter(i=>i.room===state.room&&(i.optional||qty(i.id)>=i.need)).length} / {ITEMS.filter(i=>i.room===state.room).length}</Badge></div>
          <div className="mb-4 flex gap-2"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"/><input className="h-10 w-full rounded-md border bg-white pl-9 pr-3 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-emerald-800" placeholder="Cerca oggetto…" value={search} onChange={e=>setSearch(e.target.value)}/></label><Button variant={missingOnly?"default":"outline"} onClick={()=>setMissingOnly(v=>!v)}><Settings2 className="size-4"/><span className="hidden sm:inline">Solo mancanti</span></Button></div>
          <div className="scroll-soft flex max-h-[calc(100vh-13rem)] flex-col gap-2 overflow-auto pr-1">{roomItems.map(i=>{const q=qty(i.id),done=q>=i.need;return <Card key={i.id} draggable onDragStart={e=>{e.dataTransfer.setData("text/plain",i.id)}} className={cn("grid grid-cols-[44px_1fr_auto] items-center gap-3 p-3 transition hover:border-zinc-300 hover:shadow-md",done&&"border-emerald-200 bg-emerald-50/50",i.optional&&"border-dashed")}><div className="grid size-11 place-items-center rounded-lg bg-zinc-100 text-2xl">{i.icon}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><b className="text-sm leading-snug">{i.name}</b>{i.optional&&<Badge variant="outline">Opz.</Badge>}</div><p className="mt-1 text-xs leading-relaxed text-zinc-500">{i.note} · obiettivo {i.need}</p></div>{q?<Quantity value={`${q}/${i.need}`} onMinus={()=>change(i.id,-1)} onPlus={()=>change(i.id,1)}/>:<Button size="sm" onClick={()=>change(i.id,1)}><Plus className="size-3"/>Metti via</Button>}</Card>})}{!roomItems.length&&<div className="grid place-items-center rounded-xl border border-dashed py-16 text-center"><Check className="mb-3 size-7 text-emerald-700"/><p className="text-sm font-medium">Tutto sistemato qui</p><p className="mt-1 text-xs text-zinc-500">Scegli un’altra stanza.</p></div>}</div>
        </section>

        <aside className="bg-zinc-50 p-4 lg:p-6 xl:min-h-[calc(100vh-4rem)]">
          <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[.15em] text-emerald-800">Equipaggiamento</p><h2 className="font-display mt-1 text-2xl font-semibold">I tuoi bagagli</h2></div>
          <TabsPrimitive.Root value={state.bag} onValueChange={bag=>setState(s=>({...s,bag}))}>
            <TabsPrimitive.List aria-label="Scegli un bagaglio" className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1 md:grid-cols-4 xl:grid-cols-2">{Object.entries(BAGS).map(([id,b])=>{const Icon=b.icon,count=bagCount(id);return <TabsPrimitive.Trigger key={id} value={id} aria-label={`${b.label}: ${count} ${count===1?"oggetto":"oggetti"}`} className="group flex min-h-14 items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-left text-zinc-500 transition data-[state=active]:border-zinc-200 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm"><span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/70 ring-1 ring-zinc-200/70 group-data-[state=active]:bg-emerald-950 group-data-[state=active]:text-white"><Icon className="size-4"/></span><span className="min-w-0"><span className="block text-xs font-semibold leading-tight">{b.label}</span><span className="mt-0.5 block text-[10px] leading-none text-zinc-500">{count} {count===1?"oggetto":"oggetti"}</span></span></TabsPrimitive.Trigger>})}</TabsPrimitive.List>
          </TabsPrimitive.Root>
          <Card className={cn("mt-4 grid place-items-center border-dashed bg-white p-6 text-center shadow-none transition",drag&&"drop-active")} onDragEnter={e=>{e.preventDefault();setDrag(true)}} onDragOver={e=>e.preventDefault()} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);change(e.dataTransfer.getData("text/plain"),1,state.bag)}}><div className="grid size-16 place-items-center rounded-2xl bg-emerald-950 text-white shadow-lg"><BagIcon className="size-7"/></div><h3 className="mt-4 font-display text-lg font-semibold">{BAGS[state.bag].name}</h3><p className="mt-1 text-xs text-zinc-500">{BAGS[state.bag].meta}</p><Badge variant="secondary" className="mt-3">Trascina qui gli oggetti</Badge></Card>
          <div className="scroll-soft my-4 flex max-h-56 min-h-20 flex-col gap-2 overflow-auto">{bagItems.length?bagItems.map(i=><div key={i.id} className="flex items-center gap-3 rounded-lg border bg-white p-2.5"><span className="text-lg">{i.icon}</span><div className="min-w-0 flex-1"><p className="text-xs font-medium leading-snug">{i.name}</p><p className="text-[10px] text-zinc-500">Quantità {qty(i.id)}</p></div><Button variant="ghost" size="icon" className="size-7 shrink-0 text-zinc-400 hover:text-red-600" onClick={()=>change(i.id,-qty(i.id))}><Trash2 className="size-3.5"/></Button></div>):<div className="grid place-items-center rounded-lg border border-dashed py-7 text-xs text-zinc-400">Questo bagaglio è vuoto</div>}</div>
          <Dialog open={reviewOpen} onOpenChange={setReviewOpen}><DialogTrigger asChild><Button className="w-full"><PackageCheck className="size-4"/>Controlla i mancanti</Button></DialogTrigger><DialogContent>{missing.length?<><Badge className="w-fit bg-amber-100 text-amber-900">Controllo partenza</Badge><DialogTitle>Mancano {missing.length} categorie</DialogTitle><DialogDescription>La casa le ha già raggruppate stanza per stanza.</DialogDescription><div className="grid gap-2 sm:grid-cols-2">{Object.entries(ROOMS).map(([id,r])=>{const items=missing.filter(i=>i.room===id);return items.length?<Card key={id} className="p-3 shadow-none"><p className="mb-2 text-xs font-semibold">{r.label}</p>{items.map(i=><button key={i.id} className="flex w-full items-start justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-zinc-100" onClick={()=>{setState(s=>({...s,room:id}));setReviewOpen(false)}}><span className="min-w-0 leading-snug">{i.icon} {i.name}</span><span className="shrink-0 text-zinc-400">−{i.need-qty(i.id)}</span></button>)}</Card>:null})}</div></>:<div className="text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100"><Check className="size-8 text-emerald-800"/></div><DialogTitle className="mt-4">Roma, si parte!</DialogTitle><DialogDescription className="mt-2">Documenti, chiavi, look e sport sono a posto. L'auto ti aspetta al parcheggio di Quarto d'Altino.</DialogDescription></div>}</DialogContent></Dialog>
          <Card className="mt-4 flex items-start gap-3 bg-zinc-100 p-3 shadow-none"><Info className="mt-0.5 size-4 shrink-0 text-zinc-500"/><p className="text-xs leading-relaxed"><b>Auto a Quarto d'Altino</b><br/><span className="text-zinc-500">Resta parcheggiata dal 23/10. Al ritorno la riprendi dopo il treno per Quarto d'Altino.</span></p></Card>
        </aside>
      </main>
      <Toaster position="bottom-center" richColors closeButton/>
    </div>
  </TooltipPrimitive.Provider>
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>)
