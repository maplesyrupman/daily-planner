const containerEl = $('.container');
const todaysDateEl = $('#todaysDate');
let todaysDate = moment().format('dddd, MMMM Do YYYY');
todaysDateEl.text(todaysDate);

let currentHour = 12;
let currentDay = moment().day();



const blockStuff = (() => {
    let rows = $('.row');

    const styleBlocks = (currentTime) => {
        for (let i = 0; i < rows.length; i++) {
            
            let block = rows[i];
            let time = block.dataset.time;
            if (time < currentTime) {
                block.classList.add('past');
                if (block.classList.contains('present')) {
                    block.classList.remove('present');
                } else if (block.classList.contains('future')) {
                    block.classList.remove('future');                
                }

            } else if (time == currentTime) {
                block.classList.add('present');
                if (block.classList.contains('future')) {
                    block.classList.remove('future');
                } else if (block.classList.contains('past')) {
                    block.classList.remove('past');
                }
            } else {
                block.classList.add('future');
                if (block.classList.contains('past')) {
                    block.classList.remove('past');
                } else if (block.classList.contains('present')) {
                    block.classList.remove('present');
                }
            }
        }
    }

    const addBlockText = () => {
        let blocks = storage.getBlocks();

        for (let i=0; i<blocks.length; i++) {
            document.getElementById(blocks[i][0]).value = blocks[i][1];
        }
    }

    return {
        styleBlocks,
        addBlockText
    }
})()


const storage = (() => {
    const getBlocks = () => {
        if (!localStorage.getItem('blocks')) {
            return [
                ['9h-block', ''],
                ['10h-block', ''],
                ['11h-block', ''],
                ['12h-block', ''],
                ['13h-block', ''],
                ['14h-block', ''],
                ['15h-block', ''],
                ['16h-block', ''],
                ['17h-block', '']
            ]
        }
        return JSON.parse(localStorage.getItem('blocks'));
    }

    const setBlocks = () => {
        let blocksArr = [];
        let blocks = $('.time-block');
        for (let i = 0; i<blocks.length; i++) {
            blocksArr.push([blocks[i]['id'], blocks[i]['value']]);
        }
        localStorage.setItem('blocks', JSON.stringify(blocksArr));

        localStorage.setItem('currentDay', JSON.stringify(moment().day()));
    }

    const resetBlocks = () => {
        localStorage.setItem('blocks', JSON.stringify(
            [
                ['9h-block', ''],
                ['10h-block', ''],
                ['11h-block', ''],
                ['12h-block', ''],
                ['13h-block', ''],
                ['14h-block', ''],
                ['15h-block', ''],
                ['16h-block', ''],
                ['17h-block', '']
            ]
        ))
    }

    return {
        getBlocks,
        setBlocks,
        resetBlocks
    }
})()

containerEl.click(e => {
    if (e.target.localName == 'i' || e.target.localName == 'button') {
        storage.setBlocks();
    }
});

blockStuff.addBlockText();
blockStuff.styleBlocks(currentHour);

setInterval(() => {
    console.log(moment().hour(), currentHour);
    if (moment().hour() != currentHour) {
        blockStuff.styleBlocks(moment().hour());
        currentHour = moment().hour();
        console.log('check');
    }
    if (moment().day() != currentDay) {
        storage.resetBlocks();
        blockStuff.addBlockText();
        currentDay = moment().day();
    }
}, 60000)