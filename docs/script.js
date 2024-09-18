const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')

let itens = []
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')
  modal.style.opacity = 0
  setTimeout(() => modal.style.opacity = 1, 100)

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
      modal.style.opacity = 0
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sFuncao.value = itens[index].funcao
    sSalario.value = itens[index].salario
    id = index
  } else {
    sNome.value = ''
    sFuncao.value = ''
    sSalario.value = ''
  }
}

function editItem(index) {
  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
  showToast('Item excluído com sucesso!')
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td class="acao">
      <button class="edit-btn" onclick="editItem(${index})"><i class='bx bx-edit'></i> Editar</button>
    </td>
    <td class="acao">
      <button class="delete-btn" onclick="deleteItem(${index})"><i class='bx bx-trash'></i> Excluir</button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  e.preventDefault()

  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
    alert('Preencha todos os campos antes de salvar!')
    return
  }

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].funcao = sFuncao.value
    itens[id].salario = sSalario.value
  } else {
    itens.push({ 'nome': sNome.value, 'funcao': sFuncao.value, 'salario': sSalario.value })
  }

  setItensBD()
  modal.classList.remove('active')
  loadItens()
  id = undefined
  showToast('Item salvo com sucesso!')
}

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })
}

function showToast(message) {
  const toast = document.createElement('div')
  toast.classList.add('toast')
  toast.innerText = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = 0
    setTimeout(() => toast.remove(), 300)
  }, 2000)
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()
