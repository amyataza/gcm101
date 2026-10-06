// Minimal, safe Markdown renderer shared by the content pipeline (Node) and the app (browser).
// Supports what the GCM-101 syllabus uses: headings, paragraphs, bold/italic, inline code,
// fenced code, pipe tables, nested lists, task lists, callouts, links, autolinks and rules.
// All text is HTML-escaped first; only the tags generated here can appear in the output.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
const UNESC = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const unescapeHtml = (s) => String(s).replace(/&(amp|lt|gt|quot|#39);/g, (m) => UNESC[m]);

const REF_RE = /\[((?:S|R|D)\d{1,2})\]/g;
const refLink = (code) => {
  const kind = code[0] === 'D' ? 'decision' : 'source';
  return `<a class="ref" href="#/sources/${code}" data-ref="${code}" aria-label="${kind} ${code}">${code}</a>`;
};

function safeUrl(url) {
  const u = url.trim();
  if (/^(https?:|mailto:|#)/i.test(u)) return u;
  return '#';
}

export function inline(text) {
  // Protect code spans first so their contents are not formatted.
  const codes = [];
  let s = String(text).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `\u0000${codes.length - 1}\u0000`;
  });
  s = escapeHtml(s);
  // Autolinks <https://...> (escaped to &lt;...&gt;)
  s = s.replace(/&lt;(https?:\/\/\S+?)&gt;/g, (_, u) => {
    const url = unescapeHtml(u);
    return `<a href="${escapeHtml(safeUrl(url))}" rel="noopener" target="_blank">${u}</a>`;
  });
  // Links [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    const url = unescapeHtml(u);
    return `<a href="${escapeHtml(safeUrl(url))}" rel="noopener" target="_blank">${t}</a>`;
  });
  // Reference codes [S1] [R4] [D13]
  s = s.replace(REF_RE, (_, c) => refLink(c));
  // Bold then italics
  s = s.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?=[^*\w]|$)/g, '$1<em>$2</em>');
  // Restore code spans; a span that only holds reference codes becomes links.
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => {
    const c = codes[Number(i)];
    if (/^\[(?:S|R|D)\d{1,2}\](?:[,\s]*\[(?:S|R|D)\d{1,2}\])*$/.test(c)) {
      return c.replace(REF_RE, (_, code) => refLink(code));
    }
    return `<code>${escapeHtml(c)}</code>`;
  });
  return s;
}

function splitRow(line) {
  let l = line.trim();
  if (l.startsWith('|')) l = l.slice(1);
  if (l.endsWith('|')) l = l.slice(0, -1);
  // Split on pipes that are not inside code spans.
  const cells = [];
  let cur = '';
  let inCode = false;
  for (const ch of l) {
    if (ch === '`') inCode = !inCode;
    if (ch === '|' && !inCode) {
      cells.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

export function parseTable(lines) {
  const header = splitRow(lines[0]);
  const align = splitRow(lines[1]).map((c) =>
    /^:-+:$/.test(c) ? 'center' : /^-+:$/.test(c) ? 'right' : null,
  );
  const rows = lines.slice(2).map(splitRow);
  return { header, align, rows };
}

function renderTable(lines, opts) {
  const { header, align, rows } = parseTable(lines);
  const al = (i) => (align[i] ? ` style="text-align:${align[i]}"` : '');
  let html = `<div class="table-wrap" tabindex="0" role="region" aria-label="${escapeHtml(opts.tableLabel || 'Table')}"><table>`;
  html += '<thead><tr>' + header.map((h, i) => `<th scope="col"${al(i)}>${inline(h)}</th>`).join('') + '</tr></thead><tbody>';
  for (const r of rows) {
    html += '<tr>' + r.map((c, i) => (i === 0 ? `<th scope="row"${al(i)}>${inline(c)}</th>` : `<td${al(i)}>${inline(c)}</td>`)).join('') + '</tr>';
  }
  return html + '</tbody></table></div>';
}

function renderList(lines) {
  // Build a nested list from indentation (2 spaces per level).
  const root = { children: [], ordered: false };
  const stack = [{ indent: -1, node: root }];
  for (const raw of lines) {
    const m = raw.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (!m) {
      // continuation line
      const last = stack[stack.length - 1].node;
      const item = last.children[last.children.length - 1];
      if (item) item.text += ' ' + raw.trim();
      continue;
    }
    const indent = m[1].length;
    const ordered = /\d/.test(m[2]);
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const listNode = stack[stack.length - 1].node;
    if (listNode.children.length === 0) listNode.ordered = ordered;
    const item = { text: m[3], sub: { children: [], ordered: false } };
    listNode.children.push(item);
    stack.push({ indent, node: item.sub });
  }
  const render = (list) => {
    if (!list.children.length) return '';
    const tag = list.ordered ? 'ol' : 'ul';
    const isTask = list.children.every((c) => /^\[[ xX]\]\s/.test(c.text));
    return `<${tag}${isTask ? ' class="tasks"' : ''}>` +
      list.children.map((c) => {
        let t = c.text;
        let pre = '';
        const tm = t.match(/^\[([ xX])\]\s(.*)$/);
        if (tm) {
          pre = `<span class="task-box" aria-hidden="true">${tm[1].trim() ? '☑' : '☐'}</span> `;
          t = tm[2];
        }
        return `<li>${pre}${inline(t)}${render(c.sub)}</li>`;
      }).join('') + `</${tag}>`;
  };
  return render(root);
}

export function render(md, opts = {}) {
  const lines = String(md).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const headingShift = opts.headingShift ?? 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { i++; continue; }
    // fenced code
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const lang = fence[1] || 'text';
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre class="code" tabindex="0" data-lang="${escapeHtml(lang)}"><code>${escapeHtml(buf.join('\n'))}</code></pre>`);
      continue;
    }
    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = Math.min(6, h[1].length + headingShift);
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }
    // rule
    if (/^-{3,}\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
    // table
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-+/.test(lines[i + 1])) {
      const buf = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) buf.push(lines[i++]);
      out.push(renderTable(buf, opts));
      continue;
    }
    // blockquote / callout
    if (/^>/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      const cm = buf[0].match(/^\[!(\w+)\]\s*(.*)$/);
      if (cm) {
        out.push(`<aside class="callout callout-${escapeHtml(cm[1].toLowerCase())}"><p class="callout-title">${inline(cm[2] || cm[1])}</p>${render(buf.slice(1).join('\n'), opts)}</aside>`);
      } else {
        out.push(`<blockquote>${render(buf.join('\n'), opts)}</blockquote>`);
      }
      continue;
    }
    // list
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const buf = [];
      while (i < lines.length && (/^\s*([-*]|\d+\.)\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && buf.length))) {
        buf.push(lines[i++]);
      }
      out.push(renderList(buf));
      continue;
    }
    // paragraph: gather until blank or block start
    const buf = [];
    while (
      i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6}\s|```|>|\s*\||\s*([-*]|\d+\.)\s+|-{3,}\s*$)/.test(lines[i])
    ) buf.push(lines[i++].trim());
    if (buf.length) out.push(`<p>${inline(buf.join(' '))}</p>`);
    else i++;
  }
  return out.join('\n');
}

// Plain text for narration and search: strip Markdown syntax.
export function plain(md) {
  return String(md)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/<https?:[^>]+>/g, '')
    .replace(/\*\*?([^*]+)\*\*?/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/^\s*[-*]\s+(\[[ xX]\]\s+)?/gm, '')
    .replace(/^>\s?(\[!\w+\]\s*)?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}
