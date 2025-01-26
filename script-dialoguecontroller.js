document.addEventListener("DOMContentLoaded", () => {
    const dialogueContainer = document.querySelector("dialogue_minefield");
  
    if (!dialogueContainer) {
      console.error("Container with ID #dialogue_minefield not found!");
      return;
    }
  
    const dialogueParts = document.querySelectorAll(".dialogue_part");
  
    console.log("Found dialogue parts:", dialogueParts);
  
    if (dialogueParts.length === 0) {
      console.error("No .dialogue_part elements found in DialogueController!");
      return;
    }
  
    dialogueParts.forEach((part, index) => {
      setTimeout(() => {
        part.classList.add("visible");
      }, index * 500);
    });
  
    // 텍스트 넘기기 로직
    const texts = [
      "",
      "예, 저.. 무슨 작업을 하실 건지?",
    ];
  
    class DialogueController {
      constructor(dialogueContainer, texts) {
        this.dialogueContainer = dialogueContainer;
        this.textDialogue = dialogueContainer.querySelector(".text_dialogue");
        this.texts = texts;
        this.currentIndex = 0;
        this.init();
      }
  
      init() {
        console.log("Initializing DialogueController...");
        this.dialogueContainer.addEventListener("click", (event) => {
          const isTextOrMain =
            event.target.classList.contains("text_dialogue") ||
            event.target.classList.contains("dialoguebox_main");
  
          if (isTextOrMain) {
            this.nextText();
          }
        });
      }
  
      nextText() {
        if (this.currentIndex < this.texts.length - 1) {
          this.currentIndex++;
          this.updateText();
        } else {
          console.log("대화 종료!");
        }
      }
  
      updateText() {
        this.textDialogue.textContent = this.texts[this.currentIndex];
      }
    }
  
    new DialogueController(dialogueContainer, texts);
  });
  