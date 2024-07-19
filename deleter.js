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
