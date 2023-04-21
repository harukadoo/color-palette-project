const columns = document.querySelectorAll('.column');
const text = document.querySelectorAll('.text');

let columnCount = 0;
function addNewColumn() {
    if (columnCount >= 2) {
        return;
    }

    const firstColumn = document.querySelector('.column:first-of-type');
    const newColumn = firstColumn.cloneNode(true);

    const firstColor = chroma(firstColumn.style.backgroundColor);
    const newColor = chroma.scale([firstColor, firstColor.darken(2)]).mode('lab')(0.5);

    const textCode = newColumn.querySelector('p');
    const lockBtn = newColumn.querySelector('.lock');
        const copyBtn = newColumn.querySelector('.copy');
        const removeBtn = newColumn.querySelector('.remove');

    textCode.textContent = newColor.hex();
    setTextColor(textCode, newColor.hex());
    setTextColor(lockBtn, newColor.hex());
    setTextColor(copyBtn, newColor.hex());
    setTextColor(removeBtn, newColor.hex());

    newColumn.style.backgroundColor = newColor;

    firstColumn.insertAdjacentElement('beforebegin', newColumn);

    columnCount++;
}



document.addEventListener('keydown', (e) => {
    e.preventDefault()
    e.code.toLowerCase() === 'space' ? setRandomColor() : null;
});

document.addEventListener('click', (e) => {
    const type = e.target.dataset.type
    const node = e.target.tagName.toLowerCase() === 'i'
        ? e.target : e.target.children[0]

    if (type === 'lock') {
        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')

    } else if (type === 'copy') {

        const column = e.target.closest('.column');
        const textCode = column.querySelector('.text');
        const datasetCopy = column.querySelector('.copy');
        const textToCopy = textCode.textContent;
        copy(textToCopy);

        datasetCopy.dataset.type = 'copied!';
        setTimeout(() => { 
            datasetCopy.dataset.type = 'copy';
        }, 2000);
        

    } else if (type === 'remove') {
        const removeButtons = document.querySelectorAll('.remove');
        removeButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const column = e.target.closest('.column');
                column.parentNode.removeChild(column);
            });
        });

       columnCount = 0;

    } else if (type === 'add-color') {
        addNewColumn()
    }


});

function copy(text) {
    return navigator.clipboard.writeText(text.toUpperCase());
}



function setRandomColor(isInitial) {
    const colors = isInitial ? getColorsFromHash() : []

    const baseColor = chroma.random(); 
    const baseColor2 = chroma.random();

    columns.forEach((column, index) => {
        const isLocked = column.querySelector('i').classList.contains('fa-lock')
        const textCode = column.querySelector('p');
        const lockBtn = column.querySelector('.lock');
        const copyBtn = column.querySelector('.copy');
        const removeBtn = column.querySelector('.remove');

        if (isLocked) {
            colors.push(textCode.textContent)
            return
        }

        const color = index === 0 
            ? baseColor
            : chroma.scale([baseColor, baseColor2, baseColor2.darken(2)]).mode('lab')(index / (columns.length - 1))

        if (!isInitial) {
            colors.push(color.hex())
        }

        textCode.textContent = color.hex(); 
        column.style.background = color.hex();

        setTextColor(textCode, color.hex());
        setTextColor(lockBtn, color.hex());
        setTextColor(copyBtn, color.hex());
        setTextColor(removeBtn, color.hex());
    });



    updateColorsHash(colors)
}




function setTextColor(text, color) {
    const luminance = chroma(color).luminance();
    text.style.color = luminance > 0.5 ? 'black' : 'white'
}


function updateColorsHash(colors = []) {
    document.location.hash = colors.map((column) => column.toString().substring(1)).join('-')
}

function getColorsFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash.substring(1).split('-').map((color) => '#' + color)
    }
    return []
}

setRandomColor(true)