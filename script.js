'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu'),
        menuList = document.querySelector('.menu-list'),
        openCloseBtn = document.querySelector('.close-button'),
        arrow = document.querySelector('.arrow'),
        mainSectoin = document.querySelector('.main-section');

    let showArr = [];

    //Request method
    const getData = () => {
        return new Promise ((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.open('GET', './dbHeroes.json');

            request.addEventListener('readystatechange', () => {
                if(request.readyState !== 4){
                    return;
                }

                if(request.status === 200){
                    const response = JSON.parse(request.responseText);
                    resolve(response);
                }else{
                    reject('Error! Something wrong.');
                }
            });

            request.send();
        })
    };

    //Images loader
    const imagesRender = (arr) => {
        const imgsField = document.querySelector('.pictures-section');

        let idNum = 0;
            
        imgsField.innerHTML = '';

        arr.forEach(elem => {
            
            const div = document.createElement('div'),
                regExp = /^dbimage\/[\w-%]*\.(jpg|png)$/;
            div.classList.add('hero-card');

            if(regExp.test(elem.photo)){
                div.innerHTML = `<div class="hero-img" id="${idNum} " style="background-image: url(./${elem.photo});"></div>
                            <div class="hero-about">
                                <h3>${elem.name}</h3>
                            </div>`;
            }else{
                div.innerHTML = `<div class="hero-img wrong-img"><img src="./icons/emoji_face_emoticon_sad_1-512.png"></div>
                                    <div class="hero-about wrong">
                                        <h3 style="color: black;">OOPS...File is lost.</h3>
                                    </div>`;
            }
            
            imgsField.appendChild(div);

            idNum++;
        })

        return arr;
    };

    //Function for showing cards
    const showImgs = (arr) => {
        const renderedImgs = document.querySelectorAll('.hero-card');

        let i = 0;

        setTimeout(() => {
            let intervalIndx = setInterval(() => {
                if(i < renderedImgs.length){
                    renderedImgs[i].style.visibility = 'visible';
                    i++;
                }else if(i === renderedImgs.length){
                    clearInterval(intervalIndx);
                }
            }, 150);
        }, 2000);

        return arr;
    };

    //Slider actions

    const changeSlide = (obj) => {
        const frame = document.querySelector('.frame');

        frame.innerHTML = ` <div class="full-info">
                                <div class="name-pseydo">
                                    <span class="pseydo">${obj.name}</span>
                                    <span class="name">name : ${obj.realName ? obj.realName : '----'}</span>
                                </div>
                                <div class="slide" style="background-image: url(./${obj.photo});">

                                </div>
                                <div class="other-info">
                                    <span class="actor">real name: ${obj.actors}</span>
                                    <div class="dates">
                                        <span class="birth-day">birthday : ${obj.birthDay ? obj.birthDay : "----"}</span>
                                        <span class="death-day">deathday : ${obj.deathDay ? obj.deathDay : "----"}</span>
                                    </div>
                                    <div class="first-info-block">
                                        <span class="gender">gender : ${obj.gender ? obj.gender : "----"}</span> 
                                        <span class="species">species : ${obj.species}</span>
                                    </div>
                                    <div class="second-info-block">
                                        <span class="citizenship">citizenShip : ${obj.citizenship}</span>
                                        <span class="status">status : ${obj.status}</span> 
                                    </div>
                                </div>
                            </div>
                                    `;
        
     };

     //Slider card initalizator
    const showSlider = (arr) =>{
        const pictureSection = document.querySelector('.pictures-section'),
            coverSlider = document.querySelector('.cover-slider'),
            closeSlider = document.querySelector('.close-slider');


        pictureSection.addEventListener('click', (event) => {
            let target = event.target;
            let index = +target.attributes.id.nodeValue;
            let nextObj;

            if(target.classList.contains('wrong')){
                return;
            }else if(target.classList.contains('hero-img')){
                nextObj = arr[index];
                coverSlider.classList.add('show-slider');
                changeSlide(nextObj);
            }
        
        coverSlider.addEventListener('click', (event) => {
            const frame = document.querySelector('.frame');

            let target = event.target;
                
            if(target.classList.contains('left-slide')){
                if(index === 0){
                    index = arr.length;
                }

                index--;
                nextObj = arr[index];

                frame.innerHTML = '';
                frame.classList.add('shoot-frame');
                
                setTimeout(() => {
                    changeSlide(nextObj);
                    frame.classList.remove('shoot-frame');
                }, 1700);
                
            }else if(target.classList.contains('right-slide')){
                if(index === arr.length - 1){
                    index = -1;
                }
                
                index++;
                nextObj = arr[index];

                
                frame.innerHTML = '';
                frame.classList.add('shoot-frame');

                setTimeout(() => {
                    changeSlide(nextObj);
                    frame.classList.remove('shoot-frame');
                }, 1700);
            }});

        });

        coverSlider.addEventListener('click', (e) => {
            let target = e.target;

            if(target.classList.contains('show-slider') || 
                target.classList.contains('close-slider') || 
                target.classList.contains('slider')){
                    
                coverSlider.classList.remove('show-slider');
            }
        });
    }

    //Open/close menu button
    openCloseBtn.addEventListener('click', () => {
        menu.classList.toggle('active');
        arrow.classList.toggle('left');
    });

    //listener for film choosing 
    menuList.addEventListener('click', (event) => {
        let target = event.target;
        showArr = [];

        if(target.classList.contains('button')){
            mainSectoin.classList.remove('main-active');
            let film = target.textContent;
            
            const heroObj = getData();
            const filmTitle = document.querySelector('.film-title');

            menu.classList.toggle('active');
            arrow.classList.toggle('left');
            
            heroObj
                .then(array => {
                    array.forEach(item => {
                        if(item.movies){
                            item.movies.forEach(elem => {
                                if(elem === film){
                                    showArr.push(item);
                                }
                            })
                        }
                    });
                    
                    return showArr;
                })
                .then(imagesRender)
                .then(showImgs)
                .then(showSlider)
                .catch(error => console.error(error));

            filmTitle.textContent = film;
            mainSectoin.classList.add('main-active');
        }
    })

});