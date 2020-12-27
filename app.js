var templateTodo = document.getElementById('template-todo').content
const formulario = document.getElementById('formulario')
const listaTarea = document.getElementById('lista-tareas')
const fragment = document.createDocumentFragment()

let tareas = {}

listaTarea.addEventListener('click', e => {
    btnAccion(e)
})

formulario.addEventListener('submit', e =>{
    e.preventDefault()
    setTareas(e)
})

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    pintarTareas()
})

//---------------------------------------------

function setTareas(e) {

    // vuoto input non fare niente
    value = e.target[0].value
    if(value.trim() == ''){
        console.log('esta vacio')
        return
    }

    // crea oggetto tarea
    const tarea = {
        id: Date.now(),
        text: value,
        estado: false
    }
    
    tareas[tarea.id] = tarea
    console.log(tareas)
    
    pintarTareas()
    formulario.reset()
    e.target.querySelector('input').focus()
}

function pintarTareas () {

    localStorage.setItem('tareas', JSON.stringify(tareas))

    if (Object.values(tareas).length == 0) {
        listaTarea.innerHTML =  
        `
            <div class="alert alert-dark text-center">
                Sin tareas pendientes 😍
            </div>
        `
        return
    }

    listaTarea.innerHTML = ''

    Object.values(tareas).forEach(tarea => {
        const clone = templateTodo.cloneNode(true)
        // console.log(clone.querySelector('p'))
        clone.querySelector('p').textContent = tarea.text

        if (tarea.estado) {
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt')
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id
        fragment.appendChild(clone)
    })

    listaTarea.appendChild(fragment)
}

const btnAccion = e => {

    if (e.target.classList.contains('fa-check-circle')) {
        tareas[e.target.dataset.id].estado = true
    
    } else if (e.target.classList.contains('fa-minus-circle')) {
        console.log('delete: ' + e.target.dataset.id)
        delete tareas[e.target.dataset.id]

    } else if (e.target.classList.contains('fa-undo-alt')) {
        tareas[e.target.dataset.id].estado = false
        
    }

    pintarTareas()
    e.stopPropagation()
}