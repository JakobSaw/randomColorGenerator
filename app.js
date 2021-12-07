let el1 = document.getElementById("1");
let el2;
let el3;
let el4;
let el5;
let el6;
let el7;
let el8;
let el9;

let plus = document.getElementById("plus");
let container = document.getElementById("container");
let parents = document.getElementsByClassName("parent");

const possibleLetters = "0123456789ABCDEF";

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}
const checkForThemeChange = (color) => {
    const sumRGB =
        hexToRgb(color).r * 0.299 +
        hexToRgb(color).g * 0.587 +
        hexToRgb(color).b * 0.114;
    if (sumRGB > 186) {
        return "dark";
    } else {
        return "light";
    }
};

let colorSelected = el1;
let colorCache = [
    ["ffffff"],
    ["ffffff"],
    ["ffffff"],
    ["ffffff"],
    ["ffffff"],
    ["ffffff"],
    ["ffffff"],
    ["ffffff"],
    ["ffffff"],
];
let indexPosition = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let parentCount = 1;

// Generate Colors & Right Left
const generateColor = () => {
    let generatedColor = "";
    for (let i = 0; i < 6; i++) {
        const randomNumber = Math.round(Math.random() * 15);
        generatedColor += possibleLetters[randomNumber];
    }
    return generatedColor;
};
const appendNewP = (downElement, color, downClassName) => {
    if (downElement.id !== "1") {
        downElement.children[1].className = downClassName;
    }
    downElement.removeChild(downElement.children[0]);
    let newP = document.createElement("p");
    newP.className = downClassName;
    newP.innerText = `#${color.toLowerCase()}`;
    downElement.insertBefore(newP, downElement.children[0]);
};
const rightArrow = () => {
    const id = parseInt(colorSelected.id);
    let cc = colorCache[id - 1];
    indexPosition[id] += 1;
    if (cc.length === indexPosition[id]) {
        const color = generateColor();
        const colorCheck = checkForThemeChange(color);
        colorSelected.style.background = `#${color}`;
        appendNewP(colorSelected, color, colorCheck);
        colorCache[id - 1].push(color);
    } else {
        const getCachedColor = cc[indexPosition[id]];
        const colorCheck = checkForThemeChange(getCachedColor);
        colorSelected.style.background = `#${getCachedColor}`;
        appendNewP(colorSelected, getCachedColor, colorCheck);
    }
};
const leftArrow = () => {
    const id = parseInt(colorSelected.id);
    let cc = colorCache[id - 1];
    if (indexPosition[id] > 0) {
        indexPosition[id] -= 1;
        const getCachedColor = cc[indexPosition[id]];
        const colorCheck = checkForThemeChange(getCachedColor);
        colorSelected.style.background = `#${getCachedColor}`;
        appendNewP(colorSelected, getCachedColor, colorCheck);
    }
};

// Plus & Minus
//
const plusPressed = (g) => {
    if (parentCount < 9) {
        parentCount += 1;
        // Create New Element
        let newDiv = document.createElement("div");
        newDiv.setAttribute("id", parentCount);
        newDiv.innerHTML = `<p>#ffffff</p><button id='minus'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 225"><path d="M144,119c5.68,0,8.08-2,8.1-6.48s-2.43-6.51-8.05-6.54l-64,0c-5.18.06-8,3.29-7,8,.83,4,3.71,5.1,7.44,5.07Z" /><path d="M112.5,13A99.5,99.5,0,1,1,13,112.5,99.62,99.62,0,0,1,112.5,13m0-13h0A112.5,112.5,0,0,0,0,112.5H0A112.5,112.5,0,0,0,112.5,225h0A112.5,112.5,0,0,0,225,112.5h0A112.5,112.5,0,0,0,112.5,0Z" /></svg></button>`;
        // unfocuse all other Elements
        for (let i = 0; i < parents.length; i++) {
            parents[i].classList = "parent";
        }
        newDiv.setAttribute("class", "parent selected");
        // add to Grid
        container.style.gridTemplateColumns = `repeat(${parentCount}, 1fr)`;
        // appendChild
        container.appendChild(newDiv);
        colorSelected = newDiv;
        newDiv.children[1].addEventListener("click", minusPressed);
    }
};
const minusPressed = (e) => {
    // get all current Parents
    parents = document.getElementsByClassName("parent");
    // ID of the removed Parent
    let removeId;
    if (!e) {
        removeId = parseInt(colorSelected.id);
    } else {
        removeId = parseInt(e.target.parentNode.parentNode.id);
    }
    if (removeId > 1) {
        // lower parentCount
        parentCount -= 1;
        // remove Parent
        container.removeChild(parents[removeId - 1]);
        // new parents
        let parentsAfterRemove = document.getElementsByClassName("parent");
        // remove to Grid
        if (parentCount === 1) {
            container.style.gridTemplateColumns = `1fr`;
            el1.classList = "parent selected";
            colorSelected = el1;
            // rebuild Array & indexPosition
            //
            colorCache = [
                colorCache[0],
                ["ffffff"],
                ["ffffff"],
                ["ffffff"],
                ["ffffff"],
                ["ffffff"],
                ["ffffff"],
                ["ffffff"],
                ["ffffff"],
            ];

            indexPosition = [indexPosition[0], 0, 0, 0, 0, 0, 0, 0, 0];
        } else {
            for (let j = 1; j < parentsAfterRemove.length; j++) {
                if (
                    parentsAfterRemove[j].id > j + 1 ||
                    parentsAfterRemove[j].id < j + 1
                ) {
                    parentsAfterRemove[j].id = j + 1;
                }
                parentsAfterRemove[j].classList = "parent";
            }
            parentsAfterRemove[parentsAfterRemove.length - 1].classList =
                "parent selected";
            colorSelected = parentsAfterRemove[parentsAfterRemove.length - 1];
            container.style.gridTemplateColumns = `repeat(${parentCount}, 1fr)`;
            // rebuild Array & indexPosition
            //
            colorCache.splice(removeId - 1, 1);
            colorCache.push(["#ffffff"]);
            indexPosition.splice(removeId - 1, 1);
            indexPosition.push(0);
        }
    }
};

// Key Press
//
document.onkeydown = (e) => {
    const kc = e.keyCode;

    // console.log(kc);

    el2 = document.getElementById("2");
    el3 = document.getElementById("3");
    el4 = document.getElementById("4");
    el5 = document.getElementById("5");
    el6 = document.getElementById("6");
    el7 = document.getElementById("7");
    el8 = document.getElementById("8");
    el9 = document.getElementById("9");
    parents = document.getElementsByClassName("parent");

    const makeChanges = (el) => {
        colorSelected = el;
        for (let i = 0; i < parents.length; i++) {
            parents[i].classList = "parent";
        }
        colorSelected.classList = "parent selected";
    };

    // 1 - 9
    if (kc >= 49 && kc <= 57) {
        if (kc === 49 && el1) {
            makeChanges(el1);
        } else if (kc === 50 && el2) {
            makeChanges(el2);
        } else if (kc === 51 && el3) {
            makeChanges(el3);
        } else if (kc === 52 && el4) {
            makeChanges(el4);
        } else if (kc === 53 && el5) {
            makeChanges(el5);
        } else if (kc === 54 && el6) {
            makeChanges(el6);
        } else if (kc === 55 && el7) {
            makeChanges(el7);
        } else if (kc === 56 && el8) {
            makeChanges(el8);
        } else if (kc === 57 && el9) {
            makeChanges(el9);
        }
    }
    // Right & Left
    if (e.keyCode === 37) {
        e.preventDefault();
        leftArrow();
    } else if (e.keyCode === 39) {
        e.preventDefault();
        rightArrow();
    }
    // Plus Key Pressed
    if (kc === 187) {
        plusPressed();
    }
    if (kc === 189 && parentCount > 1) {
        minusPressed();
    }
};

plus.addEventListener("click", plusPressed);
