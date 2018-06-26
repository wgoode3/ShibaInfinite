const url = "https://cors.io/?http://shibe.online/api/shibes?count=24";
const target = document.getElementById("shibes");
const loading = document.getElementById("loading");

// random heights for the placeholder images
for(let p of document.getElementsByClassName("placeholder")){
    p.style.height = `${Math.random()*200+200>>0}px`;
}

// store the image url in a 3 column grid
let imagegrid = [[], [], []];
// the relative height of each grid
let heights = [0, 0, 0];

function minIndex(arr){
    let m = 0;
    for(let i in arr) {
        if(arr[m] > arr[i]) {
            m = i;
        }
    }
    return m;
}

function columnShibes(arr, x, cb) {
    if (x === arr.length) {
        cb();
    } else {
        let img = new Image();
        img.src = arr[x];
        img.onload = function() {
            let i = minIndex(heights);
            heights[i] += (this.height / this.width) * 100 >> 0;
            imagegrid[i].push(arr[x]);
            columnShibes(arr, x+1, cb);
        } 
    }
}

function drawShibes() {
    let output = `<div class="row">`;
    for(let col of imagegrid) {
        output += `<div class="col"`;
        for(let url of col) {
            output += `<img src="${url}" alt="shibe" data-toggle="modal" data-target="#imgModal">`;
        }
        output += `</div>`;
    }
    output += `</div>`;
    target.innerHTML = output;
}

function getShibes() {
    fetch(url)
    .then( (res) => {
        return res.json();
    })
    .then(function(shibes) {
        columnShibes(shibes, 0, function(){
            loading.style.display = "none";
            console.log(heights);
            drawShibes();
            clickImgs()
        });
    });
}
getShibes();

// when the user scrolls to the bottom, load more images
window.addEventListener("scroll", function(event){

    let scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );

    if(scrollHeight === window.pageYOffset + window.innerHeight) {
        getShibes();
        loading.style.display = "block";
    }

});

let imgs;
const imgModal = document.getElementById("imgModal");
const modalImage = document.getElementById("modalImage");

function clickImgs() {
    imgs = document.querySelectorAll('img');
    for(let img of imgs) {
        img.addEventListener("click", function(e) {
            modalImage.src = e.target.src;
            imgModal.classList.add("show");
        });
    }
}