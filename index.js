"use strict";
const visit = require(`unist-util-visit`);
const bibtexParse = require(`bibtex-parse-js`);
const remarkMath = require(`remark-math`);

module.exports = ({ markdownAST }, { components }) => {


function author_string(ent, template, sep, finalSep){
  if (ent.author == null) { return ''; }
  var names = ent.author.split(' and ');
  let name_strings = names.map(name => {
    name = name.trim();
    if (name.indexOf(',') != -1){
      var last = name.split(',')[0].trim();
      var firsts = name.split(',')[1];
    } else {
      var last = name.split(' ').slice(-1)[0].trim();
      var firsts = name.split(' ').slice(0,-1).join(' ');
    }
    var initials = '';
    if (firsts != undefined) {
      initials = firsts.trim().split(' ').map(s => s.trim()[0]);
      initials = initials.join('.')+'.';
    }
    return template.replace('${F}', firsts)
      .replace('${L}', last)
      .replace('${I}', initials);
  });
  if (names.length > 1) {
    var str = name_strings.slice(0, names.length-1).join(sep);
    str += (finalSep || sep) + name_strings[names.length-1];
    return str;
  } else {
    return name_strings[0];
  }
}

function venue_string(ent) {
  var cite = (ent.journal || ent.booktitle || '');
  if ('volume' in ent){
    var issue = ent.issue || ent.number;
    issue = (issue != undefined)? '('+issue+')' : '';
    cite += ', Vol ' + ent.volume + issue;
  }
  if ('pages' in ent){
    cite += ', pp. ' + ent.pages;
  }
  if (cite != '') cite += '. ';
  if ('publisher' in ent){
    cite += ent.publisher;
    if (cite[cite.length-1] != '.') cite += '.';
  }
  return cite;
}

function link_string(ent){
  if ('url' in ent){
    var url = ent.url;
    var arxiv_match = (/arxiv\.org\/abs\/([0-9\.]*)/).exec(url);
    if (arxiv_match != null){
      url = `http://arxiv.org/pdf/${arxiv_match[1]}.pdf`;
    }

    if (url.slice(-4) == '.pdf'){
      var label = 'PDF';
    } else if (url.slice(-5) == '.html') {
      var label = 'HTML';
    }
    return ` &ensp;<a href="${url}">[${label||'link'}]</a>`;
  }/* else if ("doi" in ent){
    return ` &ensp;<a href="https://doi.org/${ent.doi}" >[DOI]</a>`;
  }*/ else {
    return '';
  }
}
function doi_string(ent, new_line){
  if ('doi' in ent) {
    return `${new_line?'<br>':''} <a href="https://doi.org/${ent.doi}" style="text-decoration:inherit;">DOI: ${ent.doi}</a>`;
  } else {
    return '';
  }
}

function bibliography_cite(ent, fancy){
  if (ent){
    var cite =  '<b>' + ent.title + '</b> ';
    cite += link_string(ent) + '<br>';
    cite += author_string(ent, '${L}, ${I}', ', ', ' and ');
    if (ent.year || ent.date){
      cite += ', ' + (ent.year || ent.date) + '. ';
    } else {
      cite += '. ';
    }
    cite += venue_string(ent);
    cite += doi_string(ent);
    return cite;
    /*var cite =  author_string(ent, "${L}, ${I}", ", ", " and ");
    if (ent.year || ent.date){
      cite += ", " + (ent.year || ent.date) + ". "
    } else {
      cite += ". "
    }
    cite += "<b>" + ent.title + "</b>. ";
    cite += venue_string(ent);
    cite += doi_string(ent);
    cite += link_string(ent);
    return cite*/
  } else {
    return '?';
  }
}

function hover_cite(ent){
  if (ent){
    var cite = '';
    cite += '<b>' + ent.title + '</b>';
    cite += link_string(ent);
    cite += '<br>';

    var a_str = author_string(ent, '${I} ${L}', ', ') + '.';
    var v_str = venue_string(ent).trim() + ' ' + ent.year + '. ' + doi_string(ent, true);

    if ((a_str+v_str).length < Math.min(40, ent.title.length)) {
      cite += a_str + ' ' + v_str;
    } else {
      cite += a_str + '<br>' + v_str;
    }
    return cite;
  } else {
    return '?';
  }
}

var citations = [];
function inline_cite_short(keys, bibliography){
  function cite_string(key){
    if (bibliography.get(key)){
      if (!(key in citations)) {
        citations.push(key)
      }
      var n = citations.indexOf(key)+1;
      return ''+n;
    } else {
      return '?';
    }
  }
  return '['+keys.map(cite_string).join(', ')+']';
}

const bibliography = new Map();
  visit(markdownAST, "html", (node, index, parent) => {
    if (node.value.startsWith(`<bibliography>`)) {
      parent.type = "div"

      let bibtex = node.value;
      bibtex = bibtex.replace("<bibliography>", "").replace("</bibliography>", "")
      const parsedEntries = bibtexParse.toJSON(bibtex);
      for (const entry of parsedEntries) {
        for (const [key, value] of Object.entries(entry.entryTags)) {
          entry.entryTags[key.toLowerCase()] = normalizeTag(value);
        }
        entry.entryTags.type = entry.entryType;
        bibliography.set(entry.citationKey, entry.entryTags);
      }
    }
  })

  console.log(bibliography);
  visit(markdownAST, `text`, node => {
    var citekeys = node.value.match(/\\cite{([^}]*)}/g);
    //console.log(citekeys);
    for (var k in citekeys) {
      const keys_str = citekeys[k].substring(6, citekeys[k].length - 1);
      const keys = keys_str.split(',');

      const cite_string = inline_cite_short(keys, bibliography);
      console.log(cite_string);
      var cite_hover_str = '';
      keys.map((key,n) => {
        if (n>0) cite_hover_str += '<br><br>';
        //cite_hover_str += hover_cite(bibliography.get(key));
      });
      var n = 0;

      const orig_string = '';//node.value;
      const replacement = `<span id="citation-${n}" data-hover="${cite_hover_str}">${orig_string}<span class="citation-number">${cite_string}</span></span>`;
      console.log(keys_str);
      node.type = `html`;
      node.value = node.value.replace("\\cite{" + keys_str + "}", replacement);
    }
  });

  visit(markdownAST, "html", (node, index, parent) => {
    if (node.value.startsWith(`<bibliography>`)) {
      let res = '<ol>';

      citations.forEach(key => {
        res +=  '<li>' + bibliography_cite(bibliography.get(key)) + '</li>';
      });
      res += '</ol>';
      node.value = res;
    }
  });

  function normalizeTag(string) {
    return string
      .replace(/[\t\n ]+/g, ' ')
      .replace(/{\\["^`.'acu~Hvs]( )?([a-zA-Z])}/g, (full, x, char) => char)
      .replace(/{\\([a-zA-Z])}/g, (full, char) => char);
  }

}