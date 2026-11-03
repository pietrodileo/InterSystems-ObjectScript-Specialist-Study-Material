# Imparare dagli esercizi

[Indice generale](index.md) · [Schemi della teoria](visual-index.md)

**22 capitoli, 358 analisi individuali delle domande e 66 percorsi tematici. Le immagini degli esercizi sono in inglese e spiegano passaggi, motivazioni ed errori comuni.** I commenti didattici sono in italiano; testo originale dei quiz e immagini sono in inglese. Identificatori e codice mantengono la sintassi ObjectScript.

Ogni capitolo contiene `Approfondimenti esercizi/`, con la sottocartella `Domanda per domanda/`: una scheda per ogni domanda, non più soltanto tre approfondimenti per quiz. Ogni scheda offre un commento specifico, uno spunto ulteriore e una variante con soluzione a scomparsa, oltre al testo e alla spiegazione originali per confronto. Le due tavole del capitolo raggruppano i concetti con esempi e spiegazioni visive; la guida ai pannelli indica le domande collegate.

| Capitolo | Cartella | Percorsi tematici | Analisi individuali |
| --- | --- | --- | --- |
| T1.1 | [Uses Classes](<T1 - Manages Data Model/T1.1: Uses Classes/Approfondimenti esercizi/README.md>) | 3 | 18 |
| T1.2 | [Creates Properties and Indexes](<T1 - Manages Data Model/T1.2: Creates Properties and Indexes/Approfondimenti esercizi/README.md>) | 3 | 18 |
| T1.3 | [Creates ObjectScript Methods](<T1 - Manages Data Model/T1.3: Creates ObjectScript Methods/Approfondimenti esercizi/README.md>) | 3 | 18 |
| T1.4 | [Uses Complex Structures](<T1 - Manages Data Model/T1.4: Uses Complex Structures/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T2.1 | [Ensures Data Integrity](<T2 - Basic Programming/T2.1: Ensures Data Integrity/Approfondimenti esercizi/README.md>) | 3 | 18 |
| T2.2 | [Tracks Application Data](<T2 - Basic Programming/T2.2: Tracks Application Data/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T2.3 | [Implements Security Features](<T2 - Basic Programming/T2.3: Implements Security Features/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T3.1 | [Differentiates Storage Media](<T3 - IRIS Features/T3.1: Differentiates Storage Media/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T3.2 | [Leverages ObjectScript/SQL Features](<T3 - IRIS Features/T3.2: Leverages ObjectScript - SQL Features/Approfondimenti esercizi/README.md>) | 3 | 17 |
| T3.3 | [Handles Nulls](<T3 - IRIS Features/T3.3: Handles Nulls/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T3.4 | [Handles Schema Evolution](<T3 - IRIS Features/T3.4: Handles Schema Evolution/Approfondimenti esercizi/README.md>) | 3 | 17 |
| T3.5 | [Ensures Scalability and Performance](<T3 - IRIS Features/T3.5: Ensures Scalability and Performance/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T4.1 | [Traverses and Sorts Arrays](<T4 - Functions & APIs/T4.1: Traverses and Sorts Arrays/Approfondimenti esercizi/README.md>) | 3 | 18 |
| T4.2 | [Manipulates Lists](<T4 - Functions & APIs/T4.2: Manipulates Lists/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T4.3 | [Manipulates Strings](<T4 - Functions & APIs/T4.3: Manipulates Strings/Approfondimenti esercizi/README.md>) | 3 | 18 |
| T4.4 | [Mathematical, Logical, and Date/Time Operations](<T4 - Functions & APIs/T4.4: Mathematical, Logical, and Date - Time Operations/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T4.5 | [Decision and Control Structures](<T4 - Functions & APIs/T4.5: Decision and Control Structures/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T4.6 | [Executes Methods and Queries Objects](<T4 - Functions & APIs/T4.6: Executes Methods and Queries Objects/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T4.7 | [Uses APIs for Common Operations](<T4 - Functions & APIs/T4.7: Uses APIs for Common Operations/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T5.1 | [Uses Troubleshooting Tools](<T5 - Error Handling/T5.1: Uses Troubleshooting Tools/Approfondimenti esercizi/README.md>) | 3 | 15 |
| T5.2 | [Handles and Logs Runtime Errors](<T5 - Error Handling/T5.2: Handles and Logs Runtime Errors/Approfondimenti esercizi/README.md>) | 3 | 18 |
| T5.3 | [Diagnoses Common Errors](<T5 - Error Handling/T5.3: Diagnoses Common Errors/Approfondimenti esercizi/README.md>) | 3 | 18 |

## Metodo e limiti

Gli approfondimenti sono rielaborazioni didattiche basate sui quiz già salvati nel progetto. Ai 66 percorsi trasversali si aggiungono 358 schede con commenti individuali. Le risposte della fonte restano riconoscibili e consultabili; non sono confuse con il nuovo ragionamento didattico.

Le cartelle dei capitoli segnalano le imprecisioni rilevate e riportano documentazione ufficiale. I testi sorgente restano identificabili; dove una risposta dipende da configurazione o versione, il nuovo approfondimento esplicita quella dipendenza. Gli esempi non sono stati eseguiti in un’istanza IRIS. Non è una revisione completa di ogni risposta della fonte.

I nuovi schemi rappresentano esempi concreti e transizioni di stato; i dettagli normativi rimangono nel Markdown. Le immagini sono generate con lo strumento ImageGen integrato, salvate nella cartella del capitolo e collegate con percorsi relativi. [Prompt e provenienza](exercise-image-prompts.json).

## Distinzioni verificate nella documentazione

- Il punto nel chiamante controlla il passaggio per riferimento; ByRef/Output nella firma documentano l’intenzione: [metodi](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods).
- Il puntatore di $LISTNEXT non è un contatore e gli elementi omessi richiedono una gestione esplicita: [$LISTNEXT](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistnext).
- $ZHOROLOG misura secondi dall’avvio con frazioni: [$ZHOROLOG](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vzhorolog).
- TUNE TABLE può riottimizzare i piani cache quando cambiano le statistiche: [TUNE TABLE](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_tunetable).
- Privilegi SQL e percorso Embedded/Dynamic vanno distinti: [autorizzazioni SQL](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_privileges).
- La modalità read-only del database può produrre PROTECT: [namespace e database](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GORIENT_enviro).


## Copertura della nuova espansione

Ogni riga del quiz apre anche la scheda individuale tramite il collegamento “Analisi guidata di questa domanda”. Le domande simili non sono eliminate: ciascuna mette in evidenza il proprio scenario, il punto di errore e una variante. Le tavole visualizzano i concetti condivisi, mentre il dettaglio di ogni domanda resta nel Markdown.

La raccolta segnala anche contraddizioni o assunzioni troppo forti della fonte, per esempio su include, `$CLASSNAME`, concorrenza ottimistica, ritorni di successo dopo rollback, cache SQL e lettura completa degli stream. Gli esempi non sono stati eseguiti in IRIS.
