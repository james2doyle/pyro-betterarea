/**
 * pyro-betterarea
 * A better textarea that matches braces, parens, backticks, and quotes. Also filled with Markdown helpers.
 * based on: simple-text-editor-library by tovic
 * https://github.com/tovic/simple-text-editor-library
 *
 */
function makeEditor(element) {
  var myEditor = new Editor($(element).find('textarea')[0]),
    tabSize = '  ';

  var insert = function(chars, s) {
    myEditor.insert(chars, function() {
      myEditor.select(s.end + 1, s.end + 1);
    });
    return false;
  };

  // => http://stackoverflow.com/a/7592235/1163000
  String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) {
      return a.toUpperCase();
    });
  };

  myEditor.area.onkeydown = function(e) {

    var area = this,
      sel = myEditor.selection();

    // Auto close for `(`
    if (e.shiftKey && e.keyCode == 57) {
      return insert('(' + sel.value + ')', sel);
    }

    // Auto close for `{`
    if (e.shiftKey && e.keyCode == 219) {
      return insert('{' + sel.value + '}', sel);
    }

    // Auto close for `[`
    if (e.keyCode == 219) {
      return insert('[' + sel.value + ']', sel);
    }

    // Auto close for `"`
    if (e.shiftKey && e.keyCode == 222) {
      return insert('\"' + sel.value + '\"', sel);
    }

    // Auto close for `'`
    if (e.keyCode == 222) {
      return insert('\'' + sel.value + '\'', sel);
    }

    // Auto close for backtick
    if (e.keyCode == 192) {
      return insert('`' + sel.value + '`', sel);
    }

    // Auto close for `<`
    if (e.shiftKey && e.keyCode == 188) {
      return insert('<' + sel.value + '>', sel);
    }

    // `Shift + Tab` to outdent
    if (e.shiftKey && e.keyCode == 9) {
      myEditor.outdent(tabSize);
      return false;
    }

    // `Tab` was pressed
    if (e.keyCode == 9) {

      var isTagName = /(^|\n| |>)([a-z0-9\-\:]+)$/i;

      // Basic auto close for HTML and XML tag
      // write a tag name without `<` or `>` then press your `Tab` key!
      if (sel.before.match(isTagName)) {
        var tagName = isTagName.exec(sel.before)[2],
          before = sel.before.replace(isTagName, '$1');

        area.value = before + '<' + tagName + ' ></' + tagName + '>' + sel.after;
        myEditor.select(sel.start + 2, sel.start + 2);
        return false;
      }

      // `Tab` to indent
      myEditor.indent(tabSize);
      return false;
    }

    // `Backspace` was pressed
    if (e.keyCode == 8 && sel.value.length === 0) {
      if (sel.before.match(new RegExp('(' + tabSize + '|^)$'))) {
        var outdent = sel.before.replace(new RegExp(tabSize + '$'), "");
        area.value = outdent + sel.value + sel.after;
        myEditor.select(outdent.length, outdent.length);
        return false;
      } else if (sel.before.match(/( *?)([0-9]+\.|[\-\+\*]) $/)) {
        myEditor.outdent('( *?)([0-9]+\.|[\-\+\*]) ');
        return false;
      }
    }

    if (e.keyCode == 13) {
      var isListItem = /(^|\n)( *?)([0-9]+\.|[\-\+\*]) (.*?)$/;
      if (sel.before.match(isListItem)) {
        var take = isListItem.exec(sel.before),
          list = /[0-9]+\./.test(take[3]) ? parseInt(take[3], 10) + 1 + '.' : take[3]; // <ol> or <ul> ?
        myEditor.insert('\n' + take[2] + list + ' ');
        return false;
      } else {
        var getIndentBefore = /(^|\n)( +)(.*?)$/.exec(sel.before),
          indentBefore = getIndentBefore ? getIndentBefore[2] : "";
        if (sel.before.match(/[\[\{\(\<\>]$/) && sel.after.match(/^[\]\}\)\>\<]/)) {
          myEditor.insert('\n' + indentBefore + tabSize + '\n' + indentBefore, function() {
            myEditor.select(sel.start + indentBefore.length + tabSize.length + 1, sel.start + indentBefore.length + tabSize.length + 1);
          });
          return false;
        }
        myEditor.insert('\n' + indentBefore);
        return false;
      }
    }

    // Right arrow was pressed
    if (e.keyCode == 39) {
      if (sel.after.match(/^<\/.*>/)) {
        var jump = sel.start + sel.after.indexOf('>') + 1;
        myEditor.select(jump, jump);
        return false;
      }
    }

    // console.log(e.keyCode);

  };

  var controls = {
    'bold': function() {
      myEditor.wrap('**', '**');
    },
    'italic': function() {
      myEditor.wrap('_', '_');
    },
    'code': function() {
      myEditor.wrap('`', '`');
    },
    'code-block': function() {
      myEditor.indent('    ');
    },
    'quote': function() {
      myEditor.indent('> ');
    },
    'ul-list': function() {
      var sel = myEditor.selection(),
        added = "";
      if (sel.value.length > 0) {
        myEditor.indent('', function() {
          myEditor.replace(/^[^\n\r]/gm, function(str) {
            added += '- ';
            return str.replace(/^/, '- ');
          });
          myEditor.select(sel.start, sel.end + added.length);
        });
      } else {
        var placeholder = '- List Item';
        myEditor.indent(placeholder, function() {
          myEditor.select(sel.start + 2, sel.start + placeholder.length);
        });
      }
    },
    'ol-list': function() {
      var sel = myEditor.selection(),
        ol = 0,
        added = "";
      if (sel.value.length > 0) {
        myEditor.indent('', function() {
          myEditor.replace(/^[^\n\r]/gm, function(str) {
            ol++;
            added += ol + '. ';
            return str.replace(/^/, ol + '. ');
          });
          myEditor.select(sel.start, sel.end + added.length);
        });
      } else {
        var placeholder = '1. List Item';
        myEditor.indent(placeholder, function() {
          myEditor.select(sel.start + 3, sel.start + placeholder.length);
        });
      }
    },
    'link': function() {
      var sel = myEditor.selection(),
        title = prompt('Link Title:', 'Link title goes here...'),
        url = prompt('Link URL:', 'http://'),
        placeholder = 'Your link text goes here...';
      if (url && url !== "" && url !== 'http://') {
        myEditor.wrap('[' + (sel.value.length === 0 ? placeholder : ''), '](' + url + (title !== "" ? ' \"' + title + '\"' : '') + ')', function() {
          myEditor.select(sel.start + 1, (sel.value.length === 0 ? sel.start + placeholder.length + 1 : sel.end + 1));
        });
      }
      return false;
    },
    'image': function() {
      var url = prompt('Image URL:', 'http://'),
        alt = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.')).replace(/[\-\_\+]+/g, " ").capitalize();
      alt = alt.indexOf('/') < 0 ? decodeURIComponent(alt) : 'Image';
      if (url && url !== "" && url !== 'http://') {
        myEditor.insert('\n\n![' + alt + '](' + url + ')\n\n');
      }
      return false;
    },
    'h1': function() {
      heading('#');
    },
    'h2': function() {
      heading('##');
    },
    'h3': function() {
      heading('###');
    },
    'h4': function() {
      heading('####');
    },
    'h5': function() {
      heading('#####');
    },
    'h6': function() {
      heading('######');
    },
    'hr': function() {
      myEditor.insert('\n\n---\n\n');
    },
    'undo': function() {
      myEditor.undo();
    },
    'redo': function() {
      myEditor.redo();
    }
  };

  function heading(key) {
    if (myEditor.selection().value.length > 0) {
      myEditor.wrap(key + ' ', "");
    } else {
      var placeholder = key + ' Heading ' + key.length + '\n\n';
      myEditor.insert(placeholder, function() {
        var s = myEditor.selection().start;
        myEditor.select(s - placeholder.length + key.length + 1, s - 2);
      });
    }
  }

  var $myButton = $(element).find('.editor-control a');
  $myButton.each(function(index, elem) {
    var hash = elem.hash.replace('#', "");
    if (controls[hash]) {
      elem.onclick = function() {
        controls[hash]();
        return false;
      };
    }
  });
}

$(function() {
  $('.betterarea').each(function(index, el) {
    makeEditor(el);
  });
});