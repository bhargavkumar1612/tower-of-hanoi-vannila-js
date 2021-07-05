document.querySelector(".main").addEventListener('dragover', (event)=>{
    event.preventDefault()
})
let rods = document.querySelectorAll('.bars')
const areas = []
for (i=1;i<=3;i++){
    let el = document.getElementById(`area${i}`).getBoundingClientRect()
    el.id = i
    areas.push(el)
}

let moves = 0
let currentBar = null
let finalParent = null
let initialParent = null
let I;
function reset(e){
    clearInterval(I)
    moves = 0
    currentBar = null
    finalParent = null
    initialParent = null
    document.getElementById('moves').textContent = moves
    document.querySelectorAll(".bars").forEach(el=>{
        el.parentNode.replaceChild(el.cloneNode(true),el)
    })
    document.querySelectorAll(".bars").forEach(el=>{
        el.innerHTML = ''
    })
    
    for (let i=1;i<=e;i++){
        document.getElementById("rod1").innerHTML+=`<div class="bar" id="bar${i}" draggable="true"></div>`
    }
    
    rods = document.querySelectorAll('.bars')
    document.getElementById('min-moves').textContent=`/${2**e-1}`
}

document.getElementById('reset').onclick = ()=>{
    reset(document.getElementById("bars-select").value)
    listen()
}


document.getElementById("bars-select").addEventListener('change',(e)=>{
    reset(e.target.value)
    listen()
})

document.getElementById('solve').onclick = solve


function listen(){
    rods.forEach(rod=>{
        rod.addEventListener('dragstart', (event)=>{
            currentBar = event.target
            initialParent = event.target.parentNode     
        })
        rod.addEventListener('dragover', (event)=>{        
            event.preventDefault()
        })
        rod.addEventListener('dragend', (event)=>{  
            finalParent = getClosestElement(event.clientX, event.clientY)
            let a = finalParent.querySelectorAll('.bar')
            let b = initialParent.querySelectorAll(".bar")
            if ((a.length===0 || a[a.length-1].id<currentBar.id) &&  b[b.length-1].id===currentBar.id){
                initialParent.removeChild(currentBar)
                finalParent.appendChild(currentBar)
                moves+=1
                document.getElementById('moves').textContent = moves 
            }
            else{
                if (a[a.length-1].id!==currentBar.id){
                    document.querySelector('p.error-message').textContent="Not Allowed"
                }
                setTimeout(()=>{document.querySelector('p.error-message').textContent=""},2000)
            }
        })
    }
)
}


function getClosestElement(x,y){
    for (box of areas){
        if (box.left<=x && x<=box.right){
            return document.getElementById(`rod${box.id}`)
        }
    }
}


function hanoiSol(n){
    let sol = []
    let hanoi = function(disc,src,aux,dst) {
        if (disc > 0) {
            hanoi(disc - 1,src,dst,aux);
            sol.push([src , dst]);
            hanoi(disc - 1,aux,src,dst);
        }
    }
    hanoi(n,"rod1","rod2","rod3");
    return sol
}

function solve(){
    let n = document.getElementById('bars-select').value
    reset(n)
    listen()
    let sol = hanoiSol(n)
    let i = 0
    I = setInterval(()=>{
        let [from, to] = sol[i]
        let fromNode = document.getElementById(from)
        let toNode = document.getElementById(to)
        let top = fromNode.querySelectorAll('.bar')[fromNode.querySelectorAll('.bar').length-1]
        fromNode.removeChild(top)
        toNode.appendChild(top)
        i+=1
        document.getElementById('moves').textContent=i
        if (i===sol.length){
            clearInterval(I)
        }
    }, 1000)
    
}
listen()