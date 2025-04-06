const Modal = {
    showConfirm(message, onConfirm) {
      const modal = document.getElementById("confirmModal");
      const text = document.getElementById("confirmText");
      const yesBtn = document.getElementById("confirmYes");
      const noBtn = document.getElementById("confirmNo");
  
      text.textContent = message;
      modal.style.display = "flex";
  
      const close = () => {
        modal.style.display = "none";
        yesBtn.onclick = null;
        noBtn.onclick = null;
      };
  
      yesBtn.onclick = () => {
        close();
        onConfirm();
      };
  
      noBtn.onclick = close;
    }
  };