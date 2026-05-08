#!/usr/bin/env node
/**
 * generate-index.js
 * Liest den data/ Ordner rekursiv und schreibt data/index.json
 * Aufruf: node generate-index.js
 */

const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, 'data')

function readDir(dir, relativePath = '') {
  const entries = fs.readdirSync(dir)
  const items = []

  for (const entry of entries) {
    if (entry.startsWith('.')) continue // .folder.json etc überspringen
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      const children = readDir(fullPath, relativePath ? `${relativePath}/${entry}` : entry)
      items.push({
        type: 'folder',
        name: entry,
        children
      })
    } else if (entry.endsWith('.json')) {
      try {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
        items.push({
          type: 'question',
          id: content.id,
          text: content.text,
          answers: content.answers,
          correctAnswers: content.correctAnswers
        })
      } catch (e) {
        console.warn(`Überspringe ${fullPath}: ${e.message}`)
      }
    }
  }

  return items
}

const index = readDir(DATA_DIR)
fs.writeFileSync(path.join(DATA_DIR, 'index.json'), JSON.stringify(index, null, 2))
console.log('✅ data/index.json erstellt')
