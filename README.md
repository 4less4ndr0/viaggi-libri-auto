# Missione Valigia — Roma 23/10–1/11 2026

Mini web app interattiva in italiano per preparare i bagagli del rientro a Roma da H-FARM, come in un gestionale isometrico.

## Demo

[Apri il gioco](https://missione-valigia-rimini.dim4.chatgpt.site)

## Stack

- React 19 + Vite
- Tailwind CSS
- Componenti open-code in stile shadcn/ui
- Radix UI per dialoghi e tab
- CVA, Lucide React e Sonner

## Funzioni

- Sei stanze esplorabili
- Valigia, zaino, borsa sport e attrezzatura separata
- Quantità, drag-and-drop e controllo automatico dei mancanti
- Pannello treni per l'andata del 23/10 e il ritorno del 1/11
- Persistenza locale tra sessioni
- Interfaccia responsive e accessibile

## Sviluppo

```bash
pnpm install
pnpm dev
```

Build di produzione:

```bash
pnpm build
```
