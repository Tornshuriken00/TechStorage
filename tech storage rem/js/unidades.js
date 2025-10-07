async function jsonReq(url,data){ const res = await fetch(url,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data), credentials:'include'}); return res.json(); }
export async function getUnidades(){ const r = await fetch('/api/unidades_read.php',{credentials:'include'}); return r.json(); }
export async function createUnidade(data){ return jsonReq('/api/unidades_create.php', data); }
export async function updateUnidade(data){ return jsonReq('/api/unidades_update.php', data); }
export async function deleteUnidade(id){ return jsonReq('/api/unidades_delete.php', {id_unidade:id}); }
window.showAddUnidade = function(){ document.getElementById('addUnidadeForm').style.display='block'; }
window.addUnidade = async function(){ 
    const sig=document.getElementById('unidadeSigla').value; 
    const desc=document.getElementById('unidadeDesc').value; 
    const resp = await createUnidade({sigla:sig,descricao:desc}); 
    if(resp.success){ 
        alert('Unidade criada'); 
        location.reload(); 
    } else {
        alert('Erro ao criar Unidade: ' + (resp.error || resp.detail || JSON.stringify(resp))); 
    }
}

// Funções globais auxiliares (do passo anterior)
window.handleEditUnidade = async function(id, siglaAtual) {
    const novaSigla = prompt('Sigla', siglaAtual); 
    if(!novaSigla) return; 
    await updateUnidade({id_unidade:id, sigla:novaSigla}); 
    location.reload(); 
};

window.handleDeleteUnidade = async function(id) {
    if(!confirm('Deletar?')) return; 
    await deleteUnidade(id); 
    location.reload();
};

window.loadUnidades = async function(){ 
    const r = await getUnidades(); 
    const t = document.getElementById('unidadesList'); 
    if(!t) return; 
    t.innerHTML=''; 
    r.unidades.forEach(u=>{ 
        const tr = document.createElement('tr'); 
        
        // Construção da linha usando DOM, sem tr.innerHTML
        tr.insertCell().textContent = u.id_unidade;
        tr.insertCell().textContent = u.sigla;
        tr.insertCell().textContent = u.descricao;
        
        const actionCell = tr.insertCell();

        // Botão Editar
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-warning me-2';
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => window.handleEditUnidade(u.id_unidade, u.sigla);
        actionCell.appendChild(editBtn);

        // Botão Apagar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.textContent = 'Apagar';
        deleteBtn.onclick = () => window.handleDeleteUnidade(u.id_unidade);
        actionCell.appendChild(deleteBtn);

        t.appendChild(tr); 
    }); 
}
window.addEventListener('DOMContentLoaded', window.loadUnidades);