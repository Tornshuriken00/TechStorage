async function jsonReq(url,data){ const res = await fetch(url,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data), credentials:'include'}); return res.json(); }
export async function getProdutos(){ const r = await fetch('/api/produtos_read.php', {credentials:'include'}); return r.json(); }
export async function createProduto(data){ return jsonReq('/api/produtos_create.php', data); }
export async function updateProduto(data){ return jsonReq('/api/produtos_update.php', data); }
export async function deleteProduto(id){ return jsonReq('/api/produtos_delete.php', {id_produto:id}); }
window.showAddItem = function(){ document.getElementById('addItemForm').style.display='block'; }
window.addItem = async function(){ 
    const nome=document.getElementById('itemName').value; 
    const sku=document.getElementById('itemSKU')?document.getElementById('itemSKU').value:''; 
    const unidade=document.getElementById('itemUnidade')?parseInt(document.getElementById('itemUnidade').value):0; 
    const qty=parseFloat(document.getElementById('itemQuantity').value||0); 
    const resp = await createProduto({sku,nome,id_unidade:unidade,descricao:''}); 
    if(resp.success){ 
        alert('Produto criado'); 
        location.reload(); 
    } else {
        alert('Erro ao criar Produto: ' + (resp.error || resp.detail || JSON.stringify(resp)));
    }
}

// Funções globais auxiliares (do passo anterior)
window.handleEditProduto = async function(id, nomeAtual) {
    const novoNome = prompt('Nome', nomeAtual); 
    if(!novoNome) return; 
    await updateProduto({id_produto:id, nome:novoNome}); 
    location.reload(); 
};

window.handleDeleteProduto = async function(id) {
    if(!confirm('Deletar?')) return; 
    await deleteProduto(id); 
    location.reload();
};

window.loadProdutos = async function(){ 
    const r = await getProdutos(); 
    const t = document.getElementById('itemsList'); 
    if(!t) return; 
    t.innerHTML=''; 
    r.produtos.forEach(p=>{ 
        const tr = document.createElement('tr'); 
        
        // Construção da linha usando DOM, sem tr.innerHTML
        tr.insertCell().textContent = p.id_produto;
        tr.insertCell().textContent = p.sku;
        tr.insertCell().textContent = p.nome;
        tr.insertCell().textContent = p.unidade_sigla;
        
        const actionCell = tr.insertCell();

        // Botão Editar
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-warning me-2';
        editBtn.textContent = 'Editar';
        // Ocultar a complexidade do async/await na função global
        editBtn.onclick = () => window.handleEditProduto(p.id_produto, p.nome); 
        actionCell.appendChild(editBtn);

        // Botão Apagar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.textContent = 'Apagar';
        deleteBtn.onclick = () => window.handleDeleteProduto(p.id_produto);
        actionCell.appendChild(deleteBtn);

        t.appendChild(tr); 
    }); 
}
window.addEventListener('DOMContentLoaded', window.loadProdutos);