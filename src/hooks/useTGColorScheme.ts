// import { TGColorSchemeCtx } from "@/components/Context";
// import { useContext, useEffect, useState } from "react";

import { useEffect } from "react";

export interface Theme {
    bg:string,
    text:string,
    text_hint:string,
    text_link:string,
    bg_button:string,
    text_button:string,
    /* //BOT API 6.1+
    bg_secondary:string,
    //BOT API 7.0+
    bg_header:string,
    text_accent:string,
    bg_section:string,
    text_header:string,
    text_subtitle:string,
    text_destructive:string, */
}

export default function useTGColorScheme():Theme {
    // const theme = useContext(TGColorSchemeCtx);
    useEffect(()=>{
        document.styleSheets.item(0)!.insertRule(`.bg-tg { background-color: var(--tg-theme-bg-color) }`,0);
        document.styleSheets.item(0)!.insertRule(`.text-tg { color: var(--tg-theme-text-color) }`,0);
        document.styleSheets.item(0)!.insertRule(`.text-tg-hint { color: var(--tg-theme-hint-color) }`,0);
        document.styleSheets.item(0)!.insertRule(`.text-tg-link { color: var(--tg-theme-link-color) }`,0);
        document.styleSheets.item(0)!.insertRule(`.bg-tg-button { background-color: var(--tg-theme-button-color) }`,0);
        document.styleSheets.item(0)!.insertRule(`.text-tg-button { color: var(--tg-theme-button-text-color) }`,0);
    },[])
    return {
        bg:'bg-tg',
        text:'text-tg',
        text_hint:'text-tg-hint',
        text_link:'text-tg-link',
        bg_button:'bg-tg-button',
        text_button:'text-tg-button',
    }
}