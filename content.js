function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function selectComments() {
    let els = document.querySelectorAll("[aria-label='Toggle checkbox']");
    let count = 0;
    for(let el of els)
    {
        let bgColor = window.getComputedStyle(el.querySelector("div")).backgroundColor;
        if (bgColor === 'rgb(54, 54, 54)') {
            el.click()
            if(count >= 5) 
            {
                document.querySelector("[aria-label='Delete']").click()
                await delay(3000)
                document.querySelector("button").click()
                return
            }
        count++
        }
        await delay(200)
    }
};

(async () => {
    let deletedCount = 0;

    const updateDeletedCount = () => {
        chrome.storage.local.set({ deletedCount: deletedCount }, () => {
            console.log(`Deleted comments count updated to ${deletedCount}`);
        });
    };

    const deleteComments = async () => {
        const comments = document.querySelectorAll('._a9zs > button');

        for (const comment of comments) {
            // Click on the options button of the comment
            comment.click();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for the menu to appear

            // Click on the 'Delete' button in the menu
            const deleteButton = document.querySelector('._a9-z[role="menuitem"]:nth-child(2)');
            if (deleteButton) {
                deleteButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for confirmation dialog

                // Click on the 'Delete' button in the confirmation dialog
                const confirmButton = document.querySelector('._a9--._a9_z._a9-1');
                if (confirmButton) {
                    confirmButton.click();
                    deletedCount++;
                    updateDeletedCount();
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for the deletion to complete
                }
            }
        }
    };

    chrome.storage.local.get(['deletedCount'], (result) => {
        deletedCount = result.deletedCount || 0;
        deleteComments();
    });
})();

