import { useState, useEffect } from 'react'

function App() {
  const [form, setForm] = useState({
    grupo: '',
    subgrupo: '',
    familia: '',
    linha: '',
    dimensoes: '',
    codigoSeq: ''
  })

  const [options, setOptions] = useState({
    grupo: ['MEC', 'ELT', 'PNM'],
    subgrupo: ['EIXO', 'SUP', 'CONEC'],
    familia: ['TRANSP', 'GUIA', 'ESTR'],
    linha: []
  })

  const [cadastrados, setCadastrados] = useState([])

  const API_URL = 'https://script.google.com/macros/s/AKfycbzFLAnDBrGj7LejjIEvGX_v6r1Y1ycNLe5I4gLuQKR-VmfMnVpXrAD51AcmaoVRQMrxGQ/exec'

  useEffect(() => {
    fetch(`${API_URL}?action=read`)
      .then(res => res.json())
      .then(data => setCadastrados(data))
      .catch(err => console.error('Erro ao buscar dados:', err))
  }, [])

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value.toUpperCase() })
  }

  const handleAddOption = (field) => {
    const novo = prompt(`Adicionar novo ${field}:`)
    if (novo) {
      setOptions((prev) => ({
        ...prev,
        [field]: [...new Set([...prev[field], novo.toUpperCase()])]
      }))
    }
  }

  const gerarNome = () => {
    const { grupo, subgrupo, familia, linha, dimensoes, codigoSeq } = form
    if (!grupo || !subgrupo || !familia || !linha || !dimensoes || !codigoSeq) return ''
    return `${grupo}-${subgrupo}-${familia}-${linha}-${dimensoes}-${codigoSeq}`
  }

  const handleSalvar = () => {
    const nome = gerarNome()
    if (!nome) return
    if (cadastrados.some(item => item.nome === nome)) {
      alert('Código já cadastrado!')
      return
    }

    const novoItem = {
      grupo: form.grupo,
      subgrupo: form.subgrupo,
      familia: form.familia,
      linha: form.linha,
      dimensoes: form.dimensoes,
      codigoSeq: form.codigoSeq,
      nome: nome
    }

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'append', data: novoItem })
    })
      .then(() => {
        setCadastrados(prev => [...prev, novoItem])
        setForm({ grupo: '', subgrupo: '', familia: '', linha: '', dimensoes: '', codigoSeq: '' })
      })
      .catch(err => console.error('Erro ao salvar:', err))
  }

  const renderSelect = (label, field) => (
    <div>
      <label>{label}</label><br />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <select value={form[field]} onChange={handleChange(field)}>
          <option value="">Selecione</option>
          {options[field].map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button type="button" onClick={() => handleAddOption(field)}>+</button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', maxWidth: 1000, margin: '2rem auto', gap: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ flex: 1 }}>
        <h2>Nomenclatura de Peças</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {renderSelect('Grupo', 'grupo')}
          {renderSelect('Subgrupo', 'subgrupo')}
          {renderSelect('Família', 'familia')}
          {renderSelect('Linha de Equipamento', 'linha')}
          <div>
            <label>Dimensões</label><br />
            <input value={form.dimensoes} onChange={handleChange('dimensoes')} />
          </div>
          <div>
            <label>Código Sequencial</label><br />
            <input value={form.codigoSeq} onChange={handleChange('codigoSeq')} />
          </div>
          <div>
            <button type="button" onClick={handleSalvar}>Salvar Nome</button>
          </div>
          <div style={{ marginTop: '1rem', background: '#eee', padding: '1rem', fontFamily: 'monospace' }}>
            {gerarNome() || 'Preencha todos os campos...'}
          </div>
        </div>
      </div>
      <div style={{ width: 300 }}>
        <h3>Códigos já cadastrados</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto', background: '#f9f9f9', border: '1px solid #ccc', padding: '0.5rem' }}>
          {cadastrados.length === 0 ? (
            <p style={{ fontStyle: 'italic' }}>Nenhum código ainda</p>
          ) : (
            <ul style={{ paddingLeft: '1rem' }}>
              {cadastrados.map((item, index) => (
                <li key={index}>{item.nome}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App


