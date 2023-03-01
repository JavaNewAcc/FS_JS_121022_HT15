window.onload = () => {
    let resDivExist = false;
    let cardDivExist = false;
    let val = 0;
    let svgContainer = 0;
    let loadingComplete = false;
    let sortSizeUp = true;
    let sortPopulUp = false;

    let openResBtn = document.querySelector('.openResBtn');
    openResBtn.addEventListener('click', function () {
        if (!resDivExist) {
            resDivExist = true;
            createDiv(`resDiv,w-100,d-flex,flex-column`, openResBtn, 'after');
            openResBtn.innerText = 'Close results';

            let addButton = addBtn('btn,btn-success,m-auto,mt-3,mb-3,addBtn', document.querySelector('.resDiv'), 'before');
            addButton.innerText = 'Отримати інформацію про планети'
            addButton.addEventListener('click', function () {
                getData();
            })

            let buttonDiv = createDiv('d-flex,flex-wrap,col-10,justify-content-center,m-auto,mb-3,buttonDiv', addButton, 'after');

            let sortBtnSize = addBtn('btn,btn-success,sortBtnSize,me-1', buttonDiv, 'appendChild');
            sortBtnSize.disabled = 'true';
            sortBtnSize.innerHTML = "Сортувати за розміром <br> (від більшого до меншого)";

            let sortBtnPopul = addBtn('btn,btn-success,sortBtnPopul,ms-1', buttonDiv, 'appendChild');
            sortBtnPopul.disabled = 'true';
            sortBtnPopul.innerHTML = "Сортувати за популяцією <br> (від більшої до меншої)";

            let popularDiv = document.createElement('div');
            popularDiv.classList.add('col-12', 'text-center');
            buttonDiv.appendChild(popularDiv);

            let popularChbx = document.createElement('input');
            popularChbx.type = 'checkbox';
            popularChbx.classList.add('mt-3', 'mb-3', 'text-end');
            popularChbx.id = 'popularChbx';
            popularChbx.disabled = true;
            popularDiv.appendChild(popularChbx);

            let popularChbxLabel = document.createElement('label');
            popularChbxLabel.classList.add('m-3', 'text-secondary', 'popularChbxLabel');
            popularChbxLabel.setAttribute('for', 'popularChbx');
            popularChbxLabel.innerText = 'Найзірковіша планета';
            popularDiv.appendChild(popularChbxLabel);

            openResBtn.scrollIntoView(true);
        }
        else {
            resDivExist = false;
            delDiv('buttonDiv');
            delDiv('resDiv');
            delDiv('addBtn');
            openResBtn.innerText = 'Result';
        }
    })

    function createDiv(divClasses, parentElement, addMode) {
        let div = document.createElement('div');
        divClassesArr = [...divClasses.split(',')];
        if (divClasses != "") {
            [...divClasses.split(',')].forEach(element => {
                div.classList.add(element);
            })
        }
        if (addMode == 'after') {
            parentElement.after(div);
        }
        else if (addMode == 'appendChild') {
            parentElement.appendChild(div);
        }
        return div;
    }

    function delDiv(className) {
        let div = document.querySelector(`.${className}`);
        div.remove(div);
        cardDivExist = false;
        loadingComplete = false;
    }

    function compareData(field, param, element) {
        element.sort((a, b) => {
            if (param == 'up') {
                if (/\D/.test(a[field])) {
                    return 1;
                }
                else {
                    if (a[field] - b[field] < 0) { return 1 };
                    if (a[field] - b[field] > 0) { return -1 };
                    return 0;
                }
            }
            if (param == 'down') {
                if (/\D/.test(a[field])) {
                    return -1;
                }
                else {
                    if (a[field] - b[field] > 0) { return 1 };
                    if (a[field] - b[field] < 0) { return -1 };
                    return 0;
                }
            }
        })
    }

    function getData() {
        val = 0;
        loadingComplete = false;
        svgLoader();
        svgDoTimeout();
        animateFadeIn(svgContainer, 300);
        fetch('https://swapi.dev/api/planets').then((response) => response.json()).then((data) => {
            loadingComplete = true;
            addCard(data.results);
            document.querySelector('.addBtn').scrollIntoView(true);

            let sortBtnSize = document.querySelector('.sortBtnSize');
            sortBtnSize.disabled = '';
            sortBtnSize.addEventListener('click', function () {
                document.querySelector('.cardDiv').remove(document.querySelector('.cardDiv').children);
                cardDivExist = false;

                if (sortSizeUp) {
                    data.results.sort(compareData('diameter', 'up', data.results));
                    sortSizeUp = false;
                    sortBtnSize.innerHTML = "Сортувати за розміром <br> (від меншого до більшого)"
                }
                else {
                    data.results.sort(compareData('diameter', 'down', data.results));
                    sortSizeUp = true;
                    sortBtnSize.innerHTML = "Сортувати за розміром <br> (від більшого до меншого)"
                }
                addCard(data.results);
            });

            let sortBtnPopul = document.querySelector('.sortBtnPopul');
            sortBtnPopul.disabled = '';

            sortBtnPopul.addEventListener('click', function () {
                document.querySelector('.cardDiv').remove(document.querySelector('.cardDiv').children);
                cardDivExist = false;
                if (sortPopulUp) {
                    data.results.sort(compareData('population', 'down', data.results));
                    sortPopulUp = false;
                    sortBtnPopul.innerHTML = "Сортувати за популяцією <br> (від більшої до меншої)"
                }
                else {
                    data.results.sort(compareData('population', 'up', data.results));
                    sortPopulUp = true;
                    sortBtnPopul.innerHTML = "Сортувати за популяцією <br> (від меншої до більшої)"
                }
                addCard(data.results);
            });

            let popularChbx = document.querySelector('#popularChbx');
            let popularChbxLabel = document.querySelector('.popularChbxLabel');
            popularChbxLabel.classList.remove('text-secondary');

            popularChbx.disabled = false;

            popularChbx.addEventListener('change', function () {
                let addInfoDiv = document.querySelectorAll('.addInfoDiv');
                if (this.checked) {
                    let maxLength = 0;
                    data.results.forEach(element => {
                        if (element.films.length > maxLength) {
                            maxLength = element.films.length;
                        }
                    });

                    [...addInfoDiv].forEach(element => {
                        let [...links] = element.querySelectorAll('a');
                        let filmCounter = 0;
                        links.forEach(element => {
                            if (/films/.test(element.innerText)) {
                                filmCounter++;
                            }
                        })
                        if (filmCounter < maxLength) {
                            element.parentElement.style.display = 'none';
                            element.parentElement.classList.remove('d-flex')
                        }
                    });
                }
                else {
                    [...addInfoDiv].forEach(element => {
                        element.parentElement.style.display = 'flex';
                        element.parentElement.classList.add('d-flex')
                    })
                }
            })
            setTimeout(function () { animateFadeOut(svgContainer, 500) }, 500);
            setTimeout(function () {
                svgContainer.style.display = "none";
            }, 400);
        });
    }

    function addBtn(btnClassList, parentElem, appendMode) {
        let btn = document.createElement('button');
        if (btnClassList != "") {
            [...btnClassList.split(',')].forEach(element => {
                btn.classList.add(element);
            })
        }
        if (appendMode == 'after') {
            parentElem.after(btn);
        }
        else if (appendMode == 'appendChild') {
            parentElem.appendChild(btn);
        }
        else if (appendMode == 'before') { parentElem.before(btn); }
        return btn;
    }

    function addCard(resData) {
        if (!cardDivExist) {
            cardDivExist = true;
            if (resData.length > 0) {
                let addBtn = document.querySelector('.resDiv');
                let cardDiv = createDiv('d-flex,flex-wrap,justify-content-center,cardDiv', addBtn, 'appendChild')

                for (let i = 0; i < resData.length; i++) {
                    let div = createDiv('col-12,col-md-5,col-xl-3,d-flex,flex-column,userCard,p-3,p-md-1,p-lg-3,p-xl-1,m-1,rounded,font-white,align-content-center,justify-content-start', cardDiv, 'appendChild');
                    div.style.height = 'fit-content';
                    switch (i % 4) {
                        case 0:
                            div.classList.add('bg-c-blue');
                            break;
                        case 1:
                            div.classList.add('bg-c-red');
                            break;
                        case 2:
                            div.classList.add('bg-c-yellow');
                            break;
                        case 3:
                            div.classList.add('bg-c-darkblue');
                            break;
                    }

                    let mainInfoDiv = createDiv('col-12,d-flex,flex-wrap,mainInfoDiv', div, 'appendChild');

                    let addInfoDiv = createDiv('col-12,flex-wrap,addInfoDiv', div, 'appendChild');
                    addInfoDiv.style.display = 'none';

                    let infoBtn = document.createElement('button');
                    infoBtn.classList.add('btn', 'col-12');
                    infoBtn.style.backgroundColor = 'RGBA(126,126,126,0.75)';
                    infoBtn.innerText = "MORE INFO";
                    infoBtn.style.color = "white";

                    infoBtn.addEventListener('click', function () {
                        if (addInfoDiv.style.display == "none") {
                            addInfoDiv.style.display = '';
                            addInfoDiv.classList.add('d-flex');
                            infoBtn.innerText = "HIDE INFO";
                        }
                        else {
                            addInfoDiv.style.display = 'none';
                            addInfoDiv.classList.remove('d-flex');
                            infoBtn.innerText = "MORE INFO";
                        }
                    })
                    addInfoDiv.before(infoBtn);
                    dataFiller(resData[i], [...div.children]);
                    animateFadeIn(div, 500 * i);
                }
            }
        }
    }

    function svgLoader() {
        let svg = document.querySelector('svg');
        svgContainer = document.querySelector('.svgContainer');
        let loadingDiv = document.querySelector('.loadingDiv');
        if (loadingDiv == null) {
            let loadingDiv = createDiv('p-3,display-6,fw-bold,loadingDiv', svgContainer, 'appendChild');
            loadingDiv.innerText = 'LOADING...';
            svg.style.width = '50vw';
            svgContainer.classList.add('flex-column', 'justify-content-center', 'align-items-center')
        }
    }

    function svgSetProgress(amt) {
        let svgContainer = document.querySelector('.svgContainer');
        svgContainer.style.display = "flex";
        amt = (amt < 0) ? 0 : (amt > 1.01) ? 1.01 : amt;
        document.getElementById("stop1").setAttribute("offset", amt);
        document.getElementById("stop2").setAttribute("offset", amt);
    }

    function svgDoTimeout() {
        if (loadingComplete) {
            val = 1.01;
        }
        svgSetProgress(val);
        val += 0.01;
        if (val <= 1.01) {
            setTimeout(svgDoTimeout, 15);
        }
    }

    function imageLoader(name, parentElem) {
        let img = document.createElement('img');
        img.classList.add('col-12')
        img.src = `./img/${name}.gif`;
        img.style.overflow = 'auto';
        img.style.filter = 'grayscale(1)';
        img.style.borderRadius = '300px';
        parentElem[0].appendChild(img);
        img.addEventListener('mouseover', function () {
            img.animate([{ filter: 'grayscale(1)' }, { filter: 'grayscale(0)' }], 300);
            img.style.filter = 'grayscale(0)';
        });
        parentElem[0].addEventListener('mouseout', function () {
            img.animate([{ filter: 'grayscale(0)' }, { filter: 'grayscale(1)' }], 300);
            img.style.filter = 'grayscale(1)';
        });
    }

    function dataFiller(dataObj, parentElem) {
        for (const [key, value] of Object.entries(dataObj)) {
            if (key == "name" || key == "population" || key == "diameter") {
                if (key == "name") {
                    switch (value) {
                        case 'Tatooine':
                        case 'Hoth':
                        case 'Dagobah':
                        case 'Bespin':
                        case 'Endor':
                        case 'Naboo':
                        case 'Coruscant':
                            imageLoader(value, parentElem);
                            break;
                        default:
                            imageLoader('ImageNotAvailableRev', parentElem);
                            break;
                    }
                }
                createDiv('col-5,fw-bold,text-break,keyElement', parentElem[0], 'appendChild').innerText = `${key}`;

                createDiv('col-5,text-break,valueElement', parentElem[0], 'appendChild').innerText = `${value}`
            }
            else {
                if (typeof (value) != 'object') {
                    createDiv('col-5,fw-bold,text-break,keyElement', parentElem[2], 'appendChild').innerText = `${key}`;
                    if (/https/i.test(value)) {
                        createDiv('col-5,text-break,valueElement', parentElem[2], 'appendChild').innerHTML = `<a href='${value}' style='color:white'>${value}</a>`
                    }
                    else {
                        createDiv('col-5,text-break,valueElement', parentElem[2], 'appendChild').innerText = `${value}`
                    }
                }
                else {
                    createDiv('col-5,fw-bold,text-break,keyElement', parentElem[2], 'appendChild').innerText = `${key}`;
                    let subDiv = createDiv('col-5,text-break,subDivElement', parentElem[2], 'appendChild');
                    value.forEach(element => {
                        subDiv.innerHTML += `<a href='${element}'style='color:white'>${element} </a><br>`;
                    });
                }
            }
        }
    }

    function animateFadeIn(element, interval) {
        element.animate([{ opacity: 0 },
        { opacity: 1 }], interval)
    }
    function animateFadeOut(element, interval) {
        element.animate([{ opacity: 1 },
        { opacity: 0 }], interval)
    }
}