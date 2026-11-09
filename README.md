# InterSystems ObjectScript Specialist Study Material

Study for the InterSystems ObjectScript Specialist certification with a browser-based tutor and a Markdown study pack. Both follow the same 22 chapters, covering data modeling, basic programming, IRIS features, functions and APIs, and error handling.

**[Open the tutor online](https://pietrodileo.github.io/InterSystems-ObjectScript-Specialist-Study-Material/tutor/)** · [Browse the study pack](ObjectScript%20Study%20Pack/README.md) · [Official exam outline](https://www.intersystems.com/certifications/intersystems-objectscript-specialist/)

## Certification tutor

Open **Study plan** and select **Start study plan** to work through the chapters in order. Each chapter has an illustrated lesson in English, a quiz, and three worked cases. The concept explanations link to relevant InterSystems documentation. When you come back, **Resume study plan** takes you to the first unfinished step.

| Mode | What you can do |
| --- | --- |
| **Study plan** | Use **Check answer** to record each chapter quiz attempt. |
| **Answer review** | Compare your choices with the expected answers, track retries, and see which chapters have the most current errors. You can also revisit completed final assessments. |
| **Final assessment** | Answer one question per chapter. The tutor saves your selections as you go, and you can change them until you select **Finish assessment**. You'll then see the answers and your results by exam area. |

<details>
<summary>Navigation and saved progress</summary>

Use the button in the top bar to open or collapse the course index. On narrow screens, it opens as a drawer; on wider screens, it expands beside the lesson. In a quiz or assessment, use the numbered buttons to jump between questions.

The tutor saves progress and submitted choices in the browser you use to study. Older results still count. Individual choices appear in Answer review for submissions made since the tutor began recording them. To move your progress to another browser or between the online and local tutor, use **Export** to download a JSON backup, then **Import** at the destination. Importing replaces any progress already saved there.

</details>

## Study Pack

Use the Markdown files for offline reading or to look up a specific topic. The pack contains 93 study sections, 358 practice questions with answer explanations and individual analyses, 66 worked cases, and 77 diagrams. The source lessons, quiz questions, and diagrams are in English. The additional question-by-question commentary is in Italian.

- [Topic index](ObjectScript%20Study%20Pack/index.md) for the full chapter list.
- [Visual study index](ObjectScript%20Study%20Pack/visual-index.md) for the illustrated lesson guides.
- [Exercise notes and worked cases](ObjectScript%20Study%20Pack/approfondimenti-esercizi.md) for the Italian commentary, worked variants, and exercise diagrams.
- [Study Pack README](ObjectScript%20Study%20Pack/README.md) for source attribution, folder structure, and notes on content accuracy.

## Run the tutor locally

From the repository root, start a local server with Python 3.

```sh
python3 -m http.server --bind 127.0.0.1 8000
```

[Open the local tutor](http://127.0.0.1:8000/tutor/) in your browser. It reads the lessons, quizzes, and diagrams from your local copy of the study pack. The linked InterSystems documentation and official exam outline require an internet connection.
