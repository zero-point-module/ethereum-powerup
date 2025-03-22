import type { Item } from "@/types"

// Default items for the TV interface
export const DEFAULT_ITEMS: Item[] = [
  {
    id: 1,
    title: "Social Recovery",
    description: "Restore access to your vault using trusted contacts.",
  },
  {
    id: 2,
    title: "System Diagnostics",
    description: "Run a full system check on all components.",
  },
  {
    id: 3,
    title: "Radio Transmitter",
    description: "Broadcast emergency signals to nearby stations.",
  },
  {
    id: 4,
    title: "Inventory Manager",
    description: "Check and organize your collected items.",
  },
]

// Characters for the scramble effect
export const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?`~"

// Default terminal content
export const DEFAULT_TERMINAL_CONTENT = `
ROBCO INDUSTRIES (TM) TERMINAL PROTOCOL
*** WARNING: LOCKOUT IMMINENT ***

1 ATTEMPT(S) LEFT: █

0xF964 <{-<{>$$,}' 0xFA39 ?//'TERMS('<
0xF970 $:_:',,*PIE 0xFA3C '**)>:[^.#>
0xF97C $$>*_"[<JOIN 0xFA48 __>']\.!-%+
0xF988 $._:)'-._$T 0xFA54 $'\_[#)'}[$
0xF994 IRES"_/'-:/ 0xFA60 [\.#@.<[':/#
0xF9A0 [<_?'>{{%[ 0xFA6C THIRD_[[*>.$
0xF9AC *#"<.'$TICK 0xFA78 <[[].<@@-={ >PRICE
0xF9B8 :'.':$@#\]$ 0xFA84 ).-FRIES:'._# >Entry denied
0xF9C4 '<{::?'*{/@. 0xFA90 ?+[))<[..PRI >0/5 correct.
0xF9D0 \+[?[>*<"'X 0xFA9C CE?+//@$-[:$ >TEXAS
0xF9DC +@*:>TRIED%: 0xFAA8 {.,.>[[{:.+-) >Entry denied
0xF9E8 ]#\'%<"'):@= 0xFAB4 #'"<.<@\>TRI >2/5 correct.
0xF9F4 %(>)_:#@>:}{ 0xFAC0 ES}[.</'>TRIT >TIRES
0xFA00 +?.**\>']-^ 0xFACC E[[TANKS:#" >Entry denied
0xFA0C %<'*_'<\>/[@} 0xFAD8 <THICK:]TRIB >2/5 correct.
0xFA18 SKIES[%}>'.- 0xFAE4 E^>}.,<'~'/T
0xFA24 :%->|%^'(%[" 0xFAF0 EXAS/':[[--'] >TERMS
`.trim()

// Local storage keys
export const STORAGE_KEYS = {
  INSTALLED_MODULES: "installedModules",
}

