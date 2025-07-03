document.getElementById("startUnfollow").addEventListener("click", async () => {
    const button = document.getElementById("startUnfollow");
    button.disabled = true;
    button.innerText = "Unfollowing...";
    button.style.backgroundColor = "#f44336"; // red
    button.style.color = "white";
  
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: unfollowAll
    });
  });
  
  function unfollowAll() {
    const dialog = document.querySelector('div[role="dialog"]');
    if (!dialog) {
      alert("Please open the 'Following' list popup before starting.");
      return;
    }
  
    let previousHeight = 0;
    let scrollAttempts = 0;
  
    const interval = setInterval(() => {
      const followButtons = dialog.querySelectorAll('button');
      let clicked = false;
  
      for (let btn of followButtons) {
        if (btn.innerText === "Following") {
          btn.click();
          clicked = true;
  
          // Confirm unfollow after 1 second
          setTimeout(() => {
            const confirmBtn = Array.from(document.querySelectorAll('button'))
              .find(b => b.textContent === "Unfollow");
            if (confirmBtn) confirmBtn.click();
          }, 1000);
  
          break;
        }
      }
  
      if (!clicked) {
        // Scroll to load more users
        dialog.scrollBy(0, 400);
        const currentHeight = dialog.scrollHeight;
  
        if (currentHeight === previousHeight) {
          scrollAttempts++;
        } else {
          scrollAttempts = 0;
          previousHeight = currentHeight;
        }
  
        // Stop after 3 times no new content is found
        if (scrollAttempts > 10000) {
          clearInterval(interval);
          alert("✅ Finished unfollowing everyone.");
          // Optional: change button back via messaging (not directly from content script)
        }
      }
    }, 1000); // unfollow every 3 seconds
  }
  